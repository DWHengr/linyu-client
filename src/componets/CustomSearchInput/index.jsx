import "./index.less"

export default function CustomSearchInput({value, onChange}) {

    return (
        <div className="custom-search-input">
            <input
                value={value}
                type="text"
                placeholder={"搜索"}
                onChange={(e) => {
                    if (onChange) onChange(e.target.value)
                }}
            />
            <div>
                <i className={`iconfont icon-sousuo`} style={{fontSize: 16, margin: 10, color: "#4C9BFF"}}/>
            </div>
        </div>
    )
}