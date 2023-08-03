import { useParams } from "react-router-dom";
import { useDispatch, use } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroupDetail } from "../../store/groups";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetail.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteGroupThunk } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import EditGroupModal from "../EditGroupModal";

const GroupDetail = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.groups);
  const user = useSelector((state) => state.session.user);
  const history = useHistory();

  useEffect(() => {
    dispatch(getGroupDetail(groupId));
  }, [dispatch]);

  // console.log("state", state.singleGroup);
  // console.log("groupId from GroupDetail", groupId);

  const group = state.singleGroup;
  const images = group.GroupImages;

  const defaultImg =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

  // console.log("images object", images);

  const deleteButton = (e) => {
    e.preventDefault();

    console.log("Hello from delete button");

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
      <div className="header-container">
        <img
          className="header-image"
          src={images && images[0].url}
          // src={displayImg}
        ></img>
        <div className="header-content-container">
          <div className="header-content">
            <h1>{group.name}</h1>
            <p>
              {group.city}, {group.state}
            </p>
            <p>## events * {group.private ? "Private" : "Public"}</p>
            <p>
              Organized by {group.Organizer.firstName}{" "}
              {group.Organizer.lastName}
            </p>
            {user && group.Organizer.id === user.id && (
              <button onClick={deleteButton}> Delete Group</button>
            )}
            {user && group.Organizer.id === user.id && (
              <OpenModalButton
                buttonText="Edit Group"
                modalComponent={
                  <EditGroupModal group={group} groupId={groupId} />
                }
              />
            )}
            {user && group.Organizer.id === user.id && (
              <button
                onClick={(e) => history.push(`/groups/${groupId}/events/new`)}
              >
                Create Event
              </button>
            )}
          </div>
          {user && group.Organizer.id !== user.id && (
            <button className="group-button">Join This Group</button>
          )}
        </div>
      </div>
      <div className="gd-body">
        <div className="gd-description">
          <h2 className="gd-organizer">Organizer</h2>
          <p className="gd-info">
            {group.Organizer.firstName} {group.Organizer.lastName}
          </p>
          <h3 className="gd-about">What We're About</h3>
          <p className="gd-about-info">{group.about}</p>
        </div>
        <div>
          <h3>Upcoming Events</h3>
          <h4>{"<Event Cards>"}</h4>
          <h4>{"<Event Cards>"}</h4>
          <h4>{"<Event Cards>"}</h4>
        </div>
        <div>
          <h3>Past Events</h3>
          <h4>{"<Event Cards>"}</h4>
          <h4>{"<Event Cards>"}</h4>
          <h4>{"<Event Cards>"}</h4>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
