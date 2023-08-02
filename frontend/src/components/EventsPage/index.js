import "./EventsPage.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import EventCard from "../GroupCard";
import { getEvents } from "../../store/event";

const EventPage = () => {
  const dispatch = useDispatch();
  const eventsList = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  console.log("Console Log on GroupsList", eventsList.Events);
  console.log(Object.keys(eventsList.Events));

  const keys = Object.keys(eventsList.Events);
  const events = eventsList.Events;

  return (
    <>
      <div className="headers-container">
        <div className="headers">
          <h2 className="headers-title">Events</h2>
          <h2 className="headers-title">Groups</h2>
        </div>
        <p className="headers-content">Groups in MeetUp</p>
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
