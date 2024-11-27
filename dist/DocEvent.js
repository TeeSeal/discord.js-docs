import { DocElement } from "./DocElement";
import { DocParam } from "./DocParam";
export class DocEvent extends DocElement {
    constructor(parent, data) {
        super(parent.doc, DocElement.types.EVENT, data, parent);
        if (data.params)
            this.adoptAll(data.params, DocParam);
    }
    get formattedName() {
        if (!this.parent)
            return "";
        return `${this.parent.name}#${this.name}`;
    }
}
