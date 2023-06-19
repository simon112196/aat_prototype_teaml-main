import React, { useState, useRef } from "react";
import styles from "./components.module.css";


/** @module Fieldset declaration.*/
export const Fieldset = props => {

    return (
        <fieldset className={ `${ styles.fieldset }${ props.className ? ` ${ props.className }` : `` }` } style={ props.style } form={ props.form } >
            { props.children }
        </fieldset>
    );

};

/** @module BasicInput declaration.*/
export const BasicInput = (props) => {

    const handleChange = (event) => {
        props.setValue(event.target.value);
    };

    return (
        <span className={`${ styles.wrapper }${ props.className ? props.className : `` }`}>
            <input
                className={ styles.input }
                type={ props.type ? props.type : "text" }
                value={ props.value }
                onChange={ props.handleChange ? props.handleChange : handleChange }
                placeholder={ props.placeholder }
                required={ props.required }
                autoFocus={ props.autoFocus }
                maxLength={ props.maxLength || 256 }
                autoComplete={ props.autoComplete ? props.autoComplete : null }
                form={ props.form } 
            />
            { props.children }
        </span>
    )
};

/** @module TextArea declaration.*/
export const TextArea = (props) => {

    const handleChange = (event) => {
        props.setValue(event.target.value);
    };

    return (
        <span className={`${ styles.wrapper }${ props.className ? props.className : `` }`}>
            <textarea
                className={ styles.input }
                value={ props.value }
                onChange={ props.handleChange ? props.handleChange : handleChange }
                placeholder={ props.placeholder }
                required={ props.required }
                autoFocus={ props.autoFocus }
                maxLength={ props.maxLength || 256 }
                autoComplete={ props.autoComplete ? props.autoComplete : null }
                rows={ props.rows }
                form={ props.form } 
            />
            { props.children }
        </span>
    )
};

/** @module PasswordInput declaration.*/
export const PasswordInput = props => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <BasicInput {...props} type={ showPassword ? `text` : `password` } autoComplete="on" >
            <span onClick={ () => setShowPassword(!showPassword) } className="pointer" >
                <p>
                    { showPassword ? "Hide" : "Show" }
                </p>
            </span>
        </BasicInput>
    );

};

/** @module Checkbox declaration.*/
export const Checkbox = props => {

    const handleChange = event => {
        props.setValue(event.target.checked);
    };

    return (
        <span className={ `${ styles.wrapper } ${ styles.checkbox_wrapper }` }>
            <input
                type="checkbox"
                className={ `${ styles.checkbox }${ props.className ? ` ${ props.className }` : `` }` }
                value={ props.value }
                onChange={ props.handleChange ? props.handleChange : handleChange }
                id={ props.id ? props.id : "checkbox" }
            />
            <label
                htmlFor={ props.id ? props.id : "checkbox" }
            >
                { props.label }
            </label>
        </span>
    );

};

export const Radio = props => {

    const handleChange = event => {
        props.setValue(event.target.value);
    };
    
    return (
        <span className={ `${ styles.wrapper } ${ styles.checkbox_wrapper }` }>
            <input
                type="radio"
                className={ `${ styles.radio }${ props.className ? ` ${ props.className }` : `` }` }
                value={ props.value }
                form={ props.form }
                name={ props.name }
                onChange={ props.handleChange ? props.handleChange : handleChange }
                id={ props.id ? props.id : "radio"  }
            />
            <label
                htmlFor={ props.id ? props.id : "radio" }
            >
                { props.label }
            </label>
        </span>
    );

};

/** @module Button declaration.*/
export const Button = props => {

    return (
        <button
            type={ props.type ? props.type : `button` }
            form={ props.form }
            onClick={ props.onClick }
            className={ `${ styles.button }${ props.className ? ` ${ props.className }` : `` } pointer` }
        >
            { props.children }
        </button>
    );

}

/** @module Submit declaration.*/
export const Submit = props => {

    return (
        <input
            type="submit"
            form={ props.form }
            className={ `${ styles.submit }${ props.className ? props.className : `` } pointer` }
        />
    );

};
