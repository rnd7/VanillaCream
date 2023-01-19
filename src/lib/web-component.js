import Binding from "./binding.js"
import camelToKebab from "./camel-to-kebab.js"
import getProperties from "./get-properties.js"
import { isWrappedInstance } from "./wrap-instance.js"
import { isWrappedList } from "./wrap-list.js"
import SignalProcessor from "./signal-processor.js"


export default class WebComponent extends HTMLElement {
    static domParser = new DOMParser()
    static register = new Set()
    static prefix = "vc"
    static requestCache = new Map()

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

    #wait = true
    #animationFrameHandle = null
    #renderTasks = []
    #tasks = new Set()
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
        this.#triggerRender()
    }

    getReferenceByProperty(name) {
        return this.#dataReference.get(name)
    }

    setReferenceProperty(name, value) {
        if (this.#dataReference.has(name)) {
            this.#dataReference.get(name)[name] = value
        }
    }

    callReferenceMethod(name, ...args) {
        this.#dataReferences.forEach(reference => {
            if (reference[name]) reference[name](...args)
        })
    }

    bound(fn) {
        return this.#binding.bound(fn)
    }

    #removeListener(name) {
        if (this.#callbacks.has(name)) {
            SignalProcessor.remove(
                this.#callbacks.get(name).reference,
                name,
                this.#callbacks.get(name).callback
            )
            this.#dataReference.delete(name)
            this.#callbacks.delete(name)
        }
        this.#removeListListener(name)
    }

    #addListener(reference, name, callback) {
        if (
            this.#callbacks.has(name)
            && this.#callbacks.get(name).reference !== reference
        ) {
            this.#removeListener(name)
        }
        if (!this.#callbacks.has(name)) {
            this.#dataReference.set(name, reference)
            this.#callbacks.set(name, { callback, reference })
            SignalProcessor.add(reference, name, callback)
        }
    }

    #removeListListener(name) {
        if (!this.#listCallbacks.has(name)) return
        SignalProcessor.remove(
            this.#listCallbacks.get(name).reference,
            SignalProcessor.WILDCARD,
            this.#listCallbacks.get(name).callback
        )
        this.#listCallbacks.delete(name)
    }

    #addListListener(reference, name, callback) {
        if (
            this.#listCallbacks.has(name)
            && this.#listCallbacks.get(name).reference !== reference
        ) {
            this.#removeListListener(name)
        }

        if (!this.#listCallbacks.has(name)) {
            this.#listCallbacks.set(name, { callback, reference })
            SignalProcessor.add(reference, SignalProcessor.WILDCARD, callback)
        }
    }

    fromObject(opts) {
        if (opts instanceof Array) {
            opts.forEach((opt) => { this.fromObject(opt) })
        } else if (isWrappedInstance(opts)) {
            const properties = getProperties(opts)
            const ownProperties = getProperties(this, WebComponent)
            for (let [name, descriptor] of Object.entries(properties)) {
                if (
                    descriptor.get
                    && ownProperties[name]
                    && ownProperties[name].set
                ) {
                    //this[name] = opts[name]
                    const listCallback = (signal) => {
                        this[name] = opts[name]
                    }
                    const processorCallback = (signal) => {
                        if (this[name] === opts[name]) return
                        if (isWrappedList(opts[name])) {
                            this.#addListListener(opts[name], name, listCallback)
                        } else {
                            this.#removeListListener(name)
                        }
                        this[name] = opts[name]
                    }

                    this.#addListener(opts, name, processorCallback)
                    processorCallback()
                }
            }
        } else if (typeof opts === "object") {
            const ownProperties = getProperties(this, WebComponent)
            Object.keys(opts).forEach((name) => {
                if (ownProperties[name] && ownProperties[name].set) {
                    this.#removeListener(name)
                    this[name] = opts[name]
                }
            })
        }

    }

    async appendHTML(src) {
        if (!WebComponent.requestCache.has(src)) {
            WebComponent.requestCache.set(src, fetch(src).then(response => { return response.text() }))
        }
        const text = await WebComponent.requestCache.get(src)
        const domEl = WebComponent.domParser.parseFromString(text, 'text/html')
        this.shadowRoot.append(domEl.body.firstElementChild)
    }

    appendStyle(style) {
        const styleEl = document.createElement('style')
        styleEl.appendChild(document.createTextNode(style))
        this.shadowRoot.append(styleEl)
        return styleEl
    }

    async appendStyleLink(url) {
        const styleEl = await new Promise((resolve, reject) => {
            const styleEl = document.createElement('link');
            styleEl.type = 'text/css'
            styleEl.rel = 'stylesheet'
            styleEl.onload = () => resolve(styleEl)
            styleEl.onerror = () => reject()
            styleEl.href = url
            this.shadowRoot.append(styleEl)
        })
        return styleEl
    }

    addRenderTask(task, prioritize) {
        if (this.#tasks.has(task)) return
        this.#tasks.add(task)
        const safetask = () => {
            try {
                task()
            } catch (e) {
                console.error(e)
            }
        }
        if (prioritize) this.#renderTasks.unshift(safetask)
        else this.#renderTasks.push(safetask)
        this.#triggerRender()
    }

    #triggerRender() {
        if (this.#animationFrameHandle || this.#wait) return
        this.#animationFrameHandle = requestAnimationFrame(() => {
            this.#render()
            this.#animationFrameHandle = null
        })
    }

    #render() {
        this.#renderTasks.forEach(task => task())
        this.#renderTasks = []
        this.#tasks.clear()
    }

    renderList(containerElement, list, componentClass) {
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
    }

    destroyChildren(containerElement) {
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
        this.#tasks.clear()
        this.#binding.destroy()
        this.#binding = null
        this.remove()
    }
}