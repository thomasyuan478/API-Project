import "./DisplayEventCard.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import { Navigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getEventDetail, getEvents } from "../../store/event";

const EventCard = ({ id }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const eventState = useSelector((state) => state.events.Events[id]);
  const events = useSelector((state) => state.events.Events);
  const test = useSelector((state) => state.events);

  console.log(Object.keys(events).length);

  useEffect(() => {
    if (!Object.keys(events).length) dispatch(getEvents());
  }, [dispatch]);

  const onClick = () => {
    history.push(`/events/${eventState.id}`);
  };

  if (!eventState) return null;

  return (
    <>
      <div className="dec-oc">
        <div className="slide2">
          <img className="slide-img2" src={eventState.previewImage}></img>
          <div className="dec-cc" onClick={onClick}>
            <div>
              {eventState.startDate.slice(0, 12) +
                " · " +
                eventState.startDate.slice(12)}
              <h3 className="dec-ti">{eventState.name}</h3>
            </div>
            {eventState.Venue && (
              <span>
                {eventState.Venue.city}, {eventState.Venue.state}
              </span>
            )}
            {!eventState.Venue && <span>Online</span>}
          </div>
        </div>
        <p className="dec-cd">{eventState.description}</p>
      </div>
    </>
  );
};

export default EventCard;
