import { DocElement, DocElementJSON } from "./DocElement.js";
import { DocParam } from "./DocParam.js";
import type { DocParentTypes } from "./DocBase.js";
import { RawDocumentedFunction } from "./InterfacesForDocElements.js";

interface DocMethodJSON extends DocElementJSON {
    returns: { type: string; description?: string };
}

export class DocMethod extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedFunction) {
        super(parent.doc, DocElement.types.METHOD, data, parent);

        this.examples = data.examples || null;
        this.returns = data.returns || null;
        this.scope = data.scope || null;
        if (data.params) this.adoptAll(data.params, DocParam);
    }

    get formattedName(): string {
        if (!this.parent) return "";
        return [this.parent.name, this.static ? "." : "#", this.name, "()"].join("");
    }

    get formattedReturn(): string {
        if (!this.returns) return "**Void**";
        const returnTypes = ("types" in this.returns ? this.returns.types : this.returns)
            .map((type) => this.doc.formatType(Array.isArray(type) ? type.flat(5) : [type]))
            .join(" or ");

        return [returnTypes, "description" in this.returns ? this.formatText(this.returns.description) : ""]
            .filter((text) => text)
            .join("\n");
    }

    get static(): boolean {
        return this.scope === "static";
    }

    toJSON(): DocMethodJSON {
        const returnType = this.returns
            ? ("types" in this.returns ? this.returns.types : this.returns).flat(5).join("")
            : "void";

        const json: DocMethodJSON = { returns: { type: returnType }, ...super.toJSON() };
        if (this.returns && "description" in this.returns) {
            json.returns.description = this.returns.description;
        }

        return json;
    }
}
