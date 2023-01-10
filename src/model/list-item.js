import DynamicData from "../lib/dynamic-data.js";

export default class ListItem extends DynamicData {
    #quantity = 0
    #title = "Untitled"
    constructor() {
        super()
    }

    set title(value) {
        this.#title = value
    }

    get title() {
        return this.#title
    }

    set quantity(value) {
        this.#quantity = value
    }

    get quantity() {
        return this.#quantity
    }
}