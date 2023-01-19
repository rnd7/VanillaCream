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

            @keyframes gradient {
                0% {
                    background-position: -666px 50%;
                }
                100% {
                    background-position: 666px 50%;
                }
            }
            .header {
            
                display: flex;
                flex-direction: column;
                padding-bottom: 30px;
                overflow: hidden;
                 
                background-color: #101010;
                background-image: linear-gradient(135deg, rgba(1,1,1,1) 10%, rgba(80,80,80,1) 15%, rgba(1,1,1,1) 20%, rgba(1,1,1,1) 30%, rgba(80,80,80,1) 35%, rgba(1,1,1,1) 40%, rgba(1,1,1,1) 50%, rgba(80,80,80,1) 55%, rgba(1,1,1,1) 60%, rgba(1,1,1,1) 70%, rgba(80,80,80,1) 75%, rgba(1,1,1,1) 80%, rgba(1,1,1,1) 90%, rgba(80,80,80,1) 95%, rgba(1,1,1,1) 100%);
                
                background-size: 1332px 333px;
                animation: gradient 12s linear infinite;
            }


            .logo {
                text-align: center;
                font-family: sans-serif;
                font-size: 14em;
                text-shadow: 0px 0px 10px black;
                mix-blend-mode: hard-light;
                opacity: .7;
                
            }

            h2 {
                font-family: fantasy;
                font-size: 4em;
                line-height: 1em;
                margin: 0;
                text-align: center;
                color: #c0c0c0;
                margin-top: -140px;
                margin-bottom: 30px;
                text-shadow: 0px 10px 10px black;
                mix-blend-mode: hard-light;
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
        logoEl.textContent = '☠️'//'⚓'
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