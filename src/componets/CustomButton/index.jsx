import "./index.css"

export default function CustomButton({children, onClick, width}) {
    return (
        <>
            <div
                style={{width: width}}
                className="custom-button"
                onClick={() => {
                    if (onClick) onClick()
                }}
            >
                {children}
            </div>
        </>
    )
}
