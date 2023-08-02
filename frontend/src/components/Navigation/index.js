import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="nav-container">
      <NavLink exact to="/">
        PartyFinder
      </NavLink>
      <div className="nav-func">
        <NavLink to="/groups/new">Start a group</NavLink>
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </div>
  );
}

export default Navigation;
