import "./index.css"

export default function CustomButton({children, onClick, width, type = "", style, disabled = false}) {
    return (
        <>
            <div
                style={{width: width, ...style}}
                className={`custom-button ${type} ${disabled ? "disabled" : ""}`}
                onClick={() => {
                    if (onClick && !disabled) onClick()
                }}
            >
                {children}
            </div>
        </>
    )
}
