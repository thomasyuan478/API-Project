import "./NewEvent.css";
import { useState } from "react";
import { postEvent } from "../../store/event";
import { useDispatch } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getGroupDetail } from "../../store/groups";

const NewEvent = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();

  // const startDateCheck = (date) => {
  //   if (new Date(date).toString() === "Invalid Date") return true;
  //   if (new Date(date) <= new Date()) return true;
  //   else return false;
  // };

  // const endDateCheck = (startDate, endDate) => {
  //   if (new Date(endDate) <= new Date(startDate)) return true;
  //   else return false;
  // };

  const group = useSelector((state) => state.groups.singleGroup);
  console.log("Hello from Event Form", group);

  useEffect(() => {
    if (!Object.keys(group).length) dispatch(getGroupDetail(groupId));
  }, [dispatch]);

  // useEffect(() => {
  //   const errors = {};
  //   // if (!name) errors["name"] = "Name is required";
  //   if (name.length < 5) errors["name"] = "Name must be atleast 5 characters";
  //   if (!price) errors["city"] = "City is required";
  //   if (!description) errors["state"] = "State is required";
  //   if (!type) errors["type"] = "Group Type is required";
  //   if (!isPrivate) errors["isPrivate"] = "Visibility Type is required";
  //   if (!description) errors["description"] = "Description is required";
  //   if (startDateCheck(startDate))
  //     errors["startDate"] = "Start date must be in the future";
  //   if (endDateCheck(startDate, endDate))
  //     errors["endDate"] = "End date must be after Start date";
  //   // if (
  //   //   !(url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
  //   // )
  //   //   errors["url"] = "Image URL must end in .png, .jpg, or .jpeg";
  //   if (!url) errors["url"] = "Url is required";
  //   setValidationErrors(errors);
  // }, [name, price, startDate, endDate, description, type, isPrivate, url]);

  const onSubmit = (e) => {
    e.preventDefault();

    const privateBoolean = isPrivate === "Private" ? true : false;

    console.log(typeof Number(price));

    const eventDetails = {
      name,
      type,
      private: privateBoolean,
      price: Number(price),
      startDate,
      endDate,
      url,
      description,
      venueId: null,
      capacity: 100,
    };

    dispatch(postEvent(eventDetails, groupId))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors);
        }
      })
      .then((res) => {
        if (res) history.push(`/events/${res.id}`);
      });
  };

  return (
    <>
      <div className="ne-c">
        <form onSubmit={onSubmit}>
          <h1>Create an Event for {group.name}</h1>
          <div className="ef-c">
            <label htmlFor="name">What is the name of your event?</label>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Event Name"
              />
            </div>
            {validationErrors.name && (
              <p className="errors">{validationErrors.name}</p>
            )}
          </div>
          <div>
            <label>is this an in person or an online group?</label>
            <div className="ef-c2">
              <select
                className="ef-s"
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
            </div>
            {validationErrors.type && (
              <p className="errors">{validationErrors.type}</p>
            )}
          </div>
          <div>
            <label>Is this group private or public?</label>
            <div className="ef-c2">
              <select
                className="ef-s"
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
            </div>
            {validationErrors.isPrivate && (
              <p className="errors">{validationErrors.isPrivate}</p>
            )}
          </div>
          <div>
            <div className="ef-c">
              <p className="ef-t">What is the price for your event?</p>
              <label htmlFor="price">$ </label>
              <input
                className="ef-p"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0"
              />
            </div>
          </div>
          {validationErrors.price && (
            <p className="errors">{validationErrors.price}</p>
          )}
          <div>
            <label htmlFor="startDate">When does your event start?</label>
            <div>
              <input
                className="ef-d"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            {validationErrors.startDate && (
              <p className="errors">{validationErrors.startDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="endDate">When does your event end?</label>
            <div className="ef-c">
              <input
                className="ef-d"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            {validationErrors.endDate && (
              <p className="errors">{validationErrors.endDate}</p>
            )}
          </div>
          <label htmlFor="url">
            Please add in an image url for your group below:
          </label>
          <div className="ef-c">
            <input
              placeholder="Image URL"
              id="url"
              type="url"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
            {validationErrors.url && (
              <p className="errors">{validationErrors.url}</p>
            )}
          </div>
          <label htmlFor="description">Description:</label>
          <div>
            <textarea
              placeholder="Please include atleast 30 characters."
              id="description"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            {validationErrors.description && (
              <p className="errors">{validationErrors.description}</p>
            )}
          </div>
          <button type="submit" className="createGroup">
            Create Event
          </button>
        </form>
      </div>
    </>
  );
};

export default NewEvent;
