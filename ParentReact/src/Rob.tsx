import * as React from "react";
import { useSvelteStore } from "./useSvelteStore";

export const Rob = React.memo(() => {
  // const { iDontChange, randomizeValue } = useSvelteStore()
  //   .values('iDontChange')
  //   .subscribe();

  // switch this with above to test rerendering
  //
  // also try getting rid of 'count' in values to see that count is
  // not allowed to be accessed unless we subscribe to it
  const { iDontChange, count, randomizeValue } = useSvelteStore()
    .values("iDontChange", "count")
    .subscribe();

  // console.log("rerendering...");
  return (
    <>
      <div>I dont change: {iDontChange}</div>
      <div>Count: {count}</div>
      <button onClick={randomizeValue}>Randomize rob</button>
    </>
  );
});
