import "./index.less";
import {memo, useEffect, useState} from "react";
import UserAPi from "../../api/user.js";
import CreateImageViewer from "../../pages/ImageViewer/window.jsx";

const CustomImg = memo(({fileName, targetId}) => {
    const [imgInfo, setImgInfo] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        UserAPi.getImg({fileName, targetId})
            .then((res) => {
                setImgInfo(res.data);
            });
    }, [fileName, targetId]);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="custom-img" onClick={(e) => e.stopPropagation()}>
            {imgInfo && !isLoaded ? (
                <div className="loading-spinner"></div>
            ) : null}
            {imgInfo ? (
                <img
                    className="img"
                    src={imgInfo}
                    alt=""
                    onLoad={handleImageLoad}
                    style={{ display: isLoaded ? 'block' : 'none' }}
                    onClick={(e) => {
                        CreateImageViewer(fileName, imgInfo);
                    }}
                />
            ) : null}
        </div>
    )
});

export default CustomImg;
