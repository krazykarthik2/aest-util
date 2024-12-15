import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { getFrontEndURL } from "../../redux/store";

const QrImgUtil = () => {
  const [imgData, setImgData] = useState("");
  const [imgFile, setImgFile] = useState(null);
  
  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgData(encodeURIComponent(reader.result));
        console.log(reader.result,reader.result.length)
      };
      reader.readAsDataURL(imgFile);
    } 
  }, [imgFile]);
  useEffect(()=>{
    if((imgData.length)>23648)
      setImgData("")
  },[imgData])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1>Use only &lt;1.6kb igm files </h1>
        {getFrontEndURL()}<br/>{'\n/qrimgresult/'+imgData}
      <div className="p-8  bg-terminal-gray rounded-lg shadow-lg">
        {imgData && imgData.length<23649 ? <QRCode value={getFrontEndURL() +'/qrimgresult/'+imgData} /> : <>No Img data</>}
      </div>
      <input type="file" accept="image/*" onChange={e=>setImgFile(e.target.files[0])}/>
      <div className="mt-4 text-center">
        <p className="text-terminal-white">Scan to share command</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 rounded bg-terminal-accent text-black"
        >
          Back to Terminal
        </button>
      </div>
    </div>
  );
};

export default QrImgUtil;
