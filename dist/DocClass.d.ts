import { DocElement } from "./DocElement";
import type { Doc } from "./Doc";
import type { RawDocumentedClass, RawDocumentedConstructor } from "./InterfacesForDocElements";
export declare class DocClass extends DocElement {
    construct: RawDocumentedConstructor;
    constructor(doc: Doc, data: RawDocumentedClass);
}
