import * as type from "./type";


let defaultState = {
    currentOption: "chat",
    userId: "",
    username: "",
    account: "",
    portrait: "",
    fileProgress: {}
};

export const homeData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentOption:
            return {
                ...state,
                ...{currentOption: action.currentOption},
            };
        case type.Set_User_Info:
            return {
                ...state,
                ...action,
            };
        case type.Set_File_Progress:
            state.fileProgress[action.fileName] = action.progress;
            return {
                ...state
            };
        default:
            return state;
    }
};
