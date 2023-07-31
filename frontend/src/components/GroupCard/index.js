import './GroupCard.css'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../store/groups';

const GroupCard = (props) => {
  const dispatch = useDispatch();

  return(
    <>
      <div className='slide'>
        <img className='slide-img' src='https://cdn2.thecatapi.com/images/chi.jpg'></img>
        <div>
          <h3>Group Name</h3>
          <span>Location</span>
          <p>Lorem Ipsum and so on and so forth without generating nay Lorem ipsum</p>
          <div>## events * Public</div>
        </div>
      </div>
    </>
  )
}

export default GroupCard;
