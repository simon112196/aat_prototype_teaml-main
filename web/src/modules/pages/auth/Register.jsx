import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fieldset, BasicInput, PasswordInput, Submit, Checkbox } from "../../components/Inputs";
import { NavBar, Main, Card, Footer } from "../../components/Layout";
import APIController from "../../utils/APIController";


/** @module Register declaration.*/
export const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [lecturer, setLecturer] = useState(false);
    const api = new APIController(false);
    const navigate = useNavigate();

    const submit = event => {
        event.preventDefault();

        if ( password !== confirmPassword ) return;
        
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("lecturer", lecturer);
    
        api.post("register", formData)
            .then(res => {
                navigate('/login');
            })
            .finally(() => {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setLecturer(false);
            });
    };

    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card>
                    <header>
                        <h1>Register</h1>
                    </header>
                    <form id="register" onSubmit={ submit } >
                        <Fieldset form="register">
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
                            <PasswordInput
                                value={ confirmPassword }
                                setValue={ setConfirmPassword }
                                placeholder="Confirm password"
                                required
                            />
                            <Checkbox
                                label="Lecturer"
                                value={ lecturer }
                                setValue={ setLecturer }
                            />
                            <Submit
                                form="register"
                            />
                        </Fieldset>
                    </form>
                    <p>
                        Already have an account? <span onClick={ () => navigate("/login") } className="pointer" >Log in here</span>.
                    </p>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );

};
