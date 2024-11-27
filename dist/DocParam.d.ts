import { DocElement } from "./DocElement.js";
import type { DocParentTypes } from "./DocBase.js";
import { RawDocumentedParam } from "./InterfacesForDocElements.js";
export declare class DocParam extends DocElement {
    optional: boolean | undefined;
    variable: boolean | undefined;
    constructor(parent: DocParentTypes, data: RawDocumentedParam);
    get formattedName(): string;
    get formattedType(): string;
    get url(): null;
}
