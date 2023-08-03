import "./EventCard.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import { Navigate } from "react-router-dom";
import { useHistory } from "react-router-dom";

const EventCard = ({ id }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const eventState = useSelector((state) => state.events.Events[id]);

  const onClick = () => {
    history.push(`/events/${eventState.id}`);
  };

  if (!eventState) return null;

  return (
    <>
      <div className="slide">
        <img className="slide-img" src={eventState.previewImage}></img>
        <div onClick={onClick}>
          <div>{eventState.startDate}</div>
          <h3>{eventState.name}</h3>
          {eventState.Venue && (
            <span>
              {eventState.Venue.city}, {eventState.Venue.state}
            </span>
          )}
          <p>{eventState.about}</p>
        </div>
      </div>
    </>
  );
};

export default EventCard;
