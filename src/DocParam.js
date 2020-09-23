const DocElement = require('./DocElement')

class DocParam extends DocElement {
  constructor (parent, data) {
    super(parent.doc, DocElement.types.PARAM, data, parent)
    this.type = data.type.flat(5)
    this.optional = data.optional
    this.variable = data.variable
  }

  get formattedName () {
    return this.optional ? `\`[${this.name}]\`` : `\`${this.name}\``
  }

  get formattedType () {
    if (!this.variable) return super.formattedType
    return super.formattedType.split('|').map(param => `...${param}`).join('|')
  }

  get url () {
    return null
  }
}

module.exports = DocParam
