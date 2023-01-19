import wrapInstance from "../lib/wrap-instance.js";
import wrapList from "../lib/wrap-list.js";
import Ingredient from "./ingredient.js";

export default class Recipe {

    #title = "Untitled"
    #ingredients = wrapList(Ingredient)

    constructor(opts) {
        wrapInstance(this, opts)
    }

    set title(value) {
        this.#title = value
    }

    get title() {
        return this.#title
    }

    set ingredients(value) {
        this.#ingredients = wrapList(Ingredient, value)
    }

    get ingredients() {
        return this.#ingredients
    }
}