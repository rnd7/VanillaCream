import getProperties from "./get-properties.js"
import SignalProcessor from "./signal-processor.js";

export default class DynamicData {

    #properties = {}
    constructor() {
        this.#properties = getProperties(this)
        for (let [name, descriptor] of Object.entries(this.#properties)) {
            if (descriptor.set) {
                const boundSubclassSetter = descriptor.set.bind(this)
                const subClass = Object.getPrototypeOf(this).constructor
                const proxyDescriptor = {
                    set: (value) => {
                        SignalProcessor.send(subClass, name)
                        SignalProcessor.send(this, name)
                        boundSubclassSetter(value)
                    },
                    configurable: true
                }
                if (descriptor.get) proxyDescriptor.get = descriptor.get.bind(this); // COPY OLD GETTER
                Object.defineProperty(this, name, proxyDescriptor);
            }
        }

    }

    toObject() {
        const object = {}
        for (let [key, value] of Object.entries(this.#properties)) {
            if (value.get && value.set) object[key] = this[key]
        }
        return object
    }

    fromObject(object) {
        if (!object) return null
        Object.keys(object).forEach((key) => {
            this[key] = object[key]
        })
    }

    static create(opts) {
        let instance
        if (opts instanceof this) instance = opts
        else instance = new this()
        instance.fromObject(opts)
        return instance
    }
}