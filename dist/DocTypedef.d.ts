import type { Doc } from "./Doc";
import { DocElement } from "./DocElement";
import { RawDocumentedTypedef } from "./InterfacesForDocElements";
export declare class DocTypedef extends DocElement {
    constructor(doc: Doc, data: RawDocumentedTypedef);
}
