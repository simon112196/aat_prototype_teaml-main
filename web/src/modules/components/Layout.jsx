import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import styles from "./components.module.css";
import SwitchTheme from "./SwitchTheme";


/** @module NavBar declaration.*/
export const NavBar = () => {

    const navigate = useNavigate();
    const token = useSelector(state => state.token.value);
    const user = useSelector(state => state.user.value);

    return (
        <nav className={ styles.nav }>
            <section onClick={ () => navigate("/") } className="pointer" >
                <h2>Home</h2>
            </section>
            <section className={ styles.nav_section } >
                { user?.__tablename__ == "Lecturer" && <p className="pointer" onClick={ () => navigate("/assessment/new") } >New Assessment</p> }
                { token?.access && <p className="pointer" onClick={ () => navigate("/logout") } >Logout</p> }
                <SwitchTheme />
            </section>
        </nav>
    );

};

/** 
 * @module Main declaration.
 * @description styled <main> component.
 */
export const Main = props => {

    return (
        <main className={ `${ styles.main }${ props.className ? ` ${ props.className }` : `` }` }>
            { props.children }
        </main>
    );

};

/** @module Footer declaration.*/
export const Footer = props => {

    return (
        <footer>
        </footer>
    );

};

/** @module Card declaration.*/
export const Card = props => {

    return (
        <div className={ `${ styles.card }${ props.className ? ` ${ props.className }` : `` }` }>
            { props.children }
        </div>
    );

};
