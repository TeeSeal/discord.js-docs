const DocElement = require('./DocElement')
const DocParam = require('./DocParam')

class DocMethod extends DocElement {
  constructor (parent, data) {
    super(parent.doc, DocElement.types.METHOD, data, parent)

    this.examples = data.examples || null
    this.returns = data.returns
    this.scope = data.scope
    this.adoptAll(data.params, DocParam)
  }

  get formattedName () {
    return [this.parent.name, this.static ? '.' : '#', this.name, '()'].join('')
  }

  get formattedReturn () {
    if (!this.returns) return '**Void**'
    console.log()
    const returnTypes = (this.returns.types || this.returns)
      .map(type => this.doc.formatType(type.flat(5)))
      .join(' or ')

    return [returnTypes, this.formatText(this.returns.description)]
      .filter(text => text)
      .join('\n')
  }

  toJSON () {
    const json = super.toJSON()
    const returnType = this.returns
      ? (this.returns.types || this.returns).flat(5).join('')
      : 'void'

    json.returns = { type: returnType }

    if (this.returns && this.returns.description) {
      json.returns.description = this.returns.description
    }

    return json
  }
}

module.exports = DocMethod
