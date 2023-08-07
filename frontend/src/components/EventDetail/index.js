import "./EventDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, use } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ConfirmationModal from "../ConfirmationModal";
import { getEventDetail } from "../../store/event";
import OpenModalButton from "../OpenModalButton";

import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEventThunk } from "../../store/event";
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
  const event = state.singleEvent;
  const images = event.EventImages;

  let gImages;
  if (event.Group) gImages = event.Group.GroupImages;

  let cost;
  if (event.price === 0) cost = "Free";
  else cost = "$" + event.price + " Admission";

  let check = false;
  if (user) {
    if (event.Group) {
      if (user.id === event.Group.organizerId) check = true;
    }
  }

  const redirectButton = (e) => {
    // console.log("BUTTON HAS FIRED");
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
        <p>
          Hosted by {event.Group && event.Group.firstName}{" "}
          {event.Group && event.Group.lastName}
        </p>
        <div className="ed-bgc">
          <div className="ed-header-container">
            <img
              className="ed-header-image"
              src={images && images[0].url}
              // src={displayImg}
            ></img>
            <div className="header-content-container">
              <div className="ed-header-content">
                {event.Group && (
                  <div className="ed-GCL" onClick={redirectButton}>
                    <img
                      className="ed-gimg"
                      src={gImages && gImages[0].url}
                    ></img>
                    <div>
                      <h4>{event.Group.name}</h4>
                      <p>
                        {event.Group.private === true ? "Private" : "Public"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="e-det">
                <div className="e-time">
                  <i className="far fa-clock"></i>
                  <div className="e-times">
                    <p>
                      Start:{" "}
                      {event.startDate &&
                        event.startDate.slice(0, 12) +
                          " · " +
                          event.startDate.slice(12)}
                    </p>
                    <p>
                      End:{" "}
                      {event.startDate &&
                        event.startDate.slice(0, 12) +
                          " · " +
                          event.startDate.slice(12)}
                    </p>
                  </div>
                </div>
                <div className="e-time">
                  <i class="fas fa-dollar-sign"></i>
                  <div className="e-times">
                    <p>{cost}</p>
                  </div>
                </div>
                <div className="e-time special">
                  <i class="fas fa-map-pin"></i>
                  <div className="e-times">
                    <p>{event.type}</p>
                  </div>
                  {event.Group && check && (
                    <>
                      <span className="e-bmx">
                        <button>Update Event</button>
                      </span>
                      <OpenModalButton
                        buttonText="Delete Event"
                        modalComponent={
                          <ConfirmationModal event={event} eventId={eventId} />
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="ed-description">
            <h3 className="ed-about">Description</h3>
            <p className="ed-about-info">{event.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
