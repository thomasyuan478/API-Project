import { useModal } from "../../context/Modal";
import { deleteGroupThunk } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEventThunk } from "../../store/event";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ groupId, eventId, event }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const deleteGroup = (e) => {
    dispatch(deleteGroupThunk(groupId))
      .then(closeModal())
      .then((res) => {
        if (res) history.push("/groups");
      });
  };

  const deleteEvent = (e) => {
    dispatch(deleteEventThunk(event.id))
      .then(closeModal())
      .then((res) => {
        if (res) history.push(`/groups/${event.Group.id}`);
      });
  };

  const cancel = (e) => {
    closeModal();
  };

  return (
    <>
      {groupId && (
        <>
          <h1 className="cm-ti">Confirm Delete</h1>
          <p className="cm-te">Are you sure you want to remove this group?</p>
          <div className="cm-c">
            <button className="cm-b yes" onClick={deleteGroup}>
              Yes (Delete Group)
            </button>
            <button className="cm-b no" onClick={cancel}>
              No (Keep Group)
            </button>
          </div>
        </>
      )}
      {eventId && (
        <>
          <h1 className="cm-ti">Confirm Delete</h1>
          <p className="cm-te">Are you sure you want to remove this event?</p>
          <div className="cm-c">
            <button className="cm-b yes" onClick={deleteEvent}>
              Yes (Delete Event)
            </button>
            <button className="cm-b no" onClick={cancel}>
              No (Keep Event)
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmationModal;
