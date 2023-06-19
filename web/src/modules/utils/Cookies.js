/** @module Cookies declaration.*/
class Cookies {

    #name;

    constructor (name) {
        this.#name = name;
    };

    get() {
        const nameEQ = this.#name + "=";
        const cookie = document.cookie.split(';');
    
        for (let i = 0; i < cookie.length; i++) {
            let c = cookie[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        };
        return null;
    };

    set(value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        };
        document.cookie = this.#name + "=" + (value || "")  + expires + "; domain=" + process.env.DOMAIN + "; path=/";
    };

    delete() {
        document.cookie = this.#name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

};


export default Cookies;