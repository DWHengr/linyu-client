import * as type from "./type";

export const setCurrentOption = (currentOption) => {
    return {
        type: type.Set_CurrentOption,
        currentOption: currentOption,
    };
};