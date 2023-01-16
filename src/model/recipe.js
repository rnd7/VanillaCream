import wrapInstance from "../lib/wrap-instance.js";
import wrapList from "../lib/wrap-list.js";
import Ingredient from "./ingredient.js";

export default class Recipe {

    #title = "Untitled"
    #list = wrapList(Ingredient)

    constructor(opts) {
        wrapInstance(this, opts)
    }

    set title(value) {
        this.#title = value
    }

    get title() {
        return this.#title
    }

    set list(value) {
        this.#list = wrapList(Ingredient, value)
    }

    get list() {
        return this.#list
    }
}