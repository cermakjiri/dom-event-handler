import DomEventHandler from "../../src/";

const h1 = new DomEventHandler();
const h2 = new DomEventHandler();

const s1 = h1.attach(window, "click", () => {
    console.log("s1 - click");
});

const s2 = h1.attach(window, "mousemove", () => {
    console.log("s1 - mousemove");
});

h2.attach(window, "mousemove", () => {
    console.log("s2 - mousemove");
});

window.DomEventHandler = DomEventHandler;
window.h1 = h1;
window.h2 = h2;
