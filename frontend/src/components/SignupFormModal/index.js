import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupFormPage.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }

    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
      // "Passwords must be the same",
    });
  };

  useEffect(() => {
    const errors = {};
    if (username.length < 4)
      errors["username"] = "Username must be 4 characters or more";
    if (password.length < 6)
      errors["password"] = "Password must be 6 characters or more";
    setErrors(errors);
  }, [username, password]);

  const check = () => {
    if (!firstName) return true;
    if (!lastName) return true;
    if (!email) return true;
    if (!password) return true;
    else if (password.length < 6) return true;
    if (!username) return true;
    else if (username.length < 4) return true;
    if (!confirmPassword) return true;

    return false;
  };

  return (
    <>
      <h1 className="su-t">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="su-fc">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
          />

          {errors.firstName && <p className="su-e">{errors.firstName}</p>}
        </div>
        <div className="su-fc">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />

          {errors.lastName && <p className="su-e">{errors.lastName}</p>}
        </div>
        <div className="su-fc">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          {errors.email && <p className="su-e">{errors.email}</p>}
        </div>
        <div className="su-fc">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
          />
          {errors.username && <p className="su-e">{errors.username}</p>}
        </div>
        <div className="su-fc">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          {errors.password && <p className="su-e">{errors.password}</p>}
        </div>
        <div className="su-fc">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="su-e">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="su-bc">
          <button disabled={check()} className="su-b" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
