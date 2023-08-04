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

  // useEffect(() => {
  //   const errors = {};
  //   if (!name) errors["name"] = "Name is required";
  //   if (!city) errors["city"] = "City is required";
  //   if (!state) errors["state"] = "State is required";
  //   if (about.length < 50)
  //     errors["about"] = "Description must be at least 50 characters long";
  //   if (!type) errors["type"] = "Group Type is required";
  //   if (!isPrivate) errors["isPrivate"] = "Visibility Type is required";
  //   if (
  //     !(url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
  //   )
  //     errors["url"] = "Image URL must end in .png, .jpg, or .jpeg";
  //   setValidationErrors(errors);
  // }, [name, city, state, about, type, isPrivate, url]);

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
    dispatch(postGroup(createGroupRequest))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors);
        }
      })
      .then((res) => {
        if (res) history.push(`/groups/${res.id}`);
      });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="gf-container">
          <div className="el-container">
            <p className="gf-flair">BECOME AN ORGANIZER</p>
            <h2>
              We'll walk you through a few steps to build your local community
            </h2>
          </div>
          <div className="el-container">
            <h3>First, Set your group's location</h3>
            <p>
              Meetup groups meet locally, in person and online. We'll connect
              you with people in your area, and more can join you online
            </p>
            {/* <label htmlFor="city">City:</label> */}
            <div>
              <input
                placeholder="City"
                id="city"
                type="text"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                required
              />
              {validationErrors.city && (
                <p className="errors">{validationErrors.city}</p>
              )}
            </div>
            {/* <label htmlFor="state">State:</label> */}
            <div>
              <input
                placeholder="State"
                id="state"
                type="text"
                onChange={(e) => setState(e.target.value)}
                value={state}
                required
              />
              {validationErrors.state && (
                <p className="errors">{validationErrors.state}</p>
              )}
            </div>
            <div className="el-container">
              <h3>What will your group's name be?</h3>
              <p>
                Choose a name that will give people a clear idea of what the
                group is about. Feel free to get creative! You can edit this
                later if you change your mind.
              </p>
              {/* <label htmlFor="name">Name:</label> */}
              <div>
                <input
                  placeholder="What is your group name?"
                  id="name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
                {validationErrors.name && (
                  <p className="errors">{validationErrors.name}</p>
                )}
              </div>
            </div>
            <div className="el-container">
              <h3>Now describe what your group will be about</h3>
              <p>
                People will this when we promote your group, but you'll be able
                to add to it later, too.
              </p>
              <ol>
                <li>What's the purpose of this group?</li>
                <li>who should join?</li>
                <li>what will you do at your events?</li>
              </ol>
              {/* <label htmlFor="about">About:</label> */}
              <div>
                <textarea
                  placeholder="Please write atleast 50 characters"
                  id="about"
                  type="text"
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  required
                />
                {validationErrors.about && (
                  <p className="errors">
                    {validationErrors.about}, Current Characters: {about.length}
                  </p>
                )}
              </div>
            </div>
            <div className="el-container">
              <h3>Final Steps...</h3>
              <div>
                <p>is this an in person or an online group?</p>
                <select
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  required
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
                  required
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

              <div className="gf-i-container">
                <label htmlFor="url">
                  Please add in an image url for your group below:
                </label>
                <div>
                  <input
                    placeholder="Image URL"
                    id="url"
                    type="url"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    required
                  />
                  {validationErrors.url && (
                    <p className="errors">{validationErrors.url}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            // disabled={Object.values(validationErrors).length > 1}
            className="createGroup"
          >
            Create Group
          </button>
        </div>
      </form>
    </>
  );
};

export default NewGroupForm;
