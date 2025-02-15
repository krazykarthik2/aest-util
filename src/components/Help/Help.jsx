import MdEditor from "@uiw/react-md-editor";
import { default as React, useEffect, useState } from "react";
import help from "../../assets/Help.md";

function Help() {
  //read markdown
  const [data, setData] = useState("");
  useEffect(() => {
    // read contents of help
    fetch(help)
      .then((res) => res.text())
      .then((text) => setData(text));
  });
  return (
    <div className="h-screen overflow-auto">
      <MdEditor.Markdown source={data} className="!bg-black font-code px-10 py-20"/>
    </div>
  );
}

export default Help;
