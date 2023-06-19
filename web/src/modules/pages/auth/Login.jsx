import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { setToken } from '../../../stores/tokenStore';
import { Fieldset, BasicInput, PasswordInput, Submit } from "../../components/Inputs";
import { NavBar, Card, Main, Footer } from "../../components/Layout";
import APIController from "../../utils/APIController";
import Cookies from "../../utils/Cookies"


/** @module Login declaration.*/
export const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const accessCookies = new Cookies("access_token");
    const refreshCookies = new Cookies("refresh_token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const api = new APIController(false);

    const submit = event => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        api.post("login", formData)
            .then(res => res.json())
            .then(res => {
                accessCookies.set(res.access_token, 1);
                refreshCookies.set(res.refresh_token, 30);
                dispatch(setToken(res.access_token));
                navigate('/');
            })
            .finally(() => {
                setUsername("");
                setPassword("");
            });
    }

    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card>
                    <header>
                        <h1>Login</h1>
                    </header>
                    <form id="login" onSubmit={ submit } >
                        <Fieldset form="login">
                            <BasicInput
                                value={ username }
                                setValue={ setUsername }
                                placeholder="Username"
                                required
                                autoFocus
                            />
                            <PasswordInput
                                value={ password }
                                setValue={ setPassword }
                                placeholder="Password"
                                required
                            />
                            <Submit
                                form="login"
                            />
                        </Fieldset>
                    </form>
                    <p>
                        Need an account? <span onClick={ () => navigate("/register") } className="pointer" >Register here</span>.
                    </p>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );

};
