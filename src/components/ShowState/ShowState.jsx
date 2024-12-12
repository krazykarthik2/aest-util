import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import JsonFormatter from 'react-json-formatter';
function ShowState(){
    const state = useSelector(e=>e);
    return <div className="w-screen h-full d-center">
  <JsonFormatter json={state} tabWith={4} />;
    </div>
}
export default ShowState