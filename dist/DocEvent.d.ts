import { DocElement } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedEvent } from "./InterfacesForDocElements";
export declare class DocEvent extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedEvent);
    get formattedName(): string;
}
