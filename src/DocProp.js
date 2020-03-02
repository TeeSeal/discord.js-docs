const DocElement = require('./DocElement')

class DocProp extends DocElement {
  constructor (parent, data) {
    super(parent.doc, DocElement.types.PROP, data, parent)
    this.scope = data.scope
    this.type = data.type.flat(5)
    this.nullable = data.nullable || false
  }

  get formattedName () {
    return [this.parent.name, this.static ? '.' : '#', this.name].join('')
  }
}

module.exports = DocProp
