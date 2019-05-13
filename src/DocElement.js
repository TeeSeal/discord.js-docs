const DocBase = require('./DocBase')
const { stripIndents } = require('common-tags')
const { flatten } = require('./Util')

const DESCRIPTION_LIMIT = 1500

class DocElement extends DocBase {
  constructor (doc, docType, data, parent) {
    super(data)
    this.doc = doc
    this.docType = docType
    this.parent = parent || null

    this.name = data.name
    this.description = data.description
    this.meta = data.meta

    this.returns = null
    this.examples = null
    this.type = null
    this.nullable = null

    this.deprecated = data.deprecated || false
  }

  get url () {
    if (!this.doc.baseDocsURL) return null

    const path = this.parent
      ? `${this.parent.docType}/${this.parent.name}?scrollTo=${this.static ? 's-' : ''}${this.name}`
      : `${this.docType}/${this.name}`

    return `${this.doc.baseDocsURL}/${path}`
  }

  get sourceURL () {
    if (!this.doc.repoURL) return null

    const { path, file, line } = this.meta
    return `${this.doc.repoURL}/${path}/${file}#L${line}`
  }

  get formattedName () {
    return this.name
  }

  get formattedReturn () {
    return this.returns
  }

  get formattedType () {
    return `${this.nullable ? '?' : ''}${this.doc.formatType(this.type)}`
  }

  get formattedExtends () {
    return `(extends ${this.formatInherits(this.extends)})`
  }

  get formattedImplements () {
    return `(implements ${this.formatInherits(this.implements)})`
  }

  get link () {
    return `[${this.formattedName}](${this.url})`
  }

  get static () {
    return this.scope === 'static'
  }

  get typeElement () {
    if (!this.type) return null

    return this.type
      .filter(text => /^\w+$/.test(text))
      .map(text => this.doc.findChild(text.toLowerCase()))
      .find(elem => elem)
  }

  embed () {
    const embed = this.doc.baseEmbed()
    let name = `__**${this.link}**__`

    if (this.extends) name += ` ${this.formattedExtends}`
    if (this.implements) name += ` ${this.formattedImplements}`
    if (this.access === 'private') name += ' **PRIVATE**'
    if (this.deprecated) name += ' **DEPRECATED**'

    embed.description = `${name}\n${this.formatDescription()}`
    embed.url = this.url
    embed.fields = []
    this.formatEmbed(embed)
    embed.fields.push({
      name: '\u200b',
      value: `[View source](${this.sourceURL})`
    })

    return embed
  }

  formatEmbed (embed) {
    this.attachProps(embed)
    this.attachMethods(embed)
    this.attachEvents(embed)
    this.attachParams(embed)
    this.attachType(embed)
    this.attachReturn(embed)
    this.attachExamples(embed)
  }

  attachProps (embed) {
    if (!this.props) return
    embed.fields.push({
      name: 'Properties',
      value: this.props.map(prop => `\`${prop.name}\``).join(' ')
    })
  }

  attachMethods (embed) {
    if (!this.methods) return
    embed.fields.push({
      name: 'Methods',
      value: this.methods.map(method => `\`${method.name}\``).join(' ')
    })
  }

  attachEvents (embed) {
    if (!this.events) return
    embed.fields.push({
      name: 'Events',
      value: this.events.map(event => `\`${event.name}\``).join(' ')
    })
  }

  attachParams (embed) {
    if (!this.params) return
    const params = this.params.map(param => {
      return stripIndents`
        ${param.formattedName} ${param.formattedType}
        ${param.description}
      `
    })

    const slice = params.splice(0, 5)
    embed.fields.push({ name: 'Params', value: slice.join('\n\n') })

    while (params.length > 0) {
      const slice = params.splice(0, 5)
      embed.fields.push({ name: '\u200b', value: slice.join('\n\n') })
    }
  }

  attachReturn (embed) {
    if (!this.returns) return
    embed.fields.push({
      name: 'Returns',
      value: this.formattedReturn
    })
  }

  attachType (embed) {
    if (!this.type) return
    embed.fields.push({
      name: 'Type',
      value: this.formattedType
    })
  }

  attachExamples (embed) {
    if (!this.examples) return
    embed.fields.push({
      name: 'Examples',
      value: this.examples.map(ex => `\`\`\`js\n${ex}\n\`\`\``).join('\n')
    })
  }

  toJSON () {
    const json = {
      name: this.name,
      description: this.description,
      internal_type: this.docType
    }

    if (this.props) json.props = this.props.map(prop => prop.name)
    if (this.parent) json.parent = this.parent.name
    if (this.methods) json.methods = this.methods.map(method => method.name)
    if (this.events) json.events = this.events.map(event => event.name)
    if (this.params) json.params = this.params.map(param => param.toJSON())
    if (this.type) json.type = this.type.join('')
    if (this.examples) json.examples = this.examples

    return json
  }

  formatDescription () {
    if (!this.description) return ''
    let result = this.description
      .replace(/\{@link (.+?)\}/g, (match, name) => {
        const element = this.doc.get(name)
        return element ? element.link : name
      })
      .replace(/(```[^]+?```)|(^[*-].+$)?\n(?![*-])/gm, (match, codeblock, hasListBefore) => {
        if (codeblock) return codeblock
        if (hasListBefore) return match
        return ' '
      })
      .replace(/<(info|warn)>([^]+?)<\/(?:\1)>/g, '\n**$2**\n')

    if (result.length > DESCRIPTION_LIMIT) {
      result = result.slice(0, DESCRIPTION_LIMIT) +
        `...\nDescription truncated. View full description [here](${this.url}).`
    }

    return result
  }

  formatInherits (inherits) {
    inherits = Array.isArray(inherits[0])
      ? inherits.map(flatten) // docgen 0.9.0 format
      : inherits.map(baseClass => [baseClass]) // docgen 0.8.0 format

    return inherits.map(baseClass => this.doc.formatType(baseClass)).join(' and ')
  }

  static get types () {
    return DocBase.types
  }
}

module.exports = DocElement
