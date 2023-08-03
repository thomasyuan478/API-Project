import "./EventsPage.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import EventCard from "../EventCard";
import { getEvents } from "../../store/event";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EventPage = () => {
  const dispatch = useDispatch();
  const eventsList = useSelector((state) => state.events);
  const history = useHistory();

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  console.log("Console Log on GroupsList", eventsList.Events);
  console.log(Object.keys(eventsList.Events));

  const keys = Object.keys(eventsList.Events);
  const events = eventsList.Events;

  const redirect = (e) => {
    history.push("/groups");
  };

  return (
    <>
      <div className="headers-container">
        <div className="headers">
          <h2 className="headers-title active-page">Events</h2>
          <h2 onClick={redirect} className="headers-title inactive">
            Groups
          </h2>
        </div>
        <p className="headers-content">Events in MeetUp</p>
      </div>
      <div className="slide-container">
        {keys.map((key) => (
          <EventCard key={events[key].id} obj={events[key]} />
        ))}
      </div>
    </>
  );
};

export default EventPage;
