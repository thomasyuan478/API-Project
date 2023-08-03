import "./EventDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, use } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { getEventDetail } from "../../store/event";

import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEventThunk } from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import EditGroupModal from "../EditGroupModal";
import { getGroupDetail, getGroups } from "../../store/groups";

const EventDetail = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state.events);
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  // const event = useSelector((state) => state.events.SingleEvent);
  // const images = useSelector((state) => state.events.SingleEvent.EventImages);

  useEffect(() => {
    dispatch(getEventDetail(eventId));
  }, [dispatch]);

  // console.log("Events page", state);

  if (!state.singleEvent) return null;
  if (!user) return null;

  const event = state.singleEvent;
  const images = event.EventImages;

  // console.log(groups);
  // console.log("THE THING", groups[event.Group.id]);

  const displayImg =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

  console.log("states", event);
  // console.log("Test Case", user.id, event.Group.organizerId);

  const deleteButton = (e) => {
    e.preventDefault();

    try {
      dispatch(deleteEventThunk(eventId)).then(history.push("/events"));
    } catch (errors) {
      throw new Error("Dispatch Error");
    }
  };

  const redirectButton = (e) => {
    console.log("BUTTON HAS FIRED");
    history.push(`/groups/${event.Group.id}`);
  };

  return (
    <>
      <div className="Group-page-container">
        <span>
          {"< "}
          <NavLink to="/events">Events</NavLink>
        </span>
        <h1>{event.name}</h1>
        <p>Hosted by FirstName LastName</p>
        <div className="header-container">
          <img
            className="header-image"
            src={images && images[0].url}
            // src={displayImg}
          ></img>
          <div className="header-content-container">
            <div className="header-content">
              {event.Group && (
                <div onClick={redirectButton}>
                  <p>{event.Group.name}</p>
                  <p>{event.Group.private === true ? "Private" : "Public"}</p>
                </div>
              )}
              {/* {event.Group && <p>{event.Group.name}</p>}
              {event.Group && (
                <p>{event.Group.private === true ? "Private" : "Public"}</p>
              )} */}
              {/* {user && group.Organizer.id === user.id && (
                <button onClick={deleteButton}> Delete Group</button>
              )} */}
              {/* {user && group.Organizer.id === user.id && (
                <OpenModalButton
                  buttonText="Edit Group"
                  modalComponent={
                    <EditGroupModal group={group} groupId={groupId} />
                  }
                />
              )} */}
            </div>
            {event.Group && user.id === event.Group.organizerId && (
              <button onClick={deleteButton}>Delete Event</button>
            )}
            <div className="e-det">
              <div>
                <p>Start: {event.startDate + " AM"}</p>
                <p>End: {event.endDate + " AM"}</p>
              </div>
              <p>{"$" + event.price + " Admission"}</p>
              <p>{event.type}</p>
            </div>
          </div>
        </div>
        <div className="gd-body">
          <div className="gd-description">
            <h3 className="gd-about">Details</h3>
            <p className="gd-about-info">{event.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
