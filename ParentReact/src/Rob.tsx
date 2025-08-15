import { useSvelteStore } from "./useSvelteStore";

export const Rob = () => {
  const { store } = useSvelteStore();

  return <div>From rob: {store}</div>
}
