import WebComponent from "../lib/web-component.js";

export default class ListItem extends WebComponent {

    #title = ""
    constructor() {
        super()
    }

    async init() {
        await this.appendStyleLink('components/list-item.css')
        await this.appendHTML('components/list-item.html')
        this.addRenderTask(() => {
            this.shadowRoot.querySelector('input.title').addEventListener("change", (ev) => {
                console.log("change", ev.target.value)
                this.setReference("title", ev.target.value)
            })
            this.shadowRoot.querySelector('button.remove').addEventListener("pointerup", (ev) => {
                console.log("delete", ev.target.value)
                this.dispatchEvent(new CustomEvent("item-remove", { composed: true }))
            })
        })
        super.init()
    }

    get title() {
        return this.#title
    }

    set title(value) {
        console.log("set title", value)
        this.#title = value
        this.addRenderTask(() => { this.shadowRoot.querySelector('input.title').value = this.#title })
    }

}