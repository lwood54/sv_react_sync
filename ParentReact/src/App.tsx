import * as React from "react";

export default function App() {
  const svelteIFrameRef = React.useRef<HTMLIFrameElement>(null);
  const [intervalCounter, setIntervalCounter] = React.useState(0);
  const [clickCounter, setClickCounter] = React.useState(0);

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

  const sendMessage = ({ type, value }: { type: string; value?: number }) => {
    if (svelteIFrameRef.current) {
      svelteIFrameRef.current.contentWindow?.postMessage({ type, value }, "*");
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
        gap: "10px",
      }}
    >
      <h1>React App (parent)</h1>
      <p>Interval Counter from Svelte: {intervalCounter}</p>
      <p>Click Counter from Svelte: {clickCounter}</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            color: "black",
          }}
          onClick={() => sendMessage({ type: "incrementClick" })}
        >
          Add 1 to React Counter
        </button>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            color: "black",
          }}
          onClick={() => sendMessage({ type: "setIntervalValue", value: 100 })}
        >
          Set Interval Counter to 100
        </button>
      </div>

      <iframe
        ref={svelteIFrameRef}
        src="http://localhost:5174"
        style={{ width: "800px", height: "400px", border: "1px solid black" }}
        title="Svelte App"
      />
    </div>
  );
}
