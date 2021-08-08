import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from '../Utils/Auth';

function Login(props) {
  const [form, updateForm] = useState({ email: "", password: "" });
  let history = useHistory();
  let auth = useAuth();

  function handleFormChange(e) {
    let newState = {
      ...form,
    };
    newState[e.target.id] = e.target.value;
    updateForm(newState);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    auth.signIn(form, () => {
      history.push('/home');
    });
    updateForm({ email: "", password: "" });
  }

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="login card column is-4 is-offset-4">
            <img src="https://logoipsum.com/logo/logo-1.svg" width="325px" />
            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <div className="control">
                  <input className="input is-medium is-rounded" placeholder="hello@example.com" autoComplete="username"
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input is-medium is-rounded" placeholder="**********" autoComplete="current-password"
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
                    required />
                </div>
              </div>
              <br />
              <button className="button is-block is-fullwidth is-primary is-medium is-rounded" type="submit">Login</button>
            </form>
            <br />
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <Link to={`/`}>Forgot Password?</Link>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <Link to={`/register`}>Create Account</Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

