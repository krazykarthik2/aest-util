import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import Terminal from "../../Terminal/Terminal";

export default function Style15({ hours, minutes, props, dispatch }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [terminationFlag, setTerminationFlag] = useState(false);
  useEffect(() => {
    if (terminationFlag) {
      console.log("Navigating to auto-results");
      console.log(messages);
      navigate("/auto/results", { state: messages });
    }
  }, [terminationFlag]);

  const navigate = useNavigate();
  const batchActions = [
    "batch-created",
    "batch-output",
    "batch-error",
    "batch-executed",
  ];

  useEffect(() => {
    if (ws) return;
    const __ws = new WebSocket("ws://localhost:4595");
    setWs(__ws);

    __ws.onopen = () => {
      setConnected(true);
      setMessages((prev) => [
        ...prev,
        { by: "alert", content: "Connected to WebSocket" },
      ]);
    };

    __ws.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        { by: "server", content: JSON.parse(event.data) },
      ]);
      if (JSON.parse(event.data).action === "batch-executed")
        setTerminationFlag(true);
      console.log(event.data);
    };

    __ws.onerror = (error) => {
      setMessages((prev) => [
        ...prev,
        { by: "server", content: "Error: Connection issue" },
      ]);
    };
    __ws.onpong = () => {
      setMessages((prev) => [
        ...prev,
        { by: "server", content: "Pong received" },
      ]);
    };
    __ws.onclose = () => {
      setConnected(false);
      setMessages((prev) => [
        ...prev,
        { by: "alert", content: "Disconnected from WebSocket" },
      ]);
      setWs(null);
      alert("Disconnected from WebSocket");
      console.log("Disconnected from WebSocket");
    };
  }, [ws]);

  window.ws = ws;
  const sendMessage = () => {
    if (ws) {
      console.log(input.trim());
      if (input.trim()) {
        const json = {
          command: {
            exec: input
              ?.split("\n")
              ?.map((e) => ({ name: "work1", command: e })),
          },
          action: "batch-commands",
        };
        console.log(json);
        ws.send(JSON.stringify(json));
        setMessages((prev) => [...prev, { by: "you", content: "input" }]);
        setInput("");
      } else {
        console.log("No input");
      }
    } else {
      console.log("No connection");
    }
  };
  const sendInterrupt = () => {
    if (ws) {
      ws.send({ command: {}, action: "interrupt" });
      setMessages((prev) => [...prev, { by: "you", content: "Interrupt" }]);
    }
  };

  return (
    <div className="p-4 w-full mx-auto bg-gray-900 text-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-3">WebSocket API Terminal</h2>
      <div className="h-60 overflow-y-auto bg-black p-2 rounded-md mb-2">
        FULL LOGS:
        {messages?.map((msg, index) => (
          <div key={index} className="text-green-400 text-sm">
            <Markdown rehypePlugins={[rehypeRaw]}>
              {JSON.stringify(msg?.content || "")}
            </Markdown>
          </div>
        ))}
      </div>
      {messages?.findIndex((e) => e.content.action === "batch-created") !=
        -1 && (
        <div>
          <Markdown>
            {
              messages?.find((e) => e?.content?.action === "batch-created")
                ?.content?.output
            }
          </Markdown>
        </div>
      )}
      <div className="flex w-full gap-2 mb-2 ">
        <div className="w-full batch-output">
          BATCH OUTPUT:
          {messages
            ?.filter((e) => e.content.action === "batch-output")
            .map((msg, index) => (
              <div key={index} className="text-green-400 text-sm">
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {msg.content.output}
                </Markdown>
              </div>
            ))}
        </div>
        <div className="w-full batch-error text-red-400">
          BATCH ERROR:
          {messages
            .filter((e) => e.content.action === "batch-error")
            .map((msg, index) => (
              <div key={index} className="text-red-400 text-sm">
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {JSON.stringify(msg.content)}
                </Markdown>
              </div>
            ))}
        </div>
      </div>
      <div className="flex gap-2">
        <textarea
          autoFocus
          className="flex-1 bg-gray-800 border-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command..."
        />
        <button onClick={() => sendMessage()} disabled={!connected}>
          Send
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Status: {connected ? "Connected" : "Disconnected"}
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => ws.close()} disabled={!connected}>
          Disconnect
        </button>
        <button
          onClick={() => {
            setWs(new WebSocket("ws://localhost:4595"));
          }}
          disabled={connected}
        >
          Connect
        </button>
        <button onClick={() => setMessages([])}>Clear</button>

        <button onClick={() => ws.terminate()} disabled={!connected}>
          Terminate
        </button>
        <button onClick={() => ws.close()} disabled={!connected}>
          Close Connection
        </button>
        <button onClick={() => ws.send("ping")} disabled={!connected}>
          Ping
        </button>

        <button onClick={() => sendInterrupt()}>Interrupt</button>
      </div>
      <Terminal hidden={true} {...props} />
    </div>
  );
}
