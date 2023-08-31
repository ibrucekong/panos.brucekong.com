export default class OnResize {
  constructor() {
    this.datas = new Map()

    this._init()
  }

  _init() {
    this._check()
  }

  _check() {
    Array.from(this.datas.values()).forEach((data) => {
      data.check()
    })

    requestAnimationFrame(this._check.bind(this))
  }

  addResizeEventListener(dom, fun) {
    let data = this.datas.get(dom)
    if (!data) {
      data = new DomResizeWatcherData(dom)
      this.datas.set(dom, data)
    }
    data.addResizeEventListener(fun)
  }

  removeResizeEventListener(dom, fun) {
    let data = this.datas.get(dom)
    if (!data) {
      return
    }

    data.removeResizeEventListener(fun)

    if (data.getFunCount() > 0) {
      return
    }

    this.datas.delete(dom)
  }
}

class DomResizeWatcherData {
  constructor(dom) {
    this.dom = dom
    this.funs = new Set()
    this.size = this._getDomSize()
  }

  _getDomSize() {
    let height = this.dom.clientHeight
    let width = this.dom.clientWidth

    return {
      height,
      width
    }
  }

  _trigger() {
    let dom = this.dom
    this.funs.forEach((fun) => {
      fun.apply(dom)
    })
  }

  getFunCount() {
    return this.funs.size
  }

  addResizeEventListener(fun) {
    this.funs.add(fun)
  }

  removeResizeEventListener(fun) {
    this.funs.delete(fun)
  }

  check() {
    let size = this._getDomSize()
    if (size.height !== this.size.height || size.width !== this.size.width) {
      this._trigger()
      this.size = size
    }
  }
}
