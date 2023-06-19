import React, { useEffect } from "react";
import Routes from "./Routes";
import { useDispatch, useSelector } from 'react-redux';
import store from "./stores/store";
import { setToken } from './stores/tokenStore';
import { setUser } from './stores/userStore';
import Cookies from "./modules/utils/Cookies"
import Helpers from "./modules/utils/Helpers";


/** @module App declaration.*/
const App = () => {

	const token = useSelector(state => state.token.value);
	const dispatch = useDispatch();
	const accessCookies = new Cookies("access_token");
	const refreshCookies = new Cookies("refresh_token");
	const helpers = new Helpers();

	/** 
	 * @description Dispatch the auth token into the user store.
	 */
	 const dispatchToken = () => {
		const accessToken = accessCookies.get();
		dispatch(setToken(accessToken));
	};

	/** 
	 * @description Get the currently logged in user. Triggered by useEffect() hooked on token.
	 * @note the function needs to be async, and await the helpers.verifyToken() method.
	 */
	 const getUser = async () => {
		await helpers.verifyToken();
		const access_token = store.getState().token.value.access;
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${ access_token }`);

        fetch(`${ process.env.SERVER_ADDRESS }/api/user`, {
            method: "GET",
            headers: headers
        })
            .then(res => {
				if (!res || res.status >= 400) {
					if (res.status === 401) helpers.logout();
					return;
				};
				return res.json()
			})
            .then(res => {
				dispatch(setUser(res));
			})
            .catch(error => console.log({ error: error.message }));
    };

	useEffect(() => {
		if (!token.access) return;
		getUser();
	}, [ token ]);

	useEffect(() => {
		dispatchToken();
	}, []);

	return (
		<Routes />
	);
}


export default App;
