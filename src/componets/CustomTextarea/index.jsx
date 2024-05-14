import "./index.less"

export default function CustomTextarea({children}) {
    return (
        <div className="custom-textarea">
            <textarea></textarea>
            <div>{children}</div>
        </div>
    )
}