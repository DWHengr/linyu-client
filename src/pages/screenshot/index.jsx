import React, {useEffect, useState} from 'react';
import {emitTo} from '@tauri-apps/api/event';
import {invoke} from "@tauri-apps/api/core";
import './index.less';
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import {getItem} from "../../utils/storage.js";
import {Image} from "@tauri-apps/api/image";
import {base64ToArrayBuffer} from "../../utils/img.js";
import {writeImage} from "@tauri-apps/plugin-clipboard-manager";

const screenshot = () => {
    const [listeners, setListeners] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [startPointX, setStartPointX] = useState(0);
    const [startPointY, setStartPointY] = useState(0);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [resizingType, setResizingType] = useState("");
    const balls = [
        "top-left",
        "top-middle",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-middle",
        "bottom-right",
    ];
    const toolSize = 28;
    const toolbarOffset = 10;

    useEffect(() => {
        const fetchMonitorSize = async () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        const registerShortcuts = () => {
            window.addEventListener('keydown', (e) => {
                if (e.keyCode === 27) {
                    clear();
                }
            });
            document.oncontextmenu = () => false;
        };

        fetchMonitorSize();
        registerShortcuts();

        return () => {
            listeners.forEach((listener) => listener());
        };
    }, [listeners]);

    const clear = async () => {
        setLeft(0);
        setTop(0);
        setWidth(0);
        setHeight(0);
        let window = await WebviewWindow.getByLabel("screenshot")
        window.hide()
    };

    const capture = async () => {
        await clear();
        let window = await WebviewWindow.getByLabel("screenshot");
        let scaleFactor = await window.scaleFactor()
        const captureDetails = {
            left: Math.floor(left * scaleFactor),
            top: Math.floor(top * scaleFactor),
            width: Math.floor(width * scaleFactor),
            height: Math.floor(height * scaleFactor)
        };
        let screenshot = await getItem("screenshot")
        try {
            const response = await invoke('screenshot', {
                x: captureDetails.left.toString(),
                y: captureDetails.top.toString(),
                width: captureDetails.width.toString(),
                height: captureDetails.height.toString(),
            });
            Image.fromBytes(base64ToArrayBuffer(response)).then(res => {
                writeImage(res)
            })
            if (screenshot.toUserWindowLabel)
                await emitTo(screenshot.toUserWindowLabel, 'screenshot_result', response);
        } catch (err) {
            await emitTo(screenshot.toUserWindowLabel, 'screenshot_result', '');
        }
    };

    const resizeDown = (e, type) => {
        if (!isMoving) {
            setResizingType(type);
            const {x, y, opposite_x, opposite_y} = getPointAndOppositePoint(type);
            setStartPointX(opposite_x);
            setStartPointY(opposite_y);
            setLeft(Math.min(x, opposite_x));
            setWidth(Math.abs(x - opposite_x));
            setTop(Math.min(y, opposite_y));
            setHeight(Math.abs(y - opposite_y));
            setIsMoving(true);
        }
    };

    const getPointAndOppositePoint = (type) => {
        let x = left;
        let y = top;
        let opposite_x = left + width;
        let opposite_y = top + height;
        if (type.indexOf('right') !== -1) {
            opposite_x = left;
            x = left + width;
        }
        if (type.indexOf('bottom') !== -1) {
            opposite_y = top;
            y = top + height;
        }
        return {x, y, opposite_x, opposite_y};
    };

    const dragDown = (e) => {
        if (e.target.id !== 'rectangle') return;
        if (!isDragging) {
            setStartPointX(e.nativeEvent.offsetX);
            setStartPointY(e.nativeEvent.offsetY);
            setIsDragging(true);
        }
    };

    const dragMove = (e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        if (isDragging) {
            requestAnimationFrame(() => {
                const targetX = left + x - startPointX;
                const targetY = top + y - startPointY;

                // 计算右侧和底部的边界
                const rightBoundary = windowWidth - width;
                const bottomBoundary = windowHeight - height;
                // 边界检查
                if (targetX < 0) {
                    setLeft(0);
                } else if (targetX > rightBoundary) {
                    setLeft(rightBoundary);
                } else {
                    setLeft(targetX);
                }

                if (targetY < 0) {
                    setTop(0);
                } else if (targetY > bottomBoundary) {
                    setTop(bottomBoundary);
                } else {
                    setTop(targetY);
                }
            })
        }
    };

    const dragUp = () => {
        if (isDragging) setIsDragging(false);
    };

    const getStage = (value, type) => {
        const arg = type === 'left' ? 'width' : 'height';
        if (value < left) return 1;
        if (value >= left && value <= left + window[arg]) return 2;
        return 3;
    };

    const mouseDown = (e) => {
        if (e.target.id !== 'screenshot') return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        if (draggable) {
            setStartPointX(x);
            setStartPointY(y);
            setLeft(x);
            setTop(y);
            setIsMoving(true);
        } else {
            if (isBallShow) return;
            const leftStage = getStage(x, 'left');
            const topStage = getStage(y, 'top');
            if (leftStage === 1 && topStage === 1) {
                setWidth(width + left - x);
                setLeft(x);
                setHeight(height + top - y);
                setTop(y);
            }
            if (leftStage === 2 && topStage === 1) {
                setHeight(height + top - y);
                setTop(y);
            }
            if (leftStage === 3 && topStage === 1) {
                setWidth(x - left);
                setHeight(height + top - y);
                setTop(y);
            }
            if (leftStage === 1 && topStage === 2) {
                setWidth(width + left - x);
                setLeft(x);
            }
            if (leftStage === 3 && topStage === 2) {
                setWidth(x - left);
            }
            if (leftStage === 1 && topStage === 3) {
                setWidth(width + left - x);
                setLeft(x);
                setHeight(y - top);
            }
            if (leftStage === 2 && topStage === 3) {
                setHeight(y - top);
            }
            if (leftStage === 3 && topStage === 3) {
                setWidth(x - left);
                setHeight(y - top);
            }
        }
    };

    const mouseMove = (e) => {
        const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        const x = e.pageX || e.clientX + scrollX;
        const y = e.pageY || e.clientY + scrollY;
        if (isMoving) {
            if (!['top-middle', 'bottom-middle'].includes(resizingType)) {
                setLeft(Math.min(x, startPointX));
                setWidth(Math.abs(x - startPointX));
            }
            if (!['middle-left', 'middle-right'].includes(resizingType)) {
                setTop(Math.min(y, startPointY));
                setHeight(Math.abs(y - startPointY));
            }
        }
    };

    const mouseUp = () => {
        if (isMoving) {
            if (width === 0 && height === 0) {
                setLeft(0);
                setTop(0);
                setWidth(windowWidth);
                setHeight(windowHeight);
            }
            setIsMoving(false);
            setResizingType('');
        }
    };

    const right = left + width;
    const bottom = top + height;
    const isBallShow = width >= 1 || height >= 1;
    const draggable = !isMoving && width === 0 && height === 0;

    const toolStyle = {
        width: `${toolSize}px`,
        height: `${toolSize}px`,
    };

    const toolbarStyle = () => {
        const offset = 0;
        const style = {};
        if (bottom + toolbarOffset + toolSize < windowHeight - offset) {
            style.bottom = `-${toolSize + toolbarOffset}px`;
        } else if (top - toolbarOffset - toolSize > offset) {
            style.top = `-${toolSize + toolbarOffset}px`;
        } else {
            style.bottom = '0px';
        }
        if (right - 2 * toolSize > 10) {
            style.right = '0px';
        } else {
            style.left = '0px';
        }
        return {
            display: !isMoving && width > 0 && height > 0 ? 'flex' : 'none',
            ...style,
        };
    };

    const rectangleStyle = {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        display: draggable ? 'none' : 'block',
    };

    return (
        <div
            id="screenshot"
            style={{
                '--left': `${left}px`,
                '--top': `${top}px`,
                '--width': `${width}px`,
                '--height': `${height}px`,
                cursor: isBallShow ? '' : 'crosshair',
            }}
            onMouseDownCapture={mouseDown}
            onMouseMoveCapture={mouseMove}
            onMouseUpCapture={mouseUp}
            onMouseLeave={mouseUp}
        >
            <div
                id="rectangle"
                style={rectangleStyle}
                onMouseDownCapture={dragDown}
                onMouseMoveCapture={dragMove}
                onMouseUpCapture={dragUp}
                onMouseLeave={dragUp}
                onMouseOutCapture={dragUp}
            >
                {balls.map((item) => (
                    <div
                        key={item}
                        className={`${item} ball`}
                        style={{display: isBallShow ? 'block' : 'none'}}
                        onMouseDownCapture={(e) => resizeDown(e, item)}
                    />
                ))}
                <div className="toolbar" style={toolbarStyle()}>
                    <div className="tool" style={toolStyle} onClick={clear}>
                        <i className={`iconfont icon icon-guanbi`} style={{fontSize: 24}}/>
                    </div>
                    <div className="tool flex-row-center" style={toolStyle} onClick={capture}>
                        <i className={`iconfont icon icon-wancheng`} style={{fontSize: 24}}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default screenshot;
