const DocElement = require('./DocElement')
const DocProp = require('./DocProp')
const DocMethod = require('./DocMethod')

class DocInterface extends DocElement {
  constructor (doc, data) {
    super(doc, DocElement.types.INTERFACE, data)
    this.adoptAll(data.props, DocProp)
    this.adoptAll(data.methods, DocMethod)
  }
}

module.exports = DocInterface
