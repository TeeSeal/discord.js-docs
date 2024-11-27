import { DocElement } from "./DocElement.js";
import { DocProp } from "./DocProp.js";
import { DocMethod } from "./DocMethod.js";
import type { Doc } from "./Doc.js";
import { RawDocumentedInterface } from "./InterfacesForDocElements.js";

export class DocInterface extends DocElement {
    constructor(doc: Doc, data: RawDocumentedInterface) {
        super(doc, DocElement.types.INTERFACE, data);
        if (data.props) this.adoptAll(data.props, DocProp);
        if (data.methods) this.adoptAll(data.methods, DocMethod);
    }
}
