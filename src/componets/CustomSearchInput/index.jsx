import "./index.less"

export default function CustomSearchInput({value, onChange, placeholder = "搜索", style = {}}) {
    return (
        <div className="custom-search-input" style={style}>
            <input
                value={value}
                type="text"
                placeholder={placeholder}
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