import { DocElement } from "./DocElement.js";
import type { Doc } from "./Doc.js";
import { RawDocumentedInterface } from "./InterfacesForDocElements.js";
export declare class DocInterface extends DocElement {
    constructor(doc: Doc, data: RawDocumentedInterface);
}
