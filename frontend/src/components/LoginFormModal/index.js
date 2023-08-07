import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { check } from "express-validator";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ username, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const loginDemoUser = (e) => {
    return dispatch(
      sessionActions.login({
        email: "user2@user.io",
        username: "FakeUser3",
        credential: "user2@user.io",
        password: "password3",
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const check = () => {
    if (username.length < 4) return true;
    if (password.length < 6) return true;
    return false;
  };

  return (
    <>
      <div className="login-modal">
        <h1 className="login-title">Log In</h1>
        <form onSubmit={handleSubmit}>
          {errors.credential && <p id="li-error">{errors.credential}</p>}
          <div className="login-fields">
            {/* <label>
              Email
              </label> */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="login-fields">
            {/* <label>
              Password
              </label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="li-bc">
            <button disabled={check()} className="li-b" type="submit">
              Log In
            </button>
          </div>
        </form>
        <div className="li-bc">
          <button className="li-bd" onClick={loginDemoUser}>
            Demo User
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginFormModal;
