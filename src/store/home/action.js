import * as type from "./type";

export const setCurrentOption = (currentOption) => {
    return {
        type: type.Set_CurrentOption,
        currentOption: currentOption,
    };
};

export const setCurrentLoginUserInfo = (userId, username, account, portrait) => {
    return {
        type: type.Set_User_Info,
        userId,
        username,
        account,
        portrait
    };
};

export const setFileFileProgress = (fileName, progress) => {
    return {
        type: type.Set_File_Progress,
        fileName: fileName,
        progress: progress
    };
};