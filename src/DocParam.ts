import { DocElement } from './DocElement.js';
import type { DocParentTypes } from './DocBase.js';
import { RawDocumentedParam } from './InterfacesForDocElements.js';

export class DocParam extends DocElement {
	public optional: boolean | undefined;
	public variable: boolean | undefined;

	constructor(parent: DocParentTypes, data: RawDocumentedParam) {
		super(parent.doc, DocElement.types.PARAM, data, parent);
		this.type = data.type?.flat(5) || null;
		this.optional = data.optional;
		this.variable = data.variable;
	}

	get formattedName(): string {
		return this.optional ? `\`[${this.name}]\`` : `\`${this.name}\``;
	}

	get formattedType(): string {
		if (!this.variable) return super.formattedType;
		return super.formattedType
			.split('|')
			.map((param) => `...${param}`)
			.join('|');
	}

	get url(): null {
		return null;
	}
}
