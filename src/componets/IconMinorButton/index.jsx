import "./index.less"
import React from "react";

export default function IconMinorButton({icon, onClick, danger = false}) {
    return (
        <div
            className={`button-icon-minor ${danger ? "danger" : ""}`}
            onClick={(e) => {
                if (onClick) onClick(e)
            }}
        >
            {icon}
        </div>
    )
}