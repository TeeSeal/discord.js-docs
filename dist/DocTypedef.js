import { DocElement } from "./DocElement.js";
export class DocTypedef extends DocElement {
    constructor(doc, data) {
        super(doc, DocElement.types.TYPEDEF, data);
        this.type = (Array.isArray(data.type) ? data.type : data.type?.types)?.flat(5) || null;
    }
}
