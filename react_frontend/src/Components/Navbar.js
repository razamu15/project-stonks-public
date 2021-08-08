import React from "react";
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useAuth } from './Utils/Auth';
import '../Styles/Navbar.css'

function Home(props) {
    let { path, url } = useRouteMatch();
    let history = useHistory();
    let auth = useAuth();

    return (
        <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to={`/`}>
                    <img src="https://dslv9ilpbe7p1.cloudfront.net/Ln9SnKBLyrz_YNr7I_bH8g_store_logo_image.png" width="150" height="60" />
                </Link>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                {/* These are routes that are only defined after we log in and get to the home screen */}
                {auth.user ? (
                    <div className="navbar-start">
                        <Link className="navbar-item" to={`/home`}>Home</Link>
                        <Link className="navbar-item" to={`${url}/groups`}>Groups</Link>
                        <Link className="navbar-item" to={`${url}/cards`}>Posts</Link>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link"> More </a>
                            <div className="navbar-dropdown">
                                <Link className="navbar-item is-active" to={`${url}/leaderboard`}>Leaderboard</Link>
                                <hr className="navbar-divider is-active" />
                                <Link className="navbar-item is-active" to={`${url}/account`}>Account Settings</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="navbar-start">
                        {/* <a className="navbar-item"><Link to={`/home`}>Home</Link></a>
                        <a className="navbar-item"><Link to={`/`}>Some page that doesnt need signin</Link></a> */}
                    </div>
                )}

                <div className="navbar-end">
                    <div className="navbar-item">
                        {auth.user ? (
                            <div className="buttons">
                                <a className="button is-primary" onClick={() => auth.signOut(() => history.push("/"))}><strong>Log Out</strong></a>
                            </div>
                        ) : (
                            <div className="buttons">
                                <Link className="button is-primary" to="/register">Sign Up</Link>
                                <Link className="button is-light" to="/login">Log In</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Home;

