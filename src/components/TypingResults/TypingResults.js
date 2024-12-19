import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const generateImg = () => {
  // Create a canvas element where the screenshot will be drawn
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to match the document body size
  canvas.width = document.body.scrollWidth;
  canvas.height = document.body.scrollHeight;

  // Draw the current document body onto the canvas (using the body as image source)
  ctx.drawImage(document.body, 0, 0);

  // Capture the canvas stream
  const stream = canvas.captureStream();

  // Create a video element to capture frames from the stream
  const video = document.createElement("video");
  video.srcObject = stream;
  video.play();

  // Create a new canvas where we will draw the stream content
  const outputCanvas = document.createElement("canvas");
  const outputCtx = outputCanvas.getContext("2d");

  // Set the output canvas size to match the original canvas
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;

  // Draw the first frame of the stream to the new canvas
  video.oncanplay = () => {
    outputCtx.drawImage( video.currentSrc, 0, 0, outputCanvas.width, outputCanvas.height);

    // Convert the output canvas to a Blob (image)
    outputCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "screenshot-typing-result.png", { type: "image/png" });

        // Log the file and URL
        console.log(file);
        console.log(URL.createObjectURL(file));

        return file;
      }
    }, "image/png");

    // Stop the video stream once we've captured the frame
    stream.getTracks().forEach((track) => track.stop());
  };
};
function ShareBtn(params) {
  const handleShare = (params) => {
    navigator.share({
      title: "Typing Results",
      text: "Check out my typing results!",
      files: [generateImg()],
    });
  };
  return (
    <button
      onClick={() => handleShare(params)}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-2 rounded bg-blue-500 text-white"
    >
      Share
    </button>
  );
}
const TypingResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stats = location.state?.stats || {
    wpm: 0,
    accuracy: 0,
    time: 0,
    rawWpm: 0,

  };
  const tryAgain = location.state?.tryAgain || "/typing";

  const renderStat = (value, label, size = "large") => (
    <div className="text-center">
      <div
        className={`${size === "large" ? "text-6xl" : "text-4xl"} font-bold text-terminal-white`}
      >
        {value}
      </div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div
        className="w-full max-w-2xl  bg-terminal-gray rounded-lg p-8"
      >
        <div className="grid grid-cols-2 gap-8 mb-8">
          {renderStat(stats.wpm, "wpm", "large")}
          {renderStat(stats.accuracy + "%", "acc", "large")}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {renderStat(stats.rawWpm, "raw-wpm", "small")}
          {renderStat(stats.time + "s", "time-taken", "small")}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => navigate(tryAgain)}
            className="px-6 py-2 rounded bg-terminal-accent text-black"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/terminal")}
            className="px-6 py-2 rounded  bg-terminal-gray text-terminal-white"
          >
            Back to Terminal
          </button>

          <ShareBtn />
        </div>
      </div>
    </div>
  );
};

export default TypingResults;
