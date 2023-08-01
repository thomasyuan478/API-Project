//TYPES, Create, readGroups,ReadSingle, Update,Delete
const CREATE_GROUP = 'POST /api/groups'
const GET_GROUPS = 'GET /api/groups'
const GROUP_DETAIL = 'GET /api/group/:groupId'
const UPDATE_GROUP = 'PUT /api/group/:groupId'
const DELETE_GROUP = 'DELETE /api/group/:groupId'

//Action Creator
export function loadGroups(groups){
  return {
    type: GET_GROUPS,
    groups
  }
}

export function groupDetail(group){
  return{
    type: GROUP_DETAIL,
    group
  }
}

export function createGroup(group){
  return {
    type: CREATE_GROUP,
    group
  }
}

export function updateGroup(group){
  return {
    type: UPDATE_GROUP,
    group
  }
}

export function deleteGroup(groupId){
  return {
    type: DELETE_GROUP,
    groupId
  }
}

//thunk action creator
export const getGroups = () => async dispatch => {
  const response = await fetch('/api/groups');

  if(response.ok){
    const groups = await response.json();
    dispatch(loadGroups(groups));
    console.log("getGroups from thunk", groups);
  }
};

export const getGroupDetail = (group) => async dispatch => {
  const response = await fetch(`./api/groups/${group.id}`)

  if(response.ok){
    const group = await response.json();
    dispatch(getGroupDetail(group));
    console.log('getGroupsDetail from thunk', group);
  }
}

const initialState = {
  allGroups: {},
  singleGroup: {}
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS:{
      const groupArray = action.groups.Groups;
      let newState = {...state};
      groupArray.forEach(group => newState.allGroups[group.id] = group);
      return newState;
    }
    case GROUP_DETAIL: {
      let newState = {...state, singleGroup: {}};
      newState.singleGroup = action.group;
      return newState
    }
    case CREATE_GROUP:{
      const newState = {...state};
      newState.singleGroup = action.group;
      return newState
    }
    case UPDATE_GROUP:{
      const newState = {...state};
      newState.singleGroup = action.group;
      return newState
    }
    case DELETE_GROUP: {
      const newState = {...state};
      newState.singleGroup = {};
      return newState
    }
    default:
      return state;
  }
};

export default groupsReducer;
