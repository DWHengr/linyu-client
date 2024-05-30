import "./index.css"

export default function CustomButton({children, onClick, width, type, style}) {
    return (
        <>
            <div
                style={{width: width, ...style}}
                className={`custom-button ${type}`}
                onClick={() => {
                    if (onClick) onClick()
                }}
            >
                {children}
            </div>
        </>
    )
}
