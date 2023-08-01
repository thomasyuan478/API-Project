import { useParams } from "react-router-dom";
import { useDispatch, use } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroupDetail } from "../../store/groups";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import './GroupDetail.css'


const GroupDetail = () => {
const {groupId} = useParams();
const dispatch = useDispatch();
const state = useSelector(state => state.groups)

  useEffect(() => {
    dispatch(getGroupDetail(groupId));
  },[dispatch]);

  console.log("state", state.singleGroup);

  const group = state.singleGroup;

  return (
    <div className="Group-page-container">
      <span>{"< "}<NavLink to='/groups'>Groups</NavLink></span>
      <div className="header-container">
        <img className='header-image' src='https://cdn2.thecatapi.com/images/MTgzMjc5Mw.jpg'></img>
        <div className="header-content-container">
          <div className="header-content">
            <h1>{group.name}</h1>
            <p>{group.city}, {group.state}</p>
            <p>## events * {group.private ? "Private" : "Public"}</p>
            <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
          </div>
            <button className="group-button">Join This Group</button>
        </div>
      </div>
    <div className="gd-body">
      <div className="gd-description">
        <h2 className="gd-organizer">Organizer</h2>
        <p className="gd-info">{group.Organizer.firstName} {group.Organizer.lastName}</p>
        <h3 className="gd-about">What We're About</h3>
        <p className="gd-about-info">{group.about}</p>
        </div>
      <div>
        <h3>
        Upcoming Events
        </h3>
        <h4>{'<Event Cards>'}</h4>
        <h4>{'<Event Cards>'}</h4>
        <h4>{'<Event Cards>'}</h4>
      </div>
      <div>
        <h3>
        Past Events
        </h3>
        <h4>{'<Event Cards>'}</h4>
        <h4>{'<Event Cards>'}</h4>
        <h4>{'<Event Cards>'}</h4>
      </div>
    </div>
  </div>
  )
}

export default GroupDetail;
