import React, { useEffect } from "react";
import Helpers from "../../utils/Helpers";


/** @module Logout declaration.*/
export const Logout = () => {

    const helpers = new Helpers();

    useEffect(() => helpers.logout(), []);

    return (
        <React.Fragment>
        </React.Fragment>
    );

};
