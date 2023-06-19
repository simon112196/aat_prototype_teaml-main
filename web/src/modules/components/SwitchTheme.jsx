import React, { useState } from "react";
import ThemeController from "../utils/ThemeController";


/** @module SwitchTheme declaration.*/
const SwitchTheme = () => {

    const themes = new ThemeController();

    /** 
     * @description Get the initial value for the theme based on localStorage or browser preferences if not present.
     * @fallback light
     */
    const getInitial = () => {
        const t = localStorage.getItem("theme");
        if (t === "light" || t === "dark") return t;
        else
            // Assign theme value based on system preferrences if not present in local storage. Acts as default
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "dark"
            } else {
                return "light";
            };
    };

    const [theme, setTheme] = useState(getInitial());

    const handleClick = () => {
        themes.change();
        setTheme(localStorage.getItem("theme"));
    };

    return (
        <span onClick={ handleClick } >
            <p style={{ color: "var(--text-color)"}} className="pointer" >
                { theme === "dark" ? "Light" : "Dark" } mode
            </p>
        </span>
    );

};


export default SwitchTheme;
