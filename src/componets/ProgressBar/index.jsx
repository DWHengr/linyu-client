import React from 'react';
import './index.less';

const ProgressBar = ({progress}) => {
    return (
        <div className="progress-bar-container">
            {progress > 0 &&
                <>
                    <div className="progress-bar-bg">
                        <div className="progress-bar" style={{width: `${progress}%`}}>
                            <div className="progress-bar-flash"></div>
                        </div>

                    </div>
                    <div style={{
                        flexShrink: 0,
                        fontSize: 10,
                        marginLeft: 1,
                        width: 50,
                        textAlign: "center",
                        lineHeight: "10px"
                    }}>
                        {progress < 100 ? `${progress.toFixed(1)}/100` : "100%"}
                    </div>
                </>
            }
        </div>

    );
};

export default ProgressBar;
