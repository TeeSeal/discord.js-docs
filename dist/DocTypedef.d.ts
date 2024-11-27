import type { Doc } from "./Doc.js";
import { DocElement } from "./DocElement.js";
import { RawDocumentedTypedef } from "./InterfacesForDocElements.js";
export declare class DocTypedef extends DocElement {
    constructor(doc: Doc, data: RawDocumentedTypedef);
}
