import { DocElement, DocElementJSON } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedFunction } from "./InterfacesForDocElements";
interface DocMethodJSON extends DocElementJSON {
    returns: {
        type: string;
        description?: string;
    };
}
export declare class DocMethod extends DocElement {
    constructor(parent: DocParentTypes, data: RawDocumentedFunction);
    get formattedName(): string;
    get formattedReturn(): string;
    get static(): boolean;
    toJSON(): DocMethodJSON;
}
export {};
