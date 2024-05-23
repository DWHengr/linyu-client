import * as type from "./type";


let defaultState = {
    currentOption: null,
};

export const homeData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentOption:
            return {
                ...state,
                ...{currentOption: action.currentOption},
            };
        default:
            return state;
    }
};
