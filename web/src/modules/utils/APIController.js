import Helpers from "./Helpers";
import store from "../../stores/store";


/** 
 * @module APIController declaration.
 * @description 
 * wrapper class for the 'fetch()' node function.
 * @params 
 * authenticated: string - Whether or not the requests should be authenticated
 */
class APIController {

    authenticated;
    helpers = new Helpers();

    constructor(authenticated) {
        this.authenticated = authenticated;
    };

    /**
     * @method APIController.get declaration.
     * @description
     * sends a GET request to the backend api server.
     * @params
     * - uri: string - api endpoint. Should NOT end or start with '/'.
     * - body: (FormData | Object) - the request body.
     * @returns
     * Promise<any>: A promise which resolves with the response data, and rejects with an error message.
     */
    get(uri, body) {
        return new Promise((resolve, reject) => {
            this.fetch(uri, body, "GET")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    };

    /**
     * @method APIController.post declaration.
     * @description
     * sends a POST request to the backend api server.
     * @params
     * - uri: string - api endpoint. Should NOT end or start with '/'.
     * - body: (FormData | Object) - the request body.
     * @returns
     * Promise<any>: A promise which resolves with the response data, and rejects with an error message.
     */
    post(uri, body) {
        return new Promise((resolve, reject) => {
            this.fetch(uri, body, "POST")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    };

    /**
     * @method APIController.put declaration.
     * @description
     * sends a PUT request to the backend api server.
     * @params
     * - uri: string - api endpoint. Should NOT end or start with '/'.
     * - body: (FormData | Object) - the request body.
     * @returns
     * Promise<any>: A promise which resolves with the response data, and rejects with an error message.
     */
    put(uri, body) {
        return new Promise((resolve, reject) => {
            this.fetch(uri, body, "PUT")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    };

    /**
     * @method APIController.delete declaration.
     * @description
     * sends a DELETE request to the backend api server.
     * @params
     * - uri: string - api endpoint. Should NOT end or start with '/'.
     * - body: (FormData | Object) - the request body.
     * @returns
     * Promise<any>: A promise which resolves with the response data, and rejects with an error message.
     */
    delete(uri, body) {
        return new Promise((resolve, reject) => {
            this.fetch(uri, body, "DELETE")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    };

    /** 
     * @method APIController.fetch declaration.
     * @description
     * sends a request to the backend api server.
     * @params
     * - uri: string - api endpoint. Should NOT end or start with '/'.
     * - body: (FormData | Object) - the request body.
     * - method: ("GET" | "POST" | PUT | "DELETE") - the request method.
     * @return 
     * Promise<any>: A promise which resolves with the response data, and rejects with an error message.
     */
    fetch(uri, body, method) {
        const headers = this.authenticate();

        return new Promise((resolve, reject) => {
            fetch(`${ process.env.SERVER_ADDRESS }/api/${ uri }`, {
                method: method,
                headers: headers,
                body: body
            })
                .then(res => {
                    if (res.status >= 400) {
                        if (res.status === 401 && this.authenticated === true) this.helpers.logout();
                        const message = this.getMessage(res);
                        console.log(message)
                        reject( message );
                    } else if (!res) {
                        const message = { "error": "Could not get a response." };
                        console.log(message); 
                        reject( message );  
                    };
                    resolve(res);
                })
        });
    };

    /** 
     * @method APIController.authenticate declaration.
     * @returns headers: Headers - api request headers.
     */
    authenticate () {
        const headers = new Headers();
        if (!this.authenticated) return headers;
        this.helpers.verifyToken();

        const token = store.getState().token.value.access;
        headers.append("Authorization", `Bearer ${ token }`);
        return headers;
    };

    /**
     * @method APIController.getMessage declaration.
     * @params res: Object - an api response.
     * @returns message: Object - a formatted error.
     */
    getMessage(res) {
        const message = new Object();
        Object.assign(message, { "message": res.body });
        Object.assign(message, { "status": res.status });
        Object.assign(message, { "error": res.statusText });
    };

};


export default APIController;
