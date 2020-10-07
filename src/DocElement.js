const DocBase = require('./DocBase')
const { stripIndents } = require('common-tags')

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
    this.access = data.access || 'public'
  }

  get embedPrefix () {
    const { types } = DocElement
    const emoji = char => `:regional_indicator_${char}:`

    switch (this.docType) {
      case types.CLASS: return emoji('c')
      case types.EVENT: return emoji('e')
      case types.INTERFACE: return emoji('i')
      case types.METHOD: return emoji('m')
      case types.TYPEDEF: return emoji('t')
      case types.PROP: return emoji('p')
      default: return null
    }
  }

  get anchor () {
    if (this.static) return 's-'
    else if (this.docType === DocElement.types.EVENT) return 'e-'
    return null
  }

  get url () {
    if (!this.doc.baseDocsURL) return null

    const path = this.parent
      ? `${this.parent.docType}/${this.parent.name}?scrollTo=${this.anchor || ''}${this.name}`
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

  get formattedDescription () {
    let result = this.formatText(this.description)

    if (result.length > DESCRIPTION_LIMIT) {
      result = result.slice(0, DESCRIPTION_LIMIT) +
        `...\nDescription truncated. View full description [here](${this.url}).`
    }

    return result
  }

  get formattedReturn () {
    return this.formatText(this.returns)
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

  embed (options = {}) {
    const embed = this.doc.baseEmbed()
    let name = `__**${this.link}**__`

    if (this.extends) name += ` ${this.formattedExtends}`
    if (this.implements) name += ` ${this.formattedImplements}`
    if (this.access === 'private') name += ' **PRIVATE**'
    if (this.deprecated) name += ' **DEPRECATED**'

    embed.description = `${name}\n${this.formattedDescription}`
    embed.url = this.url
    embed.fields = []
    this.formatEmbed(embed, options)
    embed.fields.push({
      name: '\u200b',
      value: `[View source](${this.sourceURL})`
    })

    return embed
  }

  formatEmbed (embed, options = {}) {
    this.attachProps(embed, options)
    this.attachMethods(embed, options)
    this.attachEvents(embed)
    this.attachParams(embed)
    this.attachType(embed)
    this.attachReturn(embed)
    this.attachExamples(embed)
  }

  attachProps (embed, { excludePrivateElements } = {}) {
    if (!this.props) return

    let props = this.props
    if (excludePrivateElements) props = props.filter(prop => prop.access !== 'private')
    if (props.length === 0) return

    embed.fields.push({
      name: 'Properties',
      value: props.map(prop => `\`${prop.name}\``).join(' ')
    })
  }

  attachMethods (embed, { excludePrivateElements } = {}) {
    if (!this.methods) return

    let methods = this.methods
    if (excludePrivateElements) methods = methods.filter(prop => prop.access !== 'private')
    if (methods.length === 0) return

    embed.fields.push({
      name: 'Methods',
      value: methods.map(method => `\`${method.name}\``).join(' ')
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
        ${param.formattedDescription}
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

  formatInherits (inherits) {
    inherits = Array.isArray(inherits[0])
      ? inherits.map(element => element.flat(5)) // docgen 0.9.0 format
      : inherits.map(baseClass => [baseClass]) // docgen 0.8.0 format

    return inherits.map(baseClass => this.doc.formatType(baseClass)).join(' and ')
  }

  formatText (text) {
    if (!text) return ''

    return text
      .replace(/\{@link (.+?)\}/g, (match, name) => {
        const element = this.doc.get(...name.split(/\.|#/))
        return element ? element.link : name
      })
      .replace(/(```[^]+?```)|(^[*-].+$)?\n(?![*-])/gm, (match, codeblock, hasListBefore) => {
        if (codeblock) return codeblock
        if (hasListBefore) return match
        return ' '
      })
      .replace(/<(info|warn)>([^]+?)<\/(?:\1)>/g, '\n**$2**\n')
      .replace(/<\/?p>/g, '') // remove paragraph tags
      .replace(/<\/?code>/g, '`') // format code tags
      .replace(/<a href="(.+)">(.+)<\/a>/g, '[$2]($1)') // format anchor tags
  }

  static get types () {
    return DocBase.types
  }
}

module.exports = DocElement
