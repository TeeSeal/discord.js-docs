const Fuse = require('fuse.js')
const { get: fetch } = require('axios')

const DocBase = require('./DocBase')
const DocClass = require('./DocClass')
const DocTypedef = require('./DocTypedef')
const DocInterface = require('./DocInterface')

const docCache = new Map()
const ICON = 'https://i.imgur.com/LM8YCyk.png'

class Doc extends DocBase {
  constructor (name, docs) {
    super(docs)
    this.name = name
    this.baseURL = `https://discord.js.org/#/docs/${name}/`
    this.repoURL = Doc.getRepoURL(name)

    this.adoptAll(docs.classes, DocClass)
    this.adoptAll(docs.typedefs, DocTypedef)
    this.adoptAll(docs.interfaces, DocInterface)

    this.fuse = new Fuse(this.toFuseFormat(), {
      shouldSort: true,
      threshold: 0.5,
      location: 0,
      distance: 80,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'id'],
      id: 'id'
    })

    docCache.set(name, this)
  }

  get (...terms) {
    terms = terms
      .filter(term => term)
      .map(term => term.toLowerCase())

    let elem = this.children.get(terms.shift())
    if (!elem || !terms.length) return elem || null

    while (terms.length) {
      const term = terms.shift()
      const child = elem.children.get(term)

      if (!child) return null
      elem = terms.length && child.typeElement ? child.typeElement : child
    }

    return elem
  }

  search (query) {
    const result = this.fuse.search(query).slice(0, 10)
    if (!result.length) return null
    return result.map(name => this.get(...name.split('#')))
  }

  resolveEmbed (query) {
    const element = this.get(...query.split(/\.|#/))
    if (element) return element.embed()

    const searchResults = this.search(query)
    if (!searchResults) return null

    const embed = this.baseEmbed()
    embed.title = 'Search results:'
    embed.description = searchResults.map(el => `**${el.link}**`).join('\n')
    return embed
  }

  toFuseFormat () {
    const parents = Array.from(this.children.values())

    const children = parents
      .map(parent => Array.from(parent.children.values()))
      .reduce((a, b) => a.concat(b))

    const formattedParents = parents
      .map(({ name }) => ({ id: name, name }))
    const formattedChildren = children
      .map(({ name, parent }) => ({ id: `${parent.name}#${name}`, name }))

    return formattedParents.concat(formattedChildren)
  }

  toJSON () {
    const json = {}

    for (const key of ['classes', 'typedefs', 'interfaces']) {
      if (!this[key]) continue
      json[key] = this[key].map(item => item.toJSON())
    }

    return json
  }

  baseEmbed () {
    const [project, branch] = this.name.split('/')
    const title = {
      main: 'Discord.js Docs',
      commando: 'Commando Docs',
      rpc: 'RPC Docs'
    }[project]

    return {
      color: 0x2296f3,
      author: {
        name: `${title} (${branch})`,
        url: this.baseURL,
        icon_url: ICON
      }
    }
  }

  formatType (types) {
    const typestring = types
      .map((text, index) => {
        if (/<|>|\*/.test(text)) {
          return text
            .split('')
            .map(char => `\\${char}`)
            .join('')
        }

        const typeElem = this.children.get(text.toLowerCase())
        const prependOr = index !== 0 && /\w|>/.test(types[index - 1]) && /\w/.test(text)

        return (prependOr ? '|' : '') + (typeElem ? typeElem.link : text)
      })
      .join('')

    return `**${typestring}**`
  }

  static getRepoURL (id) {
    const [name, branch] = id.split('/')
    const project = {
      main: 'discord.js',
      commando: 'Commando',
      rpc: 'RPC'
    }[name]

    return `https://github.com/discordjs/${project}/blob/${branch}/`
  }

  static async fetch (project, branch, { force } = {}) {
    const name = `${project}/${branch}`
    if (!force && docCache.has(name)) return docCache.get(name)

    const longProject = {
      main: 'discord.js',
      commando: 'discord.js-commando',
      rpc: 'discord-rpc'
    }[project] || []
    if (!longProject) return null

    try {
      const { data } = await fetch(
        `https://raw.githubusercontent.com/discordjs/${longProject}/docs/${branch}.json`
      )
      return new Doc(name, data)
    } catch (err) {
      return null
    }
  }
}

module.exports = Doc
