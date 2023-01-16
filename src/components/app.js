import SignalProcessor from "../lib/signal-processor.js";
import WebComponent from "../lib/web-component.js";
import ListItem from "./list-item.js";

export default class App extends WebComponent {

    #title = "Some List"
    #bodyCount = 0
    #list = []
    constructor() {
        super()
        /* Style from string */
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
                padding: 10px;
            }
            hr {
                display: flex;
                width: 100%;
            }
            button {
                padding: 10px;
            }
            .body-count {
                font-family: sans-serif;
                font-size: 4em;
            }
        `)

        const headlineEl = document.createElement('h2')
        headlineEl.textContent = "Pirate's favorite stew"
        this.shadowRoot.append(headlineEl)

        const titleEl = document.createElement('input')
        titleEl.classList.add("title")
        this.shadowRoot.append(titleEl)
        titleEl.addEventListener("change", (ev) => {
            // Change property value of wrapped instance
            this.setReference("title", ev.target.value)
        })

        const bodyCountEl = document.createElement('div')
        bodyCountEl.classList.add("body-count")
        this.shadowRoot.append(bodyCountEl)
        bodyCountEl.addEventListener("pointerup", (ev) => {
            // Change property value of wrapped instance
            this.getReference("bodyCount").bodyCount++
        })

        this.shadowRoot.append(document.createElement('hr'))

        const listEl = document.createElement('div')
        listEl.classList.add("list")
        this.shadowRoot.append(listEl)

        /* Arrow function event listener */
        listEl.addEventListener("item-remove", (ev) => {
            this.#list.splice(this.findContainerIndex(listEl, ev.target), 1)
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
        this.addRenderTask(() => { this.shadowRoot.querySelector('input.title').value = this.#title })
    }

    get bodyCount() {
        return this.#bodyCount
    }

    set bodyCount(value) {
        this.#bodyCount = value
        this.addRenderTask(() => { this.shadowRoot.querySelector('div.body-count').textContent = Array(this.#bodyCount).fill('☠').join('') })
    }

    get list() {
        return this.#list
    }

    set list(value) {
        this.#list = value

        /* automatic container child management */
        this.manageContainer(
            this.shadowRoot.querySelector('div.list'),
            this.#list,
            ListItem
        )
    }

    #onAppend() {
        this.#list.push({})
    }
}