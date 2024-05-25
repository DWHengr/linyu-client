import * as type from "./type";
import {Add_Chart_Window_User} from "./type";


let defaultState = {
    currentChartId: "",
    currentChartUserInfo: null,
    chatWindowUsers: {},
};

export const chartData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentChartId:
            return {
                ...state,
                ...{currentChartId: action.currentChartId, currentChartUserInfo: action.currentChartUserInfo},
            };
        case type.Add_Chart_Window_User:
            state.chatWindowUsers[action.userInfo.from] = action.userInfo
            return {
                ...state
            };
        default:
            return state;
    }
};
