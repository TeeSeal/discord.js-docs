import { DocElement } from "./DocElement";
import type { DocParentTypes } from "./DocBase";
import { RawDocumentedParam } from "./InterfacesForDocElements";
export declare class DocParam extends DocElement {
    optional: boolean | undefined;
    variable: boolean | undefined;
    constructor(parent: DocParentTypes, data: RawDocumentedParam);
    get formattedName(): string;
    get formattedType(): string;
    get url(): null;
}
