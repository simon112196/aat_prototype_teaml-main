import dayjs from 'dayjs';
import jwt_decode from "jwt-decode";
import Cookies from "./Cookies";
import store from "../../stores/store";
import { setToken } from '../../stores/tokenStore';
import { setUser } from '../../stores/userStore';


/** @module Helpers declaration.*/
class Helpers {
    
    /** Return a valid access token */
    verifyToken() {
        const access_token = store.getState().token.value.access;
        const user = jwt_decode(access_token);
		const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        if (isExpired) this.#refreshToken();
    };
    
    /** Refresh the token, returns a new access token */
    #refreshToken () {
        const refreshCookies = new Cookies("refresh_token");
        const accessCookies = new Cookies("access_token");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${ refreshCookies.get() }`);

        fetch(`${ process.env.SERVER_ADDRESS }/api/token/refresh`, {
            method: "POST",
            headers: headers
        })
            .then(res => {
                if (!res || res.status >= 400) {
                    if (!res || res.status >= 400) {
                        if (res.status === 401) this.logout();
                        return;
                    };
                };
                return res.json()
            })
            .then(res => {
                accessCookies.set(res.access_token, 1);
                refreshCookies.set(res.refresh_token, 30);
                store.dispatch(setToken(res.access_token));
            })
            .catch(error => console.log({ error: error.message }));
    };

    logout() {
        const accessCookies = new Cookies("access_token");
        const refreshCookies = new Cookies("refresh_token");
        accessCookies.delete();
        refreshCookies.delete();
        store.dispatch(setUser(null));
        store.dispatch(setToken(null));
    };

};


export default Helpers;
