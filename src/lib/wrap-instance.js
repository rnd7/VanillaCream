import getProperties from "./get-properties.js"
import SignalProcessor from "./signal-processor.js"

const wrappedInstances = new WeakSet()

export function isWrappedInstance(item) {
    return wrappedInstances.has(item)
}

export default function wrapInstance(instance, opts) {
    wrappedInstances.add(instance)
    const properties = getProperties(instance)
    for (let [name, descriptor] of Object.entries(properties)) {
        if (descriptor.set && descriptor.get) {
            const boundSubclassSetter = descriptor.set.bind(instance)
            const boundSubclassGetter = descriptor.get.bind(instance)
            const type = typeof instance[name]
            const constructor = instance[name].constructor
            const proxyDescriptor = {
                set: (value) => {
                    if (value === boundSubclassGetter()) return // skip identical
                    if (
                        type === 'object'
                        && !(value instanceof constructor)
                        && !(value instanceof Array)
                    ) {
                        value = new constructor(value)
                    }
                    boundSubclassSetter(value)
                    SignalProcessor.send(instance, name)
                },
                get: boundSubclassGetter,
                configurable: true
            }
            Object.defineProperty(instance, name, proxyDescriptor)
        }
    }
    if (opts) {
        Object.keys(opts).forEach((key) => {
            instance[key] = opts[key]
        })
    }
}