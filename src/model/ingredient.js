import wrapInstance from "../lib/wrap-instance.js";

export default class Ingredient {

    #name = "Untitled"

    constructor(opts) {
        wrapInstance(this, opts)
    }

    set name(value) {
        this.#name = value
    }

    get name() {
        return this.#name
    }
}