import { DocElement } from "./DocElement.js";
export class DocProp extends DocElement {
    constructor(parent, data) {
        super(parent.doc, DocElement.types.PROP, data, parent);
        this.scope = data.scope || null;
        this.type = (Array.isArray(data.type) ? data.type : data.type?.types)?.flat(5) || null;
        this.nullable = data.nullable || false;
    }
    get formattedName() {
        if (!this.parent)
            return "";
        return [this.parent.name, this.static ? "." : "#", this.name].join("");
    }
    get static() {
        return this.scope === "static";
    }
}
