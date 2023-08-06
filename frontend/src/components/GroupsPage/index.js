import "./GroupsPage.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupCard from "../GroupCard";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GroupPage = () => {
  const dispatch = useDispatch();
  const groupList = useSelector((state) => state.groups);
  const history = useHistory();

  // useEffect(() => {
  //   dispatch(getGroups());
  // }, [dispatch]);
  // console.log(groupList);
  if (Object.keys(groupList.allGroups).length < 1) dispatch(getGroups());

  // console.log("Console Log on GroupsList", groupList.allGroups);
  // console.log(Object.keys(groupList.allGroups));

  const keys = Object.keys(groupList.allGroups);
  const groups = groupList.allGroups;

  const redirect = (e) => {
    history.push("/events");
  };

  return (
    <>
      <div className="headers-container">
        <div className="headers">
          <h2 onClick={redirect} className="headers-title inactive">
            Events
          </h2>
          <h2 className="headers-title active-page">Groups</h2>
        </div>
        <p className="headers-content">Groups in MeetUp</p>
      </div>
      <div className="slide-container">
        {keys.map((key) => (
          <GroupCard
            key={groups[key].id}
            id={groups[key].id}
            obj={groups[key]}
          />
        ))}
      </div>
    </>
  );
};

export default GroupPage;
