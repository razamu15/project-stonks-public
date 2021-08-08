import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const authContext = createContext();

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

function useAuth() {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const checkSession = async (cb) => {
        // check if the token and user are in local storage
        let token = localStorage.getItem("authToken");
        let user = localStorage.getItem("user");
        if ( token !== null && token !== "" && user !== null && user !== "") {
            // if they are, then we need to revalidate the token to check if they expired or not
            try {
                let response = await axios.post('/verify', {}, {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                });
                setUser(JSON.parse(user));
                cb();
            } catch (error) {
                console.error("auth caught error on verify", error);
                // set the local storage of auth and user to null
                localStorage.setItem("authToken", "");
                localStorage.setItem("user", "");
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }

    const signUp = (details, cb) => {
        // here make the request to the backend
        return axios.post('/register', details)
            .then((response) => {
                cb();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const signIn = (details, cb) => {
        // here make the request to the backend
        return axios.post('/login', details)
            .then((response) => {
                // set the user info into state
                let user = {userID: response.data.user_id, username: response.data.username};
                setUser(user);
                // store the JWT and user in localStorage
                localStorage.setItem("authToken", response.data.auth_token);
                localStorage.setItem("user", JSON.stringify(user));
                cb();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const signOut = cb => {
        return axios.post('/logout', {}, {
            headers: {
                'Authorization': `token ${localStorage.getItem("authToken")}`
            }
        }).then((response) => {
            // set the local storage of auth and user to null
            localStorage.setItem("authToken", "");
            localStorage.setItem("user", "");
            setUser(null);
            cb();
        }).catch((error) => {
            console.error(error);
        });
    };

    return {
        user,
        signIn,
        signOut,
        signUp,
        checkSession
    };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export {
    ProvideAuth,
    PrivateRoute,
    useAuth
}