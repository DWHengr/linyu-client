import * as type from "./type";

export const setCurrentChartId = (currentChartId) => {
    return {
        type: type.Set_CurrentChartId,
        currentChartId: currentChartId,
    };
};