import { FaInfoCircle, FaUserAlt } from "react-icons/fa";

export default function You({ by, content }) {
    return (
      <div
        className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
        role="alert"
      >
        <FaUserAlt size={20} />
        <p>{content}</p>
      </div>
    );
  }
  
  export function YouSub({ by, sub, lineId }) {
    return (
      <div
        className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
        role="alert"
      >
        <FaInfoCircle size={30} />
        <p>{lineId}</p>
        <div className="stack">{sub.map((e) => JSON.stringify(e))}</div>
      </div>
    );
  }
  