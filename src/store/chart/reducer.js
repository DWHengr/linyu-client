import * as type from "./type";


let defaultState = {
    currentChartId: null,
};

export const chartData = (state = defaultState, action) => {
    switch (action.type) {
        case type.Set_CurrentChartId:
            return {
                ...state,
                ...{currentChartId: action.currentChartId},
            };
        default:
            return state;
    }
};
