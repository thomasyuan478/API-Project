import "./GroupCard.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import { Navigate } from "react-router-dom";
import { useHistory } from "react-router-dom";

const GroupCard = ({ obj, id }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const state = useSelector((state) => state.groups.allGroups[id]);
  // console.log("State", state, id);

  const onClick = () => {
    history.push(`/groups/${obj.id}`);
  };

  if (!state) return null;

  return (
    <>
      <div onClick={onClick} className="slide">
        <div className="s-ic">
          <img className="slide-img" src={state.previewImage}></img>
        </div>
        <div className="gs-con">
          <h3>{state.name}</h3>
          <span>
            {state.city}, {state.state}
          </span>
          <p>{state.about}</p>
          <div>
            {state.numEvents} Events · {state.private ? "Private" : "Public"}
          </div>
        </div>
      </div>
    </>
  );
};


export default GroupCard;
