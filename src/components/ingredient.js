import WebComponent from "../lib/web-component.js";

export default class Ingredient extends WebComponent {

    #name = ""
    constructor() {
        super()
    }

    async init() {
        /* Load stylesheet document */
        await this.appendStyleLink('components/ingredient.css')

        /* Load cached html fragment */
        await this.appendHTML('components/ingredient.html')

        this.addRenderTask(() => {
            // the elements are not available before the first render cycle
            this.shadowRoot.querySelector('input.title').addEventListener("change", (ev) => {
                // Change property value of wrapped instance
                this.getReferenceByProperty("name").name = ev.target.value
            })
            this.shadowRoot.querySelector('button.remove').addEventListener("pointerup", (ev) => {
                // dispatch DOM Event
                this.dispatchEvent(new CustomEvent("item-remove", { composed: true }))
            })
        })

        /* complete initialization and start first render cycle */
        super.init()
    }

    get name() {
        return this.#name
    }

    set name(value) {
        this.#name = value
        this.addRenderTask(() => { this.shadowRoot.querySelector('input.title').value = this.#name })
    }

}