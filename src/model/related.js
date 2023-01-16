import wrapInstance from "../lib/wrap-instance.js"

export default class Related {

    #bodyCount = 0

    constructor(opts) {
        wrapInstance(this, opts)
    }

    set bodyCount(value) {
        this.#bodyCount = value
    }

    get bodyCount() {
        return this.#bodyCount
    }
}