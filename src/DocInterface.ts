import { DocElement } from "./DocElement";
import { DocProp } from "./DocProp";
import { DocMethod } from "./DocMethod";
import type { Doc } from "./Doc";
import { RawDocumentedInterface } from "./InterfacesForDocElements";

export class DocInterface extends DocElement {
    constructor(doc: Doc, data: RawDocumentedInterface) {
        super(doc, DocElement.types.INTERFACE, data);
        if (data.props) this.adoptAll(data.props, DocProp);
        if (data.methods) this.adoptAll(data.methods, DocMethod);
    }
}
