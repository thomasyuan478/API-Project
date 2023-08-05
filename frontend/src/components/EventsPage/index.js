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

  // console.log("Console Log on EventsPage", eventsList.Events);
  // console.log(Object.keys(eventsList.Events));

  const keys = Object.keys(eventsList.Events);
  const events = eventsList.Events;
  let test = Object.values(eventsList.Events);
  test.sort((a, b) => {
    let da = new Date(a.startDate);
    let db = new Date(b.startDate);
    return da - db;
  });

  test.reverse();

  const finalSort = [];
  test.forEach((event) => {
    const date = new Date();
    const checkdate = new Date(event.startDate);
    if (checkdate < date) finalSort.push(event);
    else finalSort.unshift(event);
  });

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
        {finalSort.map((event) => (
          <EventCard
            key={events[event.id].id}
            id={events[event.id].id}
            obj={events[event.id]}
          />
        ))}
      </div>
    </>
  );
};

export default EventPage;
