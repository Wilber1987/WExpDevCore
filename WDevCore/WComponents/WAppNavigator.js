import { WRender, ComponentsManager } from "../WModules/WComponentsTools.js";
import { WCssClass } from "../WModules/WStyledRender.js";
class WAppNavigator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    attributeChangedCallBack() {
        this.DrawAppNavigator();
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        if (this.id == undefined) {
            const Rand = Math.random();
            this.id = "Menu" + Rand;
        }
        this.DrawAppNavigator();
    }
    ActiveMenu = (ev) => {
        this.shadowRoot.querySelectorAll(".elementNavActive").forEach(elementNavActive => {
            elementNavActive.className = "elementNav";
        });
        ev.target.className = "elementNavActive";
    }
    DrawAppNavigator() {
        const header = {
            type: "header", props: {
                onclick: () => {
                    const nav = this.shadowRoot.querySelector("#MainNav");
                    if (nav.className == "navActive") {
                        nav.className = "";
                    } else {
                        nav.className = "navActive";
                    }
                }
            }, children: [{
                type: "label", props: {
                    innerText: " ",
                    class: "DisplayBtn",
                }, children: []
            }]
        }
        if (typeof this.title === "string") {
            header.children.push({
                type: "label", props: { class: "title", innerText: this.title }
            });
        }
        if (this.Elements == undefined) {
            this.Elements = [];
        }
        const Nav = { type: "nav", props: { id: "MainNav" }, children: [] };
        this.Elements.forEach((element, Index) => {
            if (element.url == undefined) {
                element.url = "#" + this.id;
            }
            const elementNav = {
                type: "a",
                props: { class: "elementNav", innerText: element.name, href: element.url }
            }
            elementNav.props.onclick = async (ev) => {
                this.ActiveMenu(ev);
                if (element.action != undefined) {
                    element.action(ev);
                }
            }
            Nav.children.push(elementNav);
            if (element.SubNav != undefined) {
                elementNav.href = null;
                const SubMenuId = "SubMenu" + Index + this.id;
                const SubNav = {
                    type: "section",
                    props: {
                        id: SubMenuId,  href: element.url,  className: "UnDisplayMenu"
                    },
                    children: []
                }
                if (element.SubNav.Elements != undefined) {
                    element.SubNav.Elements.forEach(SubElement => {
                        SubNav.children.push({
                            type: "a",
                            props: {
                                innerText: SubElement.name, href: SubElement.url,
                                onclick: async (ev) => {
                                    if (SubElement.action != undefined) {
                                        SubElement.action(ev);
                                    }
                                }
                            }
                        });
                    });
                    elementNav.props.onclick = (ev) => {
                        this.ActiveMenu(ev);
                        const MenuSelected = this.shadowRoot.querySelector("#" + SubMenuId);
                        if (MenuSelected.className == "UnDisplayMenu") {
                            MenuSelected.className = "DisplayMenu"
                        } else {
                            MenuSelected.className = "UnDisplayMenu"
                        }
                    }
                    Nav.children.push(SubNav);
                }
            }
        });
        this.shadowRoot.append(WRender.createElement(this.Style()));
        this.shadowRoot.appendChild(WRender.createElement(header));
        this.shadowRoot.append(WRender.createElement(Nav));
    }
    Style() {
        const style = this.querySelector("#NavStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        let navDirection = "row";
        if (this.Direction == "column") {
            navDirection = "column";
        }
        const Style = {
            type: "w-style",
            props: {
                id: "NavStyle" + this.id,
                ClassList: [
                    new WCssClass(`nav`, {
                        display: "flex",
                        "flex-direction": navDirection,
                        padding: "0px 10px",
                        transition: "all 1s",
                    }), new WCssClass(`.elementNav`, {
                        "text-decoration": "none",
                        color: "#444444",
                        padding: "10px",
                        "border-bottom": "solid 2px #eee",
                        transition: "all 0.6s",
                        display: "flex", "align-items": "center",
                    }), new WCssClass(`.elementNavActive`, {
                        "text-decoration": "none",
                        color: "#444444",
                        padding: "10px",
                        "border-bottom": "solid 2px #4da6ff",
                        transition: "all 0.6s",
                        display: "flex", "align-items": "center",
                    }), new WCssClass(`.elementNav:hover`, {
                        "border-bottom": "solid 2px #444444"
                    }), new WCssClass(`header`, {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "left",
                        "box-shadow": "0 1px 1px 0 rgba(0,0,0,0.3)"
                    }),
                    new WCssClass(`.title`, {
                        "font-size": "1.1rem",
                        padding: "10px",
                        color: "#888888",
                        cursor: "pointer"
                    }),
                    //Estilos de submenu
                    new WCssClass(` .UnDisplayMenu`, {
                        overflow: "hidden",
                        "max-height": "0px",
                    }), new WCssClass(` .DisplayMenu`, {
                        overflow: "hidden",
                        "padding-left": "10px",
                        "max-height": "1000px",
                        display: "flex",
                        "flex-direction": "column"
                    }), new WCssClass(`.DisplayMenu a`, {
                        "text-decoration": "none",
                        color: "#444444",
                        padding: "10px",
                        "border-bottom": "solid 1px #999",
                    }),
                    //ocultacion. 
                    new WCssClass(`.DisplayBtn`, {
                        "font-weight": "bold",
                        "font-size": "1.3rem",
                        margin: "10px",
                        display: "none", 
                        "border-radius": "50%",
                        "background-color": "#888888",    
                        height: "15px", width:  "15px", 
                        cursor: "pointer"
                    }), new WCssClass(`.navActive`, {
                        overflow: "hidden",
                        "max-height": "5000px"
                    }),
                ],
                MediaQuery: [{
                    condicion: "(max-width: 800px)",
                    ClassList: [
                        new WCssClass(`.DisplayBtn`, {
                            display: "initial",
                        }),new WCssClass(`nav`, {
                            "flex-direction": "column"
                        }), new WCssClass(`nav`, {
                            overflow: "hidden",
                            "max-height": "0px"
                        }), new WCssClass(`.navActive`, {
                            overflow: "hidden",
                            "max-height": "5000px"
                        }),
                    ]
                },]
            }
        }
        return Style;
    }
}
customElements.define("w-app-navigator", WAppNavigator);