import { csrfFetch } from "./csrf";

//TYPES, Create, readGroups,ReadSingle, Update,Delete
const CREATE_GROUP = "POST /api/groups";
const GET_GROUPS = "GET /api/groups";
const GROUP_DETAIL = "GET /api/group/:groupId";
const UPDATE_GROUP = "PUT /api/group/:groupId";
const DELETE_GROUP = "DELETE /api/group/:groupId";

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
    console.log("getGroups from thunk", groups);
  }
};

export const getGroupDetail = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(groupDetail(group));
    console.log("getGroupsDetail from thunk", group);
  }
};

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
  const createdGroup = await response.json();
  dispatch(createGroup(createdGroup));
  return createdGroup;
};

//delete thunk
export const deleteGroupThunk = (groupId) => async (dispatch) => {
  console.log("Hello from inside the thunk", groupId);
  console.log(typeof groupId);
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteGroup(groupId));
  }
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
      const newState = { ...state };
      newState.allGroups[action.groupId] = {};
      newState.singleGroup = {};
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReducer;
