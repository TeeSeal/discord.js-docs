import { DocElement } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedMember } from "./InterfacesForDocElements";

export class DocProp extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedMember) {
        super(parent.doc, DocElement.types.PROP, data, parent);
        this.scope = data.scope || null;
        this.type = (Array.isArray(data.type) ? data.type : data.type?.types)?.flat(5) || null;
        this.nullable = data.nullable || false;
    }

    get formattedName(): string {
        if (!this.parent) return "";
        return [this.parent.name, this.static ? "." : "#", this.name].join("");
    }

    get static(): boolean {
        return this.scope === "static";
    }
}
