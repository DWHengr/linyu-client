import './index.less';

const CustomSoundIcon = ({isStart, style = {}, barStyle = {}}) => {
    return (
        <div className={`sound-icon ${isStart ? 'start' : ''}`} style={style}>
            <div className="bar bar1" style={barStyle}></div>
            <div className="bar bar2" style={barStyle}></div>
            <div className="bar bar3" style={barStyle}></div>
            <div className="bar bar4" style={barStyle}></div>
            <div className="bar bar5" style={barStyle}></div>
        </div>
    );
};

export default CustomSoundIcon;
