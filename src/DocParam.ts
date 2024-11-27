import { DocElement } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedParam } from "./InterfacesForDocElements";

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
            .split("|")
            .map((param) => `...${param}`)
            .join("|");
    }

    get url(): null {
        return null;
    }
}
