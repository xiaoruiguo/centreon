import * as actions from "../actions/externalComponentsActions";

// by default, no one external page and hook
const initialState = {
  pages: [],
  hooks: []
};

const externalComponentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_EXTERNAL_COMPONENTS_DATA:
      return {
        ...state,
        pages: action.data.pages,
        hooks: action.data.hooks
      }
    default:
      return state;
  }
};

export default externalComponentsReducer;
