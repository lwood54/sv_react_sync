import * as React from "react";
import { Rob } from "./Rob";

export default function App() {
  const svelteIFrameRef = React.useRef<HTMLIFrameElement>(null);
  const svelteIFrameRef2 = React.useRef<HTMLIFrameElement>(null);
  const [intervalCounter, setIntervalCounter] = React.useState(0);
  const [clickCounter, setClickCounter] = React.useState(0);

  // TODO:
  // const { intervalCounter, clickCounter } = useSvelteStore();

  React.useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "intervalCounter") {
        setIntervalCounter(event.data.value);
      }
      if (event.data?.type === "clickCounter") {
        setClickCounter(event.data.value);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendMessage = ({
    type,
    value,
    id,
  }: {
    type: string;
    value?: number;
    id?: string;
  }) => {
    if (svelteIFrameRef.current) {
      svelteIFrameRef.current.contentWindow?.postMessage(
        { type, value, id },
        "*"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <h1 style={{ margin: 0 }}>React App (parent)</h1>
      <p style={{ margin: 0 }}>
        Interval Counter from Svelte: {intervalCounter}
      </p>
      <p style={{ margin: 0 }}>Click Counter from Svelte: {clickCounter}</p>

      <div style={{ display: "flex", gap: "4px" }}>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            color: "black",
          }}
          onClick={() =>
            sendMessage({ type: "incrementClick", id: "svelte-frame" })
          }
        >
          Add 1 to React Counter
        </button>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            color: "black",
          }}
          onClick={() =>
            sendMessage({
              type: "setIntervalValue",
              value: 100,
              id: "svelte-frame",
            })
          }
        >
          Set Interval Counter to 100
        </button>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          style={{
            backgroundColor: "lightgreen",
            padding: "10px",
            color: "black",
          }}
          onClick={() =>
            sendMessage({ type: "incrementClick", id: "svelte-frame-2" })
          }
        >
          Add 1 to React Counter
        </button>
        <button
          style={{
            backgroundColor: "lightgreen",
            padding: "10px",
            color: "black",
          }}
          onClick={() =>
            sendMessage({
              type: "setIntervalValue",
              value: 100,
              id: "svelte-frame-2",
            })
          }
        >
          Set Interval Counter to 100
        </button>
      </div>

      <Rob />
      <iframe
        ref={svelteIFrameRef}
        src="http://localhost:5174"
        style={{
          width: "800px",
          height: "400px",
          border: "4px solid lightblue",
        }}
        title="Svelte App"
        id="svelte-frame"
      />
      <iframe
        ref={svelteIFrameRef2}
        src="http://localhost:5174"
        style={{
          width: "800px",
          height: "400px",
          border: "4px solid lightgreen",
        }}
        title="Svelte App"
        id="svelte-frame-2"
      />
    </div>
  );
}
