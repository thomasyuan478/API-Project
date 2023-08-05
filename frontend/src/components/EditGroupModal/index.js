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
      <h1 className="eg-ti">Edit Group</h1>
      <form onSubmit={handleSubmit}>
        <label className="eg-i" htmlFor="name">
          Name:
        </label>
        <div>
          <input
            className="eg-i"
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {validationErrors.name && (
            <p className="errors">{validationErrors.name}</p>
          )}
        </div>
        <label className="eg-i" htmlFor="city">
          City:
        </label>
        <div>
          <input
            className="eg-i"
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
        <label className="eg-i" htmlFor="state">
          State:
        </label>
        <div>
          <input
            className="eg-i"
            id="state"
            type="text"
            onChange={(e) => setState(e.target.value)}
            value={state}
          />
          {validationErrors.state && (
            <p className="errors">{validationErrors.state}</p>
          )}
        </div>

        <label className="eg-i" htmlFor="about">
          About:
        </label>
        <div>
          <textarea
            className="eg-ta"
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
          <p className="eg-i">Is this group private or public?</p>
          <select
            className="eg-i"
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
          <p className="eg-i">Is this group private or public?</p>
          <select
            className="eg-i"
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
        {/* <label className="eg-i" htmlFor="url">
          Please add in an image url for your group below:
        </label>
        <div>
          <input
            className="eg-i"
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
        <div className="eg-bc">
          <button
            disabled={Object.values(validationErrors).length > 1}
            className="updateGroup"
          >
            Update Group
          </button>
        </div>
      </form>
    </>
  );
}

export default EditGroupModal;
