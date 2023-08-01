import './GroupCard.css'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../store/groups';
import { Navigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const GroupCard = ({ obj }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onClick = () => {
    history.push(`/groups/${obj.id}`);
  }

  return(
    <>
      <div  className='slide'>
        <img className='slide-img' src={obj.previewImage}></img>
        <div onClick={onClick}>
          <h3>{obj.name}</h3>
          <span>{Location}</span>
          <p>{obj.about}</p>
          <div>{obj.numEvents} Events * {obj.private ? "Private" : "Public"}</div>
        </div>
      </div>
    </>
  )
}

export default GroupCard;
