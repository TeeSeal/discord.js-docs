import { DocElement } from "./DocElement";
import { DocProp } from "./DocProp";
import { DocMethod } from "./DocMethod";
import { DocEvent } from "./DocEvent";
export class DocClass extends DocElement {
    construct;
    constructor(doc, data) {
        super(doc, DocElement.types.CLASS, data);
        this.extends = data.extends || null;
        this.implements = data.implements || null;
        this.construct = data.construct;
        if (data.props)
            this.adoptAll(data.props, DocProp);
        if (data.methods)
            this.adoptAll(data.methods, DocMethod);
        if (data.events)
            this.adoptAll(data.events, DocEvent);
    }
}
