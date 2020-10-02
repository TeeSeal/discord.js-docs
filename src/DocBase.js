const types = {
  CLASS: 'class',
  EVENT: 'event',
  INTERFACE: 'interface',
  METHOD: 'method',
  PARAM: 'param',
  PROP: 'prop',
  TYPEDEF: 'typedef'
}

class DocBase {
  constructor (json) {
    this.originalJSON = json
    this.children = new Map()
  }

  addChild (child) {
    this.children.set(`${child.name.toLowerCase()}-${child.docType}`, child)
  }

  adoptAll (enumerable, Constructor) {
    if (!enumerable) return
    for (const elem of enumerable) {
      this.addChild(new Constructor(this, elem))
    }
  }

  childrenOfType (type) {
    const filtered = Array.from(this.children.values())
      .filter(child => child.docType === type)

    return filtered.length ? filtered : null
  }

  findChild (query, exclude = []) {
    query = query.toLowerCase()

    let docType = null
    if (query.endsWith('()')) {
      query = query.slice(0, -2)
      docType = types.METHOD
    } else if (query.startsWith('e-')) {
      query = query.slice(2)
      docType = types.EVENT
    }

    return Array.from(this.children.values()).find(child => (
      !exclude.includes(child) && child.name.toLowerCase() === query && (!docType || child.docType === docType)
    ))
  }

  get classes () {
    return this.childrenOfType(types.CLASS)
  }

  get typedefs () {
    return this.childrenOfType(types.TYPEDEF)
  }

  get interfaces () {
    return this.childrenOfType(types.INTERFACE)
  }

  get props () {
    return this.childrenOfType(types.PROP)
  }

  get methods () {
    return this.childrenOfType(types.METHOD)
  }

  get events () {
    return this.childrenOfType(types.EVENT)
  }

  get params () {
    return this.childrenOfType(types.PARAM)
  }

  static get types () {
    return types
  }
}

module.exports = DocBase
