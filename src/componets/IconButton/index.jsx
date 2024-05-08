import React from "react";
import "./index.css"

export default function IconButton({icon, onClick, danger = false}) {
    return (
        <div
            className={`button-icon-container ${danger ? "danger" : ""}`}
            onClick={() => {
                if (onClick) onClick();
            }}
        >
            {icon}
        </div>
    )
}