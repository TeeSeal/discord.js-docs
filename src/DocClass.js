const DocElement = require('./DocElement')
const DocProp = require('./DocProp')
const DocMethod = require('./DocMethod')
const DocEvent = require('./DocEvent')

class DocClass extends DocElement {
  constructor (doc, data) {
    super(doc, DocElement.types.CLASS, data)
    this.extends = data.extends || null
    this.implements = data.implements || null
    this.construct = data.construct

    this.adoptAll(data.props, DocProp)
    this.adoptAll(data.methods, DocMethod)
    this.adoptAll(data.events, DocEvent)
  }
}

module.exports = DocClass
