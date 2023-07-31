
const GET_GROUPS = '/api/groups'

//Action Creator
export function loadGroups(groups){
  return {
    type: GET_GROUPS,
    groups
  }
}

//thunk action creator
export const getGroups = () => async dispatch => {
  const response = await fetch('/api/groups');

  if(response.ok){
    const groups = await response.json();
    dispatch(loadGroups(groups));
    console.log("Groups from thunk ACTION CREATOR", groups);
  }
};

const initialState = {
  allGroups: {},
  singleGroup: {}
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS:{
      console.log("FROM REDUCER: ", action.groups.Groups)
      const groupArray = action.groups.Groups;
      const newState = {...state};
      groupArray.forEach(group => newState.allGroups[group.id] = group);
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReducer;
