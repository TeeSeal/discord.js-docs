import { DocElement } from "./DocElement.js";
import type { Doc } from "./Doc.js";
import type { RawDocumentedClass, RawDocumentedConstructor } from "./InterfacesForDocElements";
export declare class DocClass extends DocElement {
    construct: RawDocumentedConstructor;
    constructor(doc: Doc, data: RawDocumentedClass);
}
