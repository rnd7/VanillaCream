import DynamicData from "../lib/dynamic-data.js";
import ListItem from "./list-item.js";

export default class Configuration extends DynamicData {
    #count = 0
    #limit = 10
    #title = "Untitled"
    #list = []
    constructor() {
        super()
    }

    set title(value) {
        this.#title = value
    }

    get title() {
        return this.#title
    }

    set list(value) {
        this.#list = value.map((item) => {
            return ListItem.create(item)
        })
    }

    get list() {
        return this.#list
    }

    append(item) {
        this.list = [...this.#list, ListItem.create(item)]
    }

    remove(item) {
        this.list = this.#list.filter((listItem) => { return listItem !== item })
    }

    set count(value) {
        this.#count = value
    }

    get count() {
        return this.#count
    }

    set limit(value) {
        this.#limit = value
    }

    get limit() {
        return this.#limit
    }
}