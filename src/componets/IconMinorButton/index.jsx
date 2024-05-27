import "./index.less"
import React, {useRef} from "react";

export default function IconMinorButton({icon, onClick, danger = false}) {
    const ref = useRef();
    return (
        <div
            ref={ref}
            className={`button-icon-minor ${danger ? "danger" : ""}`}
            onClick={(e) => {
                if (onClick) onClick(e, ref)
            }}
        >
            {icon}
        </div>
    )
}