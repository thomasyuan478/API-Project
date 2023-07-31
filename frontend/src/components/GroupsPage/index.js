import './GroupsPage.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../store/groups';
import GroupCard from '../GroupCard';

const GroupPage = () => {
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.groups)

  useEffect(() => {
    dispatch(getGroups());
  },[dispatch]);

  console.log("Console Log on GroupsList", groupList.allGroups)
  console.log(Object.keys(groupList.allGroups))

  return(
    <>
    <div className='headers-container'>
      <div className='headers'>
        <h2 className='headers-title'>Events</h2>
        <h2 className='headers-title'>Groups</h2>
      </div>
      <p className='headers-content'>Groups in MeetUp</p>
    </div>
    <GroupCard />
    </>
  )
}

export default GroupPage;