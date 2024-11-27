import { DocElement } from "./DocElement.js";
import type { DocParentTypes } from "./DocBase.js";
import { RawDocumentedEvent } from "./InterfacesForDocElements.js";
export declare class DocEvent extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedEvent);
    get formattedName(): string;
}
