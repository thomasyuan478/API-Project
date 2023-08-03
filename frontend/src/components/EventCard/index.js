import "./EventCard.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import { Navigate } from "react-router-dom";
import { useHistory } from "react-router-dom";

const EventCard = ({ obj }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onClick = () => {
    history.push(`/events/${obj.id}`);
  };

  console.log("Event Card OBJ", obj);

  return (
    <>
      <div className="slide">
        <img className="slide-img" src={obj.previewImage}></img>
        <div onClick={onClick}>
          <div>{obj.startDate}</div>
          <h3>{obj.name}</h3>
          {obj.Venue && (
            <span>
              {obj.Venue.city}, {obj.Venue.state}
            </span>
          )}
          <p>{obj.about}</p>
        </div>
      </div>
    </>
  );
};

export default EventCard;
