import { csrfFetch } from "./csrf";

//TYPES, Create, readGroups,ReadSingle, Update,Delete
const CREATE_GROUP = "POST /api/groups";
const GET_GROUPS = "GET /api/groups";
const GROUP_DETAIL = "GET /api/group/:groupId";
const UPDATE_GROUP = "PUT /api/group/:groupId";
const DELETE_GROUP = "DELETE /api/group/:groupId";
const LOAD_EVENTS = "GET /api/groups/:groupId/events";

//Action Creator
export function loadGroups(groups) {
  return {
    type: GET_GROUPS,
    groups,
  };
}

export function groupDetail(group) {
  return {
    type: GROUP_DETAIL,
    group,
  };
}

// export function loadAssociatedEvents(associatedEvents) {
//   return {
//     type: LOAD_EVENTS,
//     associatedEvents,
//   };
// }

export function createGroup(group) {
  return {
    type: CREATE_GROUP,
    group,
  };
}

export function updateGroup(group, groupId) {
  return {
    type: UPDATE_GROUP,
    group,
    groupId,
  };
}

export function deleteGroup(groupId) {
  return {
    type: DELETE_GROUP,
    groupId,
  };
}

//thunk action creator
export const getGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

  if (response.ok) {
    const groups = await response.json();
    dispatch(loadGroups(groups));
    // console.log("getGroups from thunk", groups);
  }
};

export const getGroupDetail = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const response2 = await fetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const group = await response.json();
    const associatedEvents = await response2.json();
    const events = associatedEvents.Events;
    group.associatedEvents = {};
    events.forEach((event) => (group.associatedEvents[event.id] = event));
    // events.forEach((event) => (group.associatedEvents[event.id] = event));
    // group.associatedEvents = associatedEvents.Events;
    dispatch(groupDetail(group));
    // console.log("getGroupsDetail from thunk", group, associatedEvents);
  }
};

//get associated events thunk
// export const getAssociatedEvents = (groupId) => async (dispatch) => {
//   const response = await fetch(`/api/groups/${groupId}/events`);
//   const associatedEvents = await response.json();
//   console.log("From Associated Events", associatedEvents);
//   dispatch(loadAssociatedEvents(associatedEvents));
//   return response;
// };

//update thunk
export const updateGroupThunk = (group, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const resGroup = await response.json();
    dispatch(updateGroup(resGroup, groupId));
    return response;
  }
};

//post thunk
export const postGroup = (group) => async (dispatch) => {
  const response = await csrfFetch("/api/groups/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const createdGroup = await response.json();
    dispatch(createGroup(createdGroup));
    // console.log("Inside the post thuink", createdGroup);
    return createdGroup;
  } else return response;
};

//delete thunk
export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  dispatch(deleteGroup(groupId));
  return response;
};

const initialState = {
  allGroups: {},
  singleGroup: {},
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      const groupArray = action.groups.Groups;
      let newState = { ...state };
      groupArray.forEach((group) => (newState.allGroups[group.id] = group));
      return newState;
    }
    case GROUP_DETAIL: {
      let newState = { ...state, singleGroup: {} };
      newState.singleGroup = action.group;
      return newState;
    }
    case LOAD_EVENTS: {
      let newState = { ...state };
      newState.singleGroup.associatedEvents = action.payload;
      return newState;
    }
    case CREATE_GROUP: {
      const newState = { ...state };
      newState.singleGroup = action.group;
      return newState;
    }
    case UPDATE_GROUP: {
      const newState = { ...state, singleGroup: {} };
      // newState.allGroups[action.groupId] = action.group;
      newState.singleGroup = action.group;
      return newState;
    }
    case DELETE_GROUP: {
      const newState = { ...state, singleGroup: {} };
      newState.allGroups[action.groupId] = {};
      newState.singleGroup = {};
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReducer;
