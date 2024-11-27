import { DocElement } from "./DocElement";
import { DocParam } from "./DocParam";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedEvent } from "./InterfacesForDocElements";

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
