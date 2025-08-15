import { useSvelteStore } from "./useSvelteStore";

export const Rob = () => {
  const { count, randomizeValue } = useSvelteStore();

  return (
    <>
      <div>From rob: {count}</div>
      <button onClick={randomizeValue}>Randomize rob</button>
    </>)
}
