import * as type from "./type";

export const setCurrentChatId = (currentChatId, currentChatUserInfo) => {
    return {
        type: type.Set_CurrentChatId,
        currentChatId: currentChatId,
        currentChatUserInfo: currentChatUserInfo
    };
};

export const addChatWindowUser = (userInfo) => {
    return {
        type: type.Add_Chat_Window_User,
        userInfo: userInfo
    };
};