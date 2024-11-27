import { DocElement } from "./DocElement.js";
import { DocParam } from "./DocParam.js";
import type { DocParentTypes } from "./DocBase.js";
import { RawDocumentedEvent } from "./InterfacesForDocElements.js";

export class DocEvent extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedEvent) {
        super(parent.doc, DocElement.types.EVENT, data, parent);
        if (data.params) this.adoptAll(data.params, DocParam);
    }

    get formattedName(): string {
        if (!this.parent) return "";
        return `${this.parent.name}#${this.name}`;
    }
}
