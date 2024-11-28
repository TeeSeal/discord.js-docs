import { DocAllTypes, DocBase, DocParentTypes, types } from './DocBase.js';
import { stripIndents } from 'common-tags';
import type { Doc } from './Doc.js';
import {
	RawDocumentedItemMeta,
	RawDocumentedClass,
	RawDocumentedEvent,
	RawDocumentedInterface,
	RawDocumentedFunction,
	RawDocumentedParam,
	RawDocumentedMember,
	RawDocumentedTypedef,
} from './InterfacesForDocElements.js';
import {
	JSDocDeprecated,
	JSDocExamples,
	JSDocAccess,
	JSDocExtends,
	JSDocImplements,
	JSDocScope,
	JSDocReturns,
} from './JsDocTypes.js';
import { APIEmbed } from './MessageEmbed.js';

export type RawDocumentedElement =
	| RawDocumentedClass
	| RawDocumentedEvent
	| RawDocumentedInterface
	| RawDocumentedFunction
	| RawDocumentedParam
	| RawDocumentedMember
	| RawDocumentedTypedef;

const DESCRIPTION_LIMIT = 1500;

export type EmbedOptions = {
	excludePrivateElements?: boolean;
	maxResults?: number;
}

export type DocElementJSON = {
	name?: string | null;
	description?: string | null;
	internal_type?: types;
	props?: Array<string | null>;
	parent?: string;
	methods?: Array<string | null>;
	events?: Array<string | null>;
	params?: DocElementJSON[];
	type?: string;
	examples?: JSDocExamples;
}

export class DocElement extends DocBase {
	public name: string | null = null;
	public description: string | null = null;
	public meta: RawDocumentedItemMeta | null;
	public returns: JSDocReturns | null = null;
	public examples: JSDocExamples | null = null;
	public type: string[] | null = null;
	public nullable: boolean | null = null;
	public deprecated: JSDocDeprecated;
	public access: JSDocAccess | null;
	public extends: JSDocExtends | null = null;
	public implements: JSDocImplements | null = null;
	public scope: JSDocScope | null = null;

	constructor(
		public doc: Doc,
		public docType: types,
		data: RawDocumentedElement,
		public parent: DocParentTypes | null = null,
	) {
		super(data);
		this.name = data.name || null;
		this.description = data.description || null;
		this.meta = 'meta' in data ? data.meta : null;
		this.deprecated = 'deprecated' in data && data.deprecated ? data.deprecated : false;
		this.access = 'access' in data && data.access ? data.access : 'public';
	}

	get embedPrefix(): string | null {
		const { types } = DocElement;
		const emoji = (char: string) => `:regional_indicator_${char}:`;

		switch (this.docType) {
		case types.CLASS:
			return emoji('c');
		case types.EVENT:
			return emoji('e');
		case types.INTERFACE:
			return emoji('i');
		case types.METHOD:
			return emoji('m');
		case types.TYPEDEF:
			return emoji('t');
		case types.PROP:
			return emoji('p');
		default:
			return null;
		}
	}

	get anchor(): string | null {
		if (this.static) return 's-';
		else if (this.docType === DocElement.types.EVENT) return 'e-';
		return null;
	}

	get typeElement(): DocAllTypes | null {
		const { type } = this;

		if (!type) return null;

		return (
			type
				?.filter((text: string) => /^\w+$/.test(text))
				.map((text: string) => this.doc.findChild(text.toLowerCase()))
				.find((elem) => elem) ?? null
		);
	}

	get url(): string | null {
		if (!this.doc.baseDocsURL) return null;

		const path = this.parent
			? `${this.parent.docType}/${this.parent.name}?scrollTo=${this.anchor || ''}${this.name}`
			: `${this.docType}/${this.name}`;

		return `${this.doc.baseDocsURL}/${path}`;
	}

	get sourceURL(): string | null {
		if (!this.doc.repoURL || !this.meta) return null;

		const { path, file, line } = this.meta;
		return `${this.doc.repoURL}/${path}/${file}#L${line}`;
	}

	get formattedName(): string | null {
		return this.name;
	}

	get formattedDescription(): string {
		let result = this.formatText(this.description);

		if (result.length > DESCRIPTION_LIMIT) {
			result =
				result.slice(0, DESCRIPTION_LIMIT) +
				`...\nDescription truncated. View full description [here](${this.url}).`;
		}

		return result;
	}

	get formattedReturn(): string {
		if (this.returns) return '';
		return this.formatText(this.returns);
	}

	get formattedType(): string {
		const { type: thisType } = this;
		if (!thisType) return '';
		return `${this.nullable ? '?' : ''}${this.doc.formatType(thisType)}`;
	}

	get formattedExtends(): string {
		const { extends: thisExtends } = this;
		if (!thisExtends) return '';
		return `(extends ${this.formatInherits(thisExtends)})`;
	}

	get formattedImplements(): string {
		const { implements: thisImplements } = this;
		if (!thisImplements) return '';
		return `(implements ${this.formatInherits(thisImplements)})`;
	}

	get link(): string {
		return `[${this.formattedName}](${this.url})`;
	}

	get static(): boolean {
		return this.scope === 'static';
	}

	embed(options = {}): APIEmbed {
		const embed = this.doc.baseEmbed();
		let name = `__**${this.link}**__`;

		if (this.extends) name += ` ${this.formattedExtends}`;
		if (this.implements) name += ` ${this.formattedImplements}`;
		if (this.access === 'private') name += ' **PRIVATE**';
		if (this.deprecated) name += ' **DEPRECATED**';

		embed.description = `${name}\n${this.formattedDescription}`;
		if (this.url) embed.url = this.url;
		embed.fields = [];
		this.formatEmbed(embed, options);
		embed.fields.push({
			name: '\u200b',
			value: `[View source](${this.sourceURL})`,
		});

		return embed;
	}

	formatEmbed(embed: APIEmbed, options: EmbedOptions = {}): void {
		this.attachProps(embed, options);
		this.attachMethods(embed, options);
		this.attachEvents(embed);
		this.attachParams(embed);
		this.attachType(embed);
		this.attachReturn(embed);
		this.attachExamples(embed);
	}

	attachProps(embed: APIEmbed, { excludePrivateElements }: EmbedOptions = {}): void {
		if (!this.props) return;

		let props = this.props;
		if (excludePrivateElements) props = props.filter((prop) => prop.access !== 'private');
		if (props.length === 0) return;
		if (!embed.fields) embed.fields = [];

		embed.fields.push({
			name: 'Properties',
			value: props.map((prop) => `\`${prop.name}\``).join(' '),
		});
	}

	attachMethods(embed: APIEmbed, { excludePrivateElements }: EmbedOptions = {}): void {
		if (!this.methods) return;

		let methods = this.methods;
		if (excludePrivateElements) methods = methods.filter((prop) => prop.access !== 'private');
		if (methods.length === 0) return;
		if (!embed.fields) embed.fields = [];

		embed.fields.push({
			name: 'Methods',
			value: methods.map((method) => `\`${method.name}\``).join(' '),
		});
	}

	attachEvents(embed: APIEmbed): void {
		if (!this.events) return;
		if (!embed.fields) embed.fields = [];

		embed.fields.push({
			name: 'Events',
			value: this.events.map((event) => `\`${event.name}\``).join(' '),
		});
	}

	attachParams(embed: APIEmbed): void {
		if (!this.params) return;
		const params = this.params.map(
			(param) =>
				stripIndents`
		${param.formattedName} ${param.formattedType}
		${param.formattedDescription}
	  `,
		);

		const slice = params.splice(0, 5);
		if (!embed.fields) embed.fields = [];
		embed.fields.push({ name: 'Params', value: slice.join('\n\n') });

		while (params.length > 0) {
			const slice = params.splice(0, 5);
			embed.fields.push({ name: '\u200b', value: slice.join('\n\n') });
		}
	}

	attachReturn(embed: APIEmbed): void {
		if (!this.returns) return;
		if (!embed.fields) embed.fields = [];
		embed.fields.push({
			name: 'Returns',
			value: this.formattedReturn,
		});
	}

	attachType(embed: APIEmbed): void {
		if (!this.type) return;
		if (!embed.fields) embed.fields = [];
		embed.fields.push({
			name: 'Type',
			value: this.formattedType,
		});
	}

	attachExamples(embed: APIEmbed): void {
		if (!this.examples) return;
		if (!embed.fields) embed.fields = [];
		embed.fields.push({
			name: 'Examples',
			value: this.examples.map((ex) => `\`\`\`js\n${ex}\n\`\`\``).join('\n'),
		});
	}

	toJSON(): DocElementJSON {
		const json: DocElementJSON = {
			name: this.name,
			description: this.description,
			internal_type: this.docType,
		};

		if (this.props) json.props = this.props.map((prop) => prop.name);
		if (this.parent) json.parent = this.parent.name || undefined;
		if (this.methods) json.methods = this.methods.map((method) => method.name);
		if (this.events) json.events = this.events.map((event) => event.name);
		if (this.params) json.params = this.params.map((param) => param.toJSON());
		if (this.type) json.type = this.type.join('');
		if (this.examples) json.examples = this.examples;

		return json;
	}

	formatInherits(inherits: JSDocImplements): string {
		const flatInherits = inherits.flat(Infinity) as string[];
		return flatInherits.map((baseClass) => this.doc.formatType([baseClass])).join(' and ');
	}

	formatText(text: string | null | undefined): string {
		if (!text) return '';

		return text
			.replace(/\{@link (.+?)\}/g, (match, name) => {
				const element = this.doc.get(...name.split(/\.|#/));
				return element ? element.link : name;
			})
			.replace(/(```[^]+?```)|(^[*-].+$)?\n(?![*-])/gm, (match, codeblock, hasListBefore) => {
				if (codeblock) return codeblock;
				if (hasListBefore) return match;
				return ' ';
			})
			.replace(/<(info|warn)>([^]+?)<\/(?:\1)>/g, '\n**$2**\n')
			.replace(/<\/?p>/g, '') // remove paragraph tags
			.replace(/<\/?code>/g, '`') // format code tags
			.replace(/<a href="(.+)">(.+)<\/a>/g, '[$2]($1)'); // format anchor tags
	}

	static get types(): typeof types {
		return DocBase.types;
	}
}
