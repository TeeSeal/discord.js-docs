import { DocClass } from './DocClass.js';
import { RawDocumentedElement } from './DocElement.js';
import { DocEvent } from './DocEvent.js';
import { DocInterface } from './DocInterface.js';
import { DocMethod } from './DocMethod.js';
import { DocParam } from './DocParam.js';
import { DocProp } from './DocProp.js';
import { DocTypedef } from './DocTypedef.js';

export enum types {
	CLASS = 'class',
	EVENT = 'event',
	INTERFACE = 'interface',
	METHOD = 'method',
	PARAM = 'param',
	PROP = 'prop',
	TYPEDEF = 'typedef',
}

type typesMapper = {
	class: DocClass;
	event: DocEvent;
	interface: DocInterface;
	method: DocMethod;
	param: DocParam;
	prop: DocProp;
	typedef: DocTypedef;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constr<T> = new (...args: any[]) => T;
export type DocParentTypes = DocClass | DocInterface | DocMethod | DocEvent;
export type DocAllTypes = DocClass | DocEvent | DocInterface | DocMethod | DocParam | DocProp | DocTypedef;
export class DocBase {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public originalJSON: any;
	public children: Map<string, DocAllTypes>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(json: any) {
		this.originalJSON = json;
		this.children = new Map();
	}

	addChild(child: DocAllTypes): void {
		this.children.set(`${child.name?.toLowerCase()}-${child.docType}`, child);
	}

	adoptAll(enumerable: RawDocumentedElement[], Constructor: Constr<DocAllTypes>): void {
		if (!enumerable) return;
		for (const elem of enumerable) {
			this.addChild(new Constructor(this, elem));
		}
	}

	childrenOfType<t extends keyof typesMapper>(type: t): Array<typesMapper[t]> | null {
		const filtered = Array.from(this.children.values()).filter(
			(child) => child.docType === type,
		) as typesMapper[t][];

		return filtered.length ? filtered : null;
	}

	findChild(query: string, exclude: DocAllTypes[] = []): DocAllTypes | undefined {
		query = query.toLowerCase();

		let docType: types | null = null;
		if (query.endsWith('()')) {
			query = query.slice(0, -2);
			docType = types.METHOD;
		} else if (query.startsWith('e-')) {
			query = query.slice(2);
			docType = types.EVENT;
		}
		return Array.from(this.children.values()).find(
			(child) =>
				child.name &&
				!exclude.includes(child) &&
				child.name.toLowerCase() === query &&
				(!docType || child.docType === docType),
		);
	}

	get classes(): DocClass[] | null {
		return this.childrenOfType(types.CLASS);
	}

	get typedefs(): DocTypedef[] | null {
		return this.childrenOfType(types.TYPEDEF);
	}

	get interfaces(): DocInterface[] | null {
		return this.childrenOfType(types.INTERFACE);
	}

	get props(): DocProp[] | null {
		return this.childrenOfType(types.PROP);
	}

	get methods(): DocMethod[] | null {
		return this.childrenOfType(types.METHOD);
	}

	get events(): DocEvent[] | null {
		return this.childrenOfType(types.EVENT);
	}

	get params(): DocParam[] | null {
		return this.childrenOfType(types.PARAM);
	}

	static get types(): typeof types {
		return types;
	}
}
