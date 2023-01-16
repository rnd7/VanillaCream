export default class SignalProcessor {
    static _targets = new WeakMap()
    static _groups = new WeakMap()

    static WILDCARD = Symbol('*')

    static add(target, event, listener, group = null) {
        if (!target || !event || !listener) {
            throw "Invalid parameters"
            return
        }
        let listeners = SignalProcessor._targets.get(target)
        if (listeners === undefined) {
            listeners = new Map()
        }
        let listenersForEvent = listeners.get(event)
        if (listenersForEvent === undefined) {
            listenersForEvent = new Set()
        }
        listenersForEvent.add(listener)
        listeners.set(event, listenersForEvent)
        this._targets.set(target, listeners)
    }

    static remove(target, event, listener) {
        if (!target || !event || !listener) {
            throw "Invalid parameters"
            return
        }
        let listeners = SignalProcessor._targets.get(target)
        if (!listeners) return
        let listenersForEvent = listeners.get(event)
        if (!listenersForEvent) return
        listenersForEvent.delete(listener)
        if (!listenersForEvent.size)
            listeners.delete(event)
    }

    static send(target, event) {
        if (!target || !event) {
            throw "Invalid parameters"
            return
        }

        // all listeners targeting instance
        const targets = [SignalProcessor._targets.get(target)]
        // all listeners targeting class
        if (!(target instanceof Function) && target.constructor) {
            targets.push(SignalProcessor._targets.get(target.constructor))
        }
        targets.forEach(listeners => {
            if (!listeners) return
            let listenersForEvent = listeners.get(event)
            if (listenersForEvent) {
                // defer
                setTimeout(() => {
                    listenersForEvent.forEach((listener) => {
                        listener(event, target)
                    })
                })
            }

            let wildcardListeners = listeners.get(SignalProcessor.WILDCARD)
            if (wildcardListeners) {
                setTimeout(() => {
                    wildcardListeners.forEach((listener) => {
                        listener(event, target)
                    })
                })
            }
        })

    }
}