import SignalProcessor from "./signal-processor.js"

const wrappedLists = new WeakSet()

export function isWrappedList(item) {
    return wrappedLists.has(item)
}

export default function wrapList(Type, list = []) {
    if (isWrappedList(list) && Type === list.type) return list
    return new (class extends Array {
        constructor(...items) {
            super()
            wrappedLists.add(this)
            if (items) {
                super.push(...items.map((item) => {
                    if (item instanceof Type) return item
                    return new Type(item)
                }))
            }
        }

        get type() {
            return Type
        }

        push(...items) {
            const result = super.push(...items.map((item) => {
                if (item instanceof Type) return item
                return new Type(item)
            }))
            SignalProcessor.send(this, "push")
            return result
        }

        unshift(...items) {
            const result = super.unshift(...items.map((item) => {
                if (item instanceof Type) return item
                return new Type(item)
            }))
            SignalProcessor.send(this, "unshift")
            return result
        }

        pop() {
            const result = super.pop()
            SignalProcessor.send(this, "pop")
            return result
        }

        shift() {
            const result = super.shift()
            SignalProcessor.send(this, "shift")
            return result
        }

        splice(...args) {
            args = args.map((value, index) => {
                if (index < 2) return value
                if (value instanceof Type) return value
                return new Type(value)
            })
            const result = super.splice(...args)
            SignalProcessor.send(this, "splice")
            return result
        }

        fill(...args) {
            let value = args[0]

            let start = args[1] || 0
            if (start < -this.length) start = 0
            if (start >= this.length) return this

            let end = args[2] || 0
            if (end < -this.length) end = 0
            if (end >= this.length) end = this.length

            if (end < start) return this
            let list = [].fill(value, 0, end - start).map((value, index) => {
                if (index < 2) return value
                if (value instanceof Type) return value
                return new Type(value)
            })
            const result = super.splice(...args)
            SignalProcessor.send(this, "fill")
            return result
        }

        reverse() {
            const result = super.reverse()
            SignalProcessor.send(this, "reverse")
            return result
        }

        sort(...args) {
            const result = super.sort(...args)
            SignalProcessor.send(this, "sort")
            return result
        }
    })(...list)
}