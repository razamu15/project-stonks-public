import React, { useState } from "react";
import { useAuth } from '../Utils/Auth';
import { useHistory } from "react-router-dom";

import '../../Styles/Register.css'


function Register(props) {
  let auth = useAuth();
  let history = useHistory();

  const [info, setInfo] = useState({ username: "", email: "", password: "" });

  const signUp = e => {
    e.preventDefault();
    auth.signUp(info, () => {
      history.push('/login');
    });
  }

  return (

    <section class="container">
      <div class="columns is-multiline">
        <div class="column is-8 is-offset-2 register">
          <div class="columns">
            <div class="column left">
              <h1 class="title is-1">Stonks</h1>
              <h2 class="subtitle colored is-4">A Social Investing Experience.</h2>
              <p>A social media platform that enables investors to collaborate with friends and family to enrich their investing experience whilst enabling them to be better informed on social trends.</p>
            </div>
            <div class="column right has-text-centered">
              <h1 class="title is-4">Sign up today</h1>
              <p class="description">Track real time social media trends and market movements</p>

              <form>
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="text" name="username" autoComplete="on" id="username" placeholder="Enter a username" required
                      onChange={e => setInfo({ ...info, username: e.target.value })}
                    />
                  </div></div>
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="text" name="email" autoComplete="on" id="email" placeholder="Enter an email" required
                      onChange={e => setInfo({ ...info, email: e.target.value })}
                    /></div></div>
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="password" name="password" autoComplete="on" id="password" placeholder="Enter a password" required
                      onChange={e => setInfo({ ...info, password: e.target.value })}
                    /></div></div>
                <button class="button is-block is-primary is-fullwidth is-medium" id="signup" onClick={signUp} name="action">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>


  )
}


export default Register;
