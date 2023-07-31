import './LandPage.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function LandingPage({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='base'>
      <div className="banner">
        <div className='banner-text'>
          <h1 className="title">The people platform- Where interests become friendships</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla, turpis vitae suscipit luctus, mi eros sollicitudin magna, in luctus dui enim interdum purus. Maecenas metus lacus, egestas ut pellentesque in, vulputate sit amet leo. Integer metus enim, posuere sed malesuada id, semper id nisl. Suspendisse potenti. Vivamus ut justo eros. Fusce euismod libero a quam vulputate vulputate et sollicitudin tellus.</p>
        </div>
        <img className="mainimg" src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640'/>
      </div>
      <div className='description-container'>
        <h2 className="description-title">How Meetup Works</h2>
        <p className="description-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla, turpis vitae suscipit luctus, mi eros sollicitudin magna, in luctus dui enim interdum purus</p>
      </div>
      <div className='card-container'>
        <span className='cards'>
          <img className='highlightimg' src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256'></img>
          <NavLink className='card-link' to='/groups'>See all Groups</NavLink>
          <p className='card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </span>
        <span className='cards'>
          <img className='highlightimg' src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256'></img>
          <NavLink className='card-link' to='/events'>Find an Event</NavLink>
          <p className='card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </span>
        <span className='cards'>
          <img className='highlightimg' src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256'></img>
          <NavLink className='card-link' to='/'>Home</NavLink>
          <p className='card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </span>
      </div>
      <div className='button-container'>
        <button className='join-button'>Join Meetup</button>
      </div>
    </div>
  );
}

export default LandingPage;
