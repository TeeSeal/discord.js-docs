import { DocElement } from "./DocElement.js";
import type { DocParentTypes } from "./DocBase.js";
import { RawDocumentedMember } from "./InterfacesForDocElements.js";
export declare class DocProp extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedMember);
    get formattedName(): string;
    get static(): boolean;
}
