import React from 'react'
import { useParams } from 'react-router-dom'

function QrImgResult() {
    const params = useParams()
    return (
        <div className='d-center w-full h-screen'>
            <img src={decodeURIComponent(params.result)} alt='nothing' className='bg-gray-400'/>
        </div>
    )
}

export default QrImgResult
