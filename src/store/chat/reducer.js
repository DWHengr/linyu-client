import * as type from "./type";


let defaultState = {
    currentChatId: "",
    currentChatUserInfo: null,
    chatWindowUsers: new Map(),
};

export const chatData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentChatId:
            return {
                ...state,
                ...{currentChatId: action.currentChatId, currentChatUserInfo: action.currentChatUserInfo},
            };
        case type.Add_Chat_Window_User:
            const updatedChatWindowUsers = new Map(state.chatWindowUsers);
            updatedChatWindowUsers.set(action.userInfo.fromId, action.userInfo);
            return {
                ...state,
                chatWindowUsers: updatedChatWindowUsers
            };
        case type.Delete_Chat_Window_User:
            const chatWindowUsersAfterDeletion = new Map(state.chatWindowUsers);
            chatWindowUsersAfterDeletion.delete(action.userId);
            return {
                ...state,
                chatWindowUsers: chatWindowUsersAfterDeletion
            };
        default:
            return state;
    }
};
