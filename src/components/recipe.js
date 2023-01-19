import findChildIndex from "../lib/find-child-index.js";
import WebComponent from "../lib/web-component.js";
import Ingredient from "./ingredient.js";

export default class Recipe extends WebComponent {
    #title = ""
    #bodyCount = 0
    #ingredients = []
    constructor() {
        super()
        /* Style from string */
        this.appendStyle(`
            :host {
                display: flex;
                flex-direction: column;
            }

            .title {
                font-size: 2em;
                padding: 10px;
            }

            hr {
                display: flex;
                width: 100%;
                box-sizing: border-box;
            }
            
            button {
                padding: 10px;
            }

            .body-count {
                font-family: sans-serif;
                font-size: 4em;
                letter-spacing: 0.085em;
                line-break: anywhere
            }
            .ingredients {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
        `)


        this.shadowRoot.append(document.createElement('hr'))

        const titleEl = document.createElement('input')
        titleEl.classList.add("title")
        this.shadowRoot.append(titleEl)
        titleEl.addEventListener("change", (ev) => {
            // Change property value of wrapped instance
            this.setReferenceProperty("title", ev.target.value)
        })
        this.shadowRoot.append(document.createElement('hr'))

        const bodyCountEl = document.createElement('div')
        bodyCountEl.classList.add("body-count")
        this.shadowRoot.append(bodyCountEl)
        bodyCountEl.addEventListener("pointerup", (ev) => {
            // Change property value of wrapped instance
            this.getReferenceByProperty("bodyCount").bodyCount++
        })

        this.shadowRoot.append(document.createElement('hr'))

        const ingredientsEl = document.createElement('div')
        ingredientsEl.classList.add("ingredients")
        this.shadowRoot.append(ingredientsEl)

        /* Arrow function event listener */
        ingredientsEl.addEventListener("item-remove", (ev) => {
            this.#ingredients.splice(findChildIndex(ingredientsEl, ev.target), 1)
        }, true)


        const buttonEl = document.createElement('button')
        buttonEl.classList.add("append")
        buttonEl.textContent = "Append"
        this.shadowRoot.append(buttonEl)

        /* Bound method as event listener */
        buttonEl.addEventListener("pointerup", this.bound(this.#onAppend))

    }

    get title() {
        return this.#title
    }

    set title(value) {
        this.#title = value
        this.addRenderTask(this.bound(this.#renderTitle))
    }

    get bodyCount() {
        return this.#bodyCount
    }

    set bodyCount(value) {
        this.#bodyCount = value
        this.addRenderTask(() => { this.shadowRoot.querySelector('div.body-count').textContent = Array(this.#bodyCount).fill('☠️').join('') })
    }

    get ingredients() {
        return this.#ingredients
    }

    set ingredients(value) {
        console.log("ingredients", value)
        this.#ingredients = value
        this.addRenderTask(this.bound(this.#renderIngredients))
    }

    #onAppend() {
        this.#ingredients.push({})
    }

    #renderTitle() {
        console.log("render title")
        this.shadowRoot.querySelector('input.title').value = this.#title
    }

    #renderIngredients() {
        /* automatic container child management */
        this.renderList(
            this.shadowRoot.querySelector('div.ingredients'),
            this.#ingredients,
            Ingredient
        )
    }
}