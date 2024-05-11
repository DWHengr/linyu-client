import "./index.css"

export default function CustomButton({children, onClick, width, type}) {
    return (
        <>
            <div
                style={{width: width}}
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
