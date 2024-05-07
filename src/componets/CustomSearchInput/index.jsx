import "./index.less"

export default function CustomSearchInput() {

    return (
        <div className="custom-search-input">
            <input
                type="text"
                placeholder={"搜索"}
            />
            <div>
                <i className={`iconfont icon-sousuo`} style={{fontSize: 16, margin: 10, color: "#4C9BFF"}}/>
            </div>
        </div>
    )
}