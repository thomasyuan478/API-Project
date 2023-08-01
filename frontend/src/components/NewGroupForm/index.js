import { useEffect, useState } from "react";
import './NewGroupForm.css'

const NewGroupForm = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [isPrivate, setIsPrivate] = useState('');

  return (
  <>
    <form>
      <div className="el-container">
      <h2>Become an Organizer</h2>
      <h4>We'll walk you through a few steps to build your local community</h4>
      </div>
      <div className="el-container">
        <h4>First, Set your group's location</h4>
        <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online</p>
        <label htmlFor='city'>City:</label>
        <div>
          <input
            id='city'
            type='text'
            onChange={e => setCity(e.target.value)}
            value={city}
          />
          </div>
          <label htmlFor='state'>State:</label>
          <div>
          <input
            id='state'
            type='text'
            onChange={e => setState(e.target.value)}
            value={state}
          />
          </div>
          <div className="el-container">
            <h4>What will your group's name be?</h4>
            <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <label htmlFor='name'>Name:</label>
            <div>
              <input
              id='name'
              type='text'
              onChange={e => setName(e.target.value)}
              value={name}
              />
            </div>
          </div>
          <div className="el-container">
            <h4>Now descibe what your group will be about</h4>
            <p>People will this when we promote your group, but you'll be able to add to it later, too.</p>
            <ol>
              <li>What's the purpose of this group?</li>
              <li>who should join?</li>
              <li>what will you do at your events?</li>
            </ol>
            <label htmlFor='about'>About:</label>
            <div>
              <input
              id='about'
              type='text'
              onChange={e => setAbout(e.target.value)}
              value={about}
              />
            </div>
          </div>
          <div className="el-container">
            <h4>Final Steps...</h4>
            <div>
              <p>is this an in person or an online group?</p>
            <select
              name='type'
              onChange={e => setType(e.target.value)}
              value={type}
              >
              <option value='' disabled>
                (select one)
              </option>
                <option>Online</option>
                <option>In person</option>
            </select>
              </div>
              <div>
              <p>Is this group private or public?</p>
            <select
              name='isPrivate'
              onChange={e => setIsPrivate(e.target.value)}
              value={isPrivate}
              >
              <option value='' disabled>
                (select one)
              </option>
                <option>Private</option>
                <option>Public</option>
            </select>
            <break></break>
              </div>
            <label htmlFor='url'>Please add in an image url for your group below:</label>
            <div>
              <input
              id='url'
              type='text'
              onChange={e => setUrl(e.target.value)}
              value={url}
              />
            </div>
          </div>
      </div>
    </form>
  </>
  )
}

export default NewGroupForm;
