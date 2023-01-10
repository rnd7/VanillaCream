import SignalProcessor from "../lib/signal-processor.js";
import WebComponent from "../lib/web-component.js";
import ListItem from "./list-item.js";

export default class App extends WebComponent {

    #title = "Some List"
    #list = []
    constructor() {
        super()
        this.appendStyle(`
            :host {
                display: flex;
                flex-direction: column;
            }
            h2 {
                font-family: sans-serif;
                font-size: 4em;
                margin: 0;
            }
            .title {
                font-size: 2em;
            }
            hr {
                display: flex;
                width: 100%;
            }
        `)
        const headlineEl = document.createElement('h2')
        headlineEl.textContent = "Pirate's favorite stew"
        this.shadowRoot.append(headlineEl)
        const titleEl = document.createElement('input')
        titleEl.classList.add("title")
        this.shadowRoot.append(titleEl)
        this.shadowRoot.append(document.createElement('hr'))
        const listEl = document.createElement('div')
        listEl.classList.add("list")
        listEl.addEventListener("item-remove", (ev) => {
            console.log("remove", ev.target, this.findContainerIndex(listEl, ev.target))
            this.callReference("remove", this.#list[this.findContainerIndex(listEl, ev.target)])
        }, true)
        this.shadowRoot.append(listEl)
        const buttonEl = document.createElement('button')
        buttonEl.classList.add("append")
        buttonEl.textContent = "Append"
        buttonEl.addEventListener("pointerup", this.bound(this.#onAppend))
        this.shadowRoot.append(buttonEl)

    }

    get title() {
        return this.#title
    }

    set title(value) {
        this.#title = value
        this.addRenderTask(() => { this.shadowRoot.querySelector('input.title').value = this.#title })
    }

    get list() {
        return this.#list
    }

    set list(value) {
        this.#list = value
        this.manageContainer(
            this.shadowRoot.querySelector('div.list'),
            this.#list,
            ListItem
        )
    }

    #onAppend() {
        this.callReference("append", {})
    }
}