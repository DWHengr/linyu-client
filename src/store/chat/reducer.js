import * as type from "./type";
import {Add_Chat_Window_User} from "./type";


let defaultState = {
    currentChatId: "",
    currentChatUserInfo: null,
    chatWindowUsers: {},
};

export const chatData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentChatId:
            return {
                ...state,
                ...{currentChatId: action.currentChatId, currentChatUserInfo: action.currentChatUserInfo},
            };
        case type.Add_Chat_Window_User:
            state.chatWindowUsers[action.userInfo.from] = action.userInfo
            return {
                ...state
            };
        default:
            return state;
    }
};
