const DocElement = require('./DocElement')
const { flatten } = require('./Util')

class DocTypedef extends DocElement {
  constructor (doc, data) {
    super(doc, DocElement.types.TYPEDEF, data)
    this.type = flatten(data.type)
  }
}

module.exports = DocTypedef
