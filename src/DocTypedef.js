const DocElement = require('./DocElement')

class DocTypedef extends DocElement {
  constructor (doc, data) {
    super(doc, DocElement.types.TYPEDEF, data)
    this.type = data.type ? data.type.flat(5) : ['Object']
  }
}

module.exports = DocTypedef
