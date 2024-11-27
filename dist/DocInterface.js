import { DocElement } from "./DocElement";
import { DocProp } from "./DocProp";
import { DocMethod } from "./DocMethod";
export class DocInterface extends DocElement {
    constructor(doc, data) {
        super(doc, DocElement.types.INTERFACE, data);
        if (data.props)
            this.adoptAll(data.props, DocProp);
        if (data.methods)
            this.adoptAll(data.methods, DocMethod);
    }
}
