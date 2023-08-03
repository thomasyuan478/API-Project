import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./EditGroupModal.css";
import { getGroupDetail, updateGroupThunk } from "../../store/groups";

function EditGroupModal({ groupId, group }) {
  const [city, setCity] = useState(group.city);
  const [state, setState] = useState(group.state);
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about);
  const [url, setUrl] = useState("");
  const [type, setType] = useState(group.type);
  const [isPrivate, setIsPrivate] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isPrivate);
    const privateBoolean = isPrivate == "Private" ? true : false;
    console.log(privateBoolean);

    const updateGroup = {
      city,
      state,
      name,
      about,
      type,
      private: privateBoolean,
      url,
    };

    dispatch(updateGroupThunk(updateGroup, groupId))
      .then(closeModal)
      .then(dispatch(getGroupDetail(groupId)))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Edit Group</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <div>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {validationErrors.name && (
            <p className="errors">{validationErrors.name}</p>
          )}
        </div>
        <label htmlFor="city">City:</label>
        <div>
          <input
            placeholder="please enter a city"
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
          {validationErrors.city && (
            <p className="errors">{validationErrors.city}</p>
          )}
        </div>
        <label htmlFor="state">State:</label>
        <div>
          <input
            id="state"
            type="text"
            onChange={(e) => setState(e.target.value)}
            value={state}
          />
          {validationErrors.state && (
            <p className="errors">{validationErrors.state}</p>
          )}
        </div>

        <label htmlFor="about">About:</label>
        <div>
          <textarea
            id="about"
            type="text"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
          {validationErrors.about && (
            <p className="errors">{validationErrors.about}</p>
          )}
        </div>
        <div>
          <p>Is this group private or public?</p>
          <select
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="" disabled>
              (select one)
            </option>
            <option>Online</option>
            <option>In person</option>
          </select>
          {validationErrors.type && (
            <p className="errors">{validationErrors.type}</p>
          )}
        </div>

        <div>
          <p>Is this group private or public?</p>
          <select
            name="isPrivate"
            onChange={(e) => setIsPrivate(e.target.value)}
            value={isPrivate}
          >
            <option value="" disabled>
              (select one)
            </option>
            <option>Private</option>
            <option>Public</option>
          </select>
          {validationErrors.isPrivate && (
            <p className="errors">{validationErrors.isPrivate}</p>
          )}
        </div>
        {/* <label htmlFor="url">
          Please add in an image url for your group below:
        </label>
        <div>
          <input
            id="url"
            type="url"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          {validationErrors.url && (
            <p className="errors">{validationErrors.url}</p>
          )}
        </div> */}

        {errors.credential && <p>{errors.credential}</p>}
        <button
          disabled={Object.values(validationErrors).length > 1}
          className="createGroup"
        >
          Update Group
        </button>
      </form>
    </>
  );
}

export default EditGroupModal;
