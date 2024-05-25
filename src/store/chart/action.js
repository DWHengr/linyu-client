import * as type from "./type";

export const setCurrentChartId = (currentChartId, currentChartUserInfo) => {
    return {
        type: type.Set_CurrentChartId,
        currentChartId: currentChartId,
        currentChartUserInfo: currentChartUserInfo
    };
};

export const addChartWindowUser = (userInfo) => {
    return {
        type: type.Add_Chart_Window_User,
        userInfo: userInfo
    };
};