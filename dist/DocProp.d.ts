import { DocElement } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedMember } from "./InterfacesForDocElements";
export declare class DocProp extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedMember);
    get formattedName(): string;
    get static(): boolean;
}
