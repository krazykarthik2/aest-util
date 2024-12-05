import React from 'react'

function QRCode({ src = "", ...props }) {
    return (
        <img src={"https://api.qrserver.com/v1/create-qr-code/?data=" + src} {...props} alt={props.alt || "qrcode"} />
    )
}

export default QRCode
