import { useEffect, useState } from "react";
import "./NewGroupForm.css";
import { postGroup } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const NewGroupForm = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const errors = {};
    if (!name) errors["name"] = "Name is required";
    if (!city) errors["city"] = "City is required";
    if (!state) errors["state"] = "State is required";
    if (about.length < 50)
      errors["about"] = "Description must be at least 50 characters long";
    if (!type) errors["type"] = "Group Type is required";
    if (!isPrivate) errors["isPrivate"] = "Visibility Type is required";
    if (
      !(url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
    )
      errors["url"] = "Image URL must end in .png, .jpg, or .jpeg";
    setValidationErrors(errors);
  }, [name, city, state, about, type, isPrivate, url]);

  const onSubmit = (e) => {
    // Prevent the default form behavior so the page doesn't reload.
    e.preventDefault();

    // setHasSubmitted(true);
    // if (Object.values(validationErrors).length)
    //   return alert(`The following errors were found:

    //     ${validationErrors.name ? "* " + validationErrors.name : ""}
    //     ${validationErrors.email ? "* " + validationErrors.email : ""}`);
    const privateBoolean = isPrivate === "Private" ? true : false;
    console.log(Object.keys(validationErrors).length > 1);

    // Create a new object for the contact us information.
    const createGroupRequest = {
      name,
      city,
      state,
      about,
      url,
      type,
      private: privateBoolean,
    };

    //post thunk
    dispatch(postGroup(createGroupRequest));

    setCity("");
    setState("");
    setName("");
    setAbout("");
    setUrl("");
    setType("");
    setIsPrivate("");
    // Ideally, we'd persist this information to a database using a RESTful API.
    // For now, though, just log the contact us information to the console.
    history.push("/groups");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="el-container">
          <h2>Become an Organizer</h2>
          <h4>
            We'll walk you through a few steps to build your local community
          </h4>
        </div>
        <div className="el-container">
          <h4>First, Set your group's location</h4>
          <p>
            Meetup groups meet locally, in person and online. We'll connect you
            with people in your area, and more can join you online
          </p>
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
          <div className="el-container">
            <h4>What will your group's name be?</h4>
            <p>
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </p>
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
          </div>
          <div className="el-container">
            <h4>Now describe what your group will be about</h4>
            <p>
              People will this when we promote your group, but you'll be able to
              add to it later, too.
            </p>
            <ol>
              <li>What's the purpose of this group?</li>
              <li>who should join?</li>
              <li>what will you do at your events?</li>
            </ol>
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
          </div>
          <div className="el-container">
            <h4>Final Steps...</h4>
            <div>
              <p>is this an in person or an online group?</p>
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

            <label htmlFor="url">
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
            </div>
          </div>
        </div>
        <button
          disabled={Object.values(validationErrors).length > 1}
          className="createGroup"
        >
          Create Group
        </button>
      </form>
    </>
  );
};

export default NewGroupForm;
