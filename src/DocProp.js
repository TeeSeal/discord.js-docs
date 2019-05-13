const DocElement = require('./DocElement')
const { flatten } = require('./Util')

class DocProp extends DocElement {
  constructor (parent, data) {
    super(parent.doc, DocElement.types.PROP, data, parent)
    this.access = data.access || 'public'
    this.scope = data.scope
    this.type = flatten(data.type)
    this.nullable = data.nullable || false
  }

  get formattedName () {
    return [this.parent.name, this.static ? '.' : '#', this.name].join('')
  }
}

module.exports = DocProp
