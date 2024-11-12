import React, {useEffect, useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';

const CustomQRCode = ({value, size = 128, fgColor = "#000000", bgColor = "#ffffff"}) => {
    const [text, setText] = useState(value)
    useEffect(() => {
        setText(value)
    }, [value]);
    return (
        <QRCodeSVG
            value={text}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            imageSettings={{
                src: '/logo.png',
                excavate: true,
                height: size / 5,
                width: size / 5,
            }}
            level="Q"
        />
    );
};

export default CustomQRCode;
