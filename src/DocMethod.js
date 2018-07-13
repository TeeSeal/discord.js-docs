const DocElement = require('./DocElement')
const DocParam = require('./DocParam')
const { flatten } = require('./Util')

class DocMethod extends DocElement {
  constructor (parent, data) {
    super(parent.doc, DocElement.types.METHOD, data, parent)

    this.access = data.access || 'public'
    this.examples = data.examples || null
    this.returns = data.returns
    this.scope = data.scope
    this.adoptAll(data.params, DocParam)
  }

  get formattedName () {
    return [this.parent.name, this.static ? '.' : '#', this.name, '()'].join('')
  }

  get flatReturn () {
    return flatten(this.returns.types || this.returns)
  }

  get formattedReturn () {
    if (!this.returns) return '**Void**'
    return [this.doc.formatType(this.flatReturn), this.returns.description]
      .filter(text => text)
      .join('\n')
  }

  toJSON () {
    const json = super.toJSON()
    const returnType = this.returns
      ? flatten(this.returns.types || this.returns).join('')
      : 'void'

    json.returns = { type: returnType }

    if (this.returns && this.returns.description) {
      json.returns.description = this.returns.description
    }

    return json
  }
}

module.exports = DocMethod
