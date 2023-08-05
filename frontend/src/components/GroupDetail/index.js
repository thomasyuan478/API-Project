import { useParams } from "react-router-dom";
import { useDispatch, use } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroupDetail, loadAssociatedEvents } from "../../store/groups";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetail.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteGroupThunk } from "../../store/groups";
import ConfirmationModal from "../ConfirmationModal";
import OpenModalButton from "../OpenModalButton";
import EditGroupModal from "../EditGroupModal";
import DisplayEventCard from "../DisplayEventCard";

const GroupDetail = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.groups);
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  // const images = useSelector((state) => state.groups.singleGroup.GroupImages);
  const history = useHistory();

  useEffect(() => {
    dispatch(getGroupDetail(groupId));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(loadAssociatedEvents(groupId));
  // }, [dispatch]);
  // console.log("state", state.singleGroup);
  // console.log("groupId from GroupDetail", groupId);

  // const group = state.singleGroup;
  const images = group.GroupImages;

  const associatedEvents = useSelector(
    (state) => state.groups.singleGroup.associatedEvents
  );

  // let test = Object.values(eventsList.Events);
  // test.sort((a, b) => {
  //   let da = new Date(a.startDate);
  //   let db = new Date(b.startDate);
  //   return da - db;
  // });

  // test.reverse();

  // const finalSort = [];
  // test.forEach((event) => {
  //   const date = new Date();
  //   const checkdate = new Date(event.startDate);
  //   if (checkdate < date) finalSort.push(event);
  //   else finalSort.unshift(event);
  // });

  let events;
  if (associatedEvents) events = Object.keys(associatedEvents);
  let futureEvents = [];
  let pastEvents = [];
  if (associatedEvents) {
    const test = Object.values(associatedEvents);
    test.sort((a, b) => {
      let da = new Date(a.startDate);
      let db = new Date(b.startDate);
      return da - db;
    });

    test.reverse();

    test.forEach((event) => {
      const date = new Date();
      const checkdate = new Date(event.startDate);
      if (checkdate < date) pastEvents.push(event);
      else futureEvents.unshift(event);
    });
  }

  // let events;
  // let futureEvents = [];
  // let pastEvents = [];
  // if (associatedEvents) {
  //   events = Object.keys(associatedEvents);
  //   events.map((event) => {
  //     const currentDate = new Date();
  //     const eventDate = new Date(associatedEvents[event].startDate);
  //     if (eventDate > currentDate) futureEvents.push(event);
  //     if (eventDate < currentDate) pastEvents.push(associatedEvents[event]);
  //   });
  // }

  const deleteButton = (e) => {
    e.preventDefault();

    try {
      dispatch(deleteGroupThunk(groupId)).then(history.push("/groups"));
    } catch (errors) {
      throw new Error("Dispatch Error");
    }
  };

  if (!group.Organizer) return null;

  return (
    <div className="Group-page-container">
      <span>
        {"< "}
        <NavLink to="/groups">Groups</NavLink>
      </span>
      <div className="gd-header-container">
        <img
          className="header-image"
          src={images && images[0].url}
          // src={displayImg}
        ></img>
        <div className="header-content-container">
          <div className="header-content">
            <h1>{group.name}</h1>
            <p className="gd-d">
              {group.city}, {group.state}
            </p>
            <p className="gd-d">
              {" "}
              {events.length} Events · {group.private ? "Private" : "Public"}
            </p>
            <p className="gd-d">
              Organized by {group.Organizer.firstName}{" "}
              {group.Organizer.lastName}
            </p>
          </div>
          {user && group.Organizer.id !== user.id && (
            <button
              onClick={(e) => {
                alert("Feature Coming Soon");
              }}
              className="group-button"
            >
              Join This Group
            </button>
          )}
          {user && group.Organizer.id === user.id && (
            <div className="gd-fc">
              <button
                className="gd-f"
                onClick={(e) => history.push(`/groups/${groupId}/events/new`)}
              >
                Create Event
              </button>
              <OpenModalButton
                buttonText="Edit Group"
                modalComponent={
                  <EditGroupModal group={group} groupId={groupId} />
                }
              />
              <OpenModalButton
                buttonText="Delete Group"
                modalComponent={<ConfirmationModal groupId={groupId} />}
              />
            </div>
          )}
        </div>
      </div>
      <div className="gd-bgc">
        <div className="gd-body">
          <div className="gd-description">
            <h2 className="gd-organizer">Organizer</h2>
            <p className="gd-info">
              {group.Organizer.firstName} {group.Organizer.lastName}
            </p>
            <h3 className="gd-about">What We're About</h3>
            <p className="gd-about-info">{group.about}</p>
          </div>
          {futureEvents.length > 0 && (
            <div>
              <h3>Upcoming Events</h3>
              <h4>
                {futureEvents.forEach((event) => (
                  <DisplayEventCard id={associatedEvents[event.id].id} />
                ))}
              </h4>
            </div>
          )}

          {futureEvents.map((event) => (
            <DisplayEventCard id={associatedEvents[event.id].id} />
          ))}

          {/* {pastEvents.map((event) => (
          <DisplayEventCard key={event.id} id={event.id} />
        ))} */}

          {pastEvents.length > 0 && (
            <div>
              <h3>Past Events</h3>
              <h4>
                {pastEvents.map((event) => (
                  <DisplayEventCard key={event.id} id={event.id} />
                ))}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
