import { FaInfoCircle } from "react-icons/fa";
import TextGen from "../../util/Aceternity/TextGen";
export default function Alert({ by, content }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaInfoCircle size={20} />
      <TextGen words={content}/>
    </div>
  );
}
export function AlertSub({ by, sub, lineId }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaInfoCircle size={20} />
      <TextGen words={lineId}/>
      <div className="stack">{sub.map((e) => <TextGen words={JSON.stringify(e)}/>)}</div>
    </div>
  );
}