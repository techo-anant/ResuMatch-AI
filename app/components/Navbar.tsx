import React, {type JSX} from 'react';
import {Link} from "react-router";

const Navbar:() => JSX.Element = ()=> {
    return(
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMATCH</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}

export default Navbar;
