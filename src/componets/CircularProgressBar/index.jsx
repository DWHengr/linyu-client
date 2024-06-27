import React from 'react';
import './index.less';

const CircularProgressBar = ({progress, children, size = 60, strokeWidth = 5}) => {
    const circleRadius = (size - strokeWidth) / 2;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference - (progress / 100 * circleCircumference);

    return (
        <div className="circular-progress-container" style={{width: size, height: size}}>
            <div className="outer-circle">
                {progress > 0 && <svg className="progress-ring" width={size} height={size}>
                    <circle
                        className="progress-ring__circle-bg"
                        stroke="#e0e0e0"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={circleRadius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className="progress-ring__circle"
                        stroke="#A0D9F6"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={circleRadius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{
                            strokeDasharray: circleCircumference,
                            strokeDashoffset: progressOffset,
                        }}
                    />
                </svg>
                }
                <div className="progress-content">
                    {children}
                    {progress > 0 && <div className="progress-text">
                        {progress < 100 ? `${progress.toFixed(1)}%` : "100%"}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CircularProgressBar;
