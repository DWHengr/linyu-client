import "./index.less"

export default function CustomTextarea({children, height, placeholder, value, onChange}) {
    return (
        <div className="custom-textarea">
            <textarea
                style={{height: height}}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    if (onChange) onChange(e.target.value)
                }}
            >
            </textarea>
            <div>{children}</div>
        </div>
    )
}