import "./index.less"
import React, {useRef} from "react";
import CustomTooltip from "../CustomTooltip/index.jsx";

export default function IconMinorButton({icon, onClick, danger = false, title = ""}) {
    const ref = useRef();
    return (
        <CustomTooltip placement="bottom" title={title}>
            <div
                ref={ref}
                className={`button-icon-minor ${danger ? "danger" : ""}`}
                onClick={(e) => {
                    if (onClick) onClick(e, ref)
                }}
            >
                {icon}
            </div>
        </CustomTooltip>
    )
}