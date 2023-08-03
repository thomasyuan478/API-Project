import { csrfFetch } from "./csrf";

//types
const CREATE_EVENT = "POST /api/events";
const GET_EVENTS = "GET /api/events";
const EVENT_DETAIL = "GET /api/event/:eventId";
const DELETE_EVENT = "DELETE /api/event/:eventId";

//Action Creator
export function loadEvents(events) {
  return {
    type: GET_EVENTS,
    events,
  };
}

export function createEvent(event) {
  return {
    type: CREATE_EVENT,
    event,
  };
}

export function EventDetail(event) {
  return {
    type: EVENT_DETAIL,
    event,
  };
}

export function deleteEvent(eventId) {
  return {
    type: DELETE_EVENT,
    eventId,
  };
}

//thunks
export const getEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");
  const events = await response.json();
  dispatch(loadEvents(events));
  return response;
};

export const getEventDetail = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  const event = await response.json();
  dispatch(EventDetail(event));
  return response;
};

export const postEvent = (event, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  const createdEvent = await response.json();
  dispatch(createEvent(createdEvent));
  return response;
};

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  dispatch(deleteEvent(eventId));
  return response;
};

const initialState = { Events: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS: {
      const eventsArray = action.events.Events;
      let newState = { ...state };
      eventsArray.forEach((event) => (newState.Events[event.id] = event));
      return newState;
    }
    case EVENT_DETAIL: {
      let newState = { ...state, singleEvent: {} };
      newState.singleEvent = action.event;
      return newState;
    }
    case CREATE_EVENT: {
      const newState = { ...state };
      newState.singleEvent = action.group;
      return newState;
    }
    case DELETE_EVENT: {
      const newState = { ...state, singleEvent: {} };
      newState.Events[action.eventId] = {};
      newState.singleEvent = {};
      return newState;
    }
    default:
      return state;
  }
};

export default eventsReducer;
