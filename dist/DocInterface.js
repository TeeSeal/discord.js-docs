import { DocElement } from "./DocElement.js";
import { DocProp } from "./DocProp.js";
import { DocMethod } from "./DocMethod.js";
export class DocInterface extends DocElement {
    constructor(doc, data) {
        super(doc, DocElement.types.INTERFACE, data);
        if (data.props)
            this.adoptAll(data.props, DocProp);
        if (data.methods)
            this.adoptAll(data.methods, DocMethod);
    }
}
