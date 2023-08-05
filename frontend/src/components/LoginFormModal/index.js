import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ email, password }))
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
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
            <button className="li-b" type="submit">
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
