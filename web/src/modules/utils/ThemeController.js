/** @module ThemeController declaration.*/
class ThemeController {
    
    constructor () {
        this.init();
    };

    change (t) {
        const body = document.body.classList;
        let theme = "light";
    
        if (t) theme = t;
        else if (body.contains("dark")) theme = "light";
        else theme = "dark";
    
        body.remove(theme == "light" ? "dark" : "light");
        body.add(theme);
        localStorage.setItem("theme", theme);
    };

    init() {
        const theme = localStorage.getItem("theme");

        if (theme === "light" || theme === "dark") {
            this.change(theme)
        } else {
            // Assign theme value based on system preferrences if not present in local storage. Acts as default
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.change("dark") 
            } else {
                this.change("light");
            };
        };
    };

};


export default ThemeController;
