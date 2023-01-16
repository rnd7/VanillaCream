import Binding from "./binding.js"
import camelToKebab from "./camel-to-kebab.js"
import getProperties from "./get-properties.js"
import { isWrappedInstance } from "./wrap-instance.js"
import { isWrappedList } from "./wrap-list.js"
import SignalProcessor from "./signal-processor.js"


export default class WebComponent extends HTMLElement {
    static domParser = new DOMParser()
    static register = new Set()
    static prefix = "wc"
    static requestCache = new Map()

    #wait = true
    #animationFrameHandle = null
    #renderTasks = []
    #binding = null
    #callbacks = new Map()
    #listCallbacks = new Map()
    #dataReference = new Map()
    #dataReferences = new Set()

    constructor() {
        super()
        this.#binding = new Binding(this)
        this.attachShadow({ mode: 'open' })
        this.init()
    }

    async init() {
        this.#wait = false
        this._triggerRender()
    }

    getReference(field) {
        return this.#dataReference.get(field)
    }

    setReference(field, value) {
        if (this.#dataReference.has(field)) {
            this.#dataReference.get(field)[field] = value
        }
    }

    callReference(field, ...args) {
        this.#dataReferences.forEach(reference => {
            if (reference[field]) reference[field](...args)
        })
    }

    bound(fn) {
        return this.#binding.bound(fn)
    }

    fromObject(opts) {
        if (opts instanceof Array) {
            opts.forEach((opt) => { this.fromObject(opt) })
        } else if (isWrappedInstance(opts)) {
            const properties = getProperties(opts)
            const ownProperties = getProperties(this, WebComponent)
            for (let [name, descriptor] of Object.entries(properties)) {
                if (descriptor.get && ownProperties[name] && ownProperties[name].set) {
                    //this[name] = opts[name]
                    const listCallback = (signal) => {
                        this[name] = opts[name]
                    }
                    const processorCallback = (signal) => {
                        if (isWrappedList(opts[name])) {
                            if (this.#listCallbacks.has(name) && opts !== this.#listCallbacks.get(name).reference) {
                                SignalProcessor.remove(this.#listCallbacks.get(name).reference, SignalProcessor.WILDCARD, this.#listCallbacks.get(name).callback)
                                this.#listCallbacks.delete(name)
                            }
                            if (!this.#listCallbacks.has(name)) {
                                this.#listCallbacks.set(name, { callback: listCallback, signal: name, reference: opts[name] })
                                SignalProcessor.add(opts[name], SignalProcessor.WILDCARD, listCallback)
                            }
                        }
                        if (this[name] === opts[name]) return
                        this[name] = opts[name]
                    }
                    if (this.#callbacks.has(name) && opts !== this.#callbacks.get(name).reference) {
                        SignalProcessor.remove(this.#callbacks.get(name).reference, name, this.#callbacks.get(name).callback)
                        this.#dataReference.delete(name)
                        this.#callbacks.delete(name)
                    }
                    if (!this.#callbacks.has(name)) {
                        this.#dataReference.set(name, opts)
                        this.#callbacks.set(name, { callback: processorCallback, signal: name, reference: opts })
                        SignalProcessor.add(opts, name, processorCallback)
                    }
                    processorCallback()
                }
            }
        }
    }

    async appendHTML(src) {
        if (!WebComponent.requestCache.has(src)) {
            WebComponent.requestCache.set(src, fetch(src).then(response => { return response.text() }))
        }
        const text = await WebComponent.requestCache.get(src)
        const domEl = WebComponent.domParser.parseFromString(text, 'text/html')
        this.addRenderTask(() => {
            this.shadowRoot.append(domEl.body.firstElementChild)
        }, true)
    }


    appendStyle(style) {
        const styleEl = document.createElement('style')
        styleEl.appendChild(document.createTextNode(style))
        this.shadowRoot.append(styleEl)
    }

    appendStyleLink(url) {
        return new Promise((resolve, reject) => {
            const styleEl = document.createElement('link');
            styleEl.type = 'text/css'
            styleEl.rel = 'stylesheet'
            styleEl.onload = () => resolve(styleEl)
            styleEl.onerror = () => reject()
            styleEl.href = url
            this.shadowRoot.append(styleEl)
        })
    }

    addRenderTask(task, prioritize) {
        const safetask = () => {
            try {
                task()
            } catch (e) {
                console.error(e)
            }
        }
        if (prioritize) this.#renderTasks.unshift(safetask)
        else this.#renderTasks.push(safetask)
        this._triggerRender()
    }

    _triggerRender() {
        if (this.#animationFrameHandle || this.#wait) return
        this.#animationFrameHandle = requestAnimationFrame(() => {
            this._render()
            this.#animationFrameHandle = null
        })
    }

    _render() {
        this.#renderTasks.forEach(task => task())
        this.#renderTasks = []
    }

    static get componentName() {
        return [this.prefix, camelToKebab(this.name)].join('-')
    }

    static create(opts) {
        const name = this.componentName
        if (!this.register.has(name)) {
            customElements.define(name, this)
            this.register.add(name)
        }
        const el = document.createElement(name)
        if (opts) el.fromObject(opts)
        return el
    }

    findContainerIndex(container, el) {
        return Array.from(container.children).indexOf(el)
    }

    manageContainer(containerElement, list, componentClass) {
        this.addRenderTask(() => {
            while (containerElement.children.length > list.length) {
                containerElement.lastChild.destroy()
            }
            while (containerElement.children.length < list.length) {
                const comp = componentClass.create()
                containerElement.append(comp)
            }
            list.forEach((item, index) => {
                containerElement.children[index].fromObject(item)
            })
        })
    }

    destroyContainer(containerElement) {
        while (containerElement.children.length) {
            containerElement.lastChild.destroy()
        }
    }

    destroy() {
        cancelAnimationFrame(this.#animationFrameHandle)
        for (var [name, value] of this.#callbacks) {
            SignalProcessor.remove(value.reference, name, value.callback)
        }
        this.#callbacks.clear()
        for (var [name, value] of this.#listCallbacks) {
            SignalProcessor.remove(value.reference, name, value.callback)
        }
        this.#listCallbacks.clear()
        this.#dataReferences.clear()
        this.#dataReference.clear()
        this.#renderTasks = []
        this.#binding.destroy()
        this.#binding = null
        this.remove()
    }
}