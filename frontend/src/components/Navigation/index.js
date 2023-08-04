import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="nav-container">
      <NavLink className="Logo" exact to="/">
        PartyFinder
      </NavLink>
      <div className="nav-func">
        <NavLink className="nav-group" to="/groups/new">
          Start a Group
        </NavLink>
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </div>
  );
}

export default Navigation;
