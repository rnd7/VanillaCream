import WebComponent from "../lib/web-component.js";
import Recipe from "./recipe.js";

export default class App extends WebComponent {

    #recipe
    #recipeComponent
    constructor() {
        super()

        const maxWidth = 666
        /* Style from string */
        this.appendStyle(`
            :host {
                display: flex;
                width: 100%;
                justify-content: center;
                min-height: 100vh;
                background: #5c1009;
                background-repeat: repeat;
                background-position: top center;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><text fill='%23FFFFFF10' font-family='sans-serif' font-size='60px' x='30' y='40' width='60' height='60' text-anchor='middle'>⚔</text></svg>");
               
            }

            .container {
                display: flex;
                flex-direction: column;
                flex: 1;
                max-width: ${maxWidth}px;
                min-width: 0px;
                flex-basis: max-content;
                box-shadow: 0px 0px 60px rgba(0,0,0,0.3);
                margin: 20px;
                margin-top: 40px;
                
            }

            .content {
                background: #f0f0f0;
                flex-direction: column;

            }
            .header {
            
                display: flex;
                flex-direction: column;
                padding-bottom: 20px;
                overflow: hidden;
                background-color: #101010;
                background: linear-gradient(298deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 4%, rgba(23,22,22,1) 11%, rgba(19,19,19,1) 16%, rgba(17,17,17,1) 19%, rgba(0,0,0,1) 28%, rgba(22,22,22,1) 33%, rgba(27,27,27,1) 37%, rgba(0,0,0,1) 43%, rgba(0,0,0,1) 51%, rgba(19,19,19,1) 59%, rgba(0,0,0,1) 72%, rgba(24,24,24,1) 77%, rgba(0,0,0,1) 85%, rgba(33,33,33,1) 94%);
            }

            .logo {
                text-align: center;
                font-family: sans-serif;
                font-size: 14em;
                
            }

            h2 {
                font-family: serif;
                font-size: 5em;
                margin: 0;
                text-align: center;
                color: #c0c0c0;
                margin-top: -150px;
                margin-bottom: 30px;
                text-shadow: 0px 10px 10px black;
            }

            vc-recipe {
                margin: 20px;
            }
        `)

        const containerEl = document.createElement('div')
        containerEl.classList.add("container")
        this.shadowRoot.append(containerEl)

        const headerEl = document.createElement('div')
        headerEl.classList.add("header")
        containerEl.append(headerEl)

        const contentEl = document.createElement('div')
        contentEl.classList.add("content")
        containerEl.append(contentEl)

        const logoEl = document.createElement('div')
        logoEl.classList.add("logo")
        logoEl.textContent = '⚓'
        headerEl.append(logoEl)

        const headlineEl = document.createElement('h2')
        headlineEl.textContent = "Pirates favorite"
        headerEl.append(headlineEl)

        this.#recipeComponent = Recipe.create()
        contentEl.append(this.#recipeComponent)


    }

    get recipe() {
        return this.#recipe
    }

    set recipe(value) {
        this.#recipe = value
        this.#recipeComponent.fromObject(this.#recipe)
    }

}