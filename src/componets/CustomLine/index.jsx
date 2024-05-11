import "./index.less"

export default function CustomLine({width, direction = "horizontal", size}) {
    return (
        <div
            className={`custom-line ${direction}`}

            style={
                direction === "horizontal" ?
                    {width: size, borderTopWidth: width} :
                    {height: size, borderRightWidth: width,}
            }
        >
        </div>
    )
}