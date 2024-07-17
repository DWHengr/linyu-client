import './index.less';

const CustomSoundIcon = ({isStart, style = {}}) => {
    return (
        <div className={`sound-icon ${isStart ? 'start' : ''}`} style={style}>
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
            <div className="bar bar5"></div>
        </div>
    );
};

export default CustomSoundIcon;
