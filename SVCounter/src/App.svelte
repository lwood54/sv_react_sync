<script lang="ts">
  import { onMount } from "svelte";
  import { intervalCounter, clickCounter } from "./store";
  import { writable } from "svelte/store";

  // I don't understand why this readable pattern and using an internal setter
  // would be preferred to using a writable. Then we can listen to "message" at one spot
  // on mount and match on the data.type, update the store, and post. Seems cleaner.
  // const counter = readable(0, (set, update) => {
  //   setInterval(() => {
  //     update((prev) => prev + 1);
  //     window.parent.postMessage({ type: "count_update", value: $counter }, "*");
  //   }, 2000);

  //   // we won't add an event listener per readable/writable, but we'll need a way to match events with corresponding function calls/params
  //   window.addEventListener("message", (event) => {
  //     if (event.data?.type === "randomize") {
  //       set(event.data?.value);
  //     }
  //   });
  // });

  const counter = writable(0);

  counter.subscribe((v) =>
    window.parent.postMessage({ type: "count_update", value: v }, "*"),
  );

  intervalCounter.subscribe((val) => {
    window.parent.postMessage({ type: "intervalCounter", value: val }, "*");
  });

  clickCounter.subscribe((val) => {
    window.parent.postMessage({ type: "clickCounter", value: val }, "*");
  });

  onMount(() => {
    const id = setInterval(() => {
      intervalCounter.update((v) => v + 1);
    }, 5000);

    window.addEventListener("message", (event) => {
      if (event.data?.type === "incrementClick") {
        clickCounter.update((v) => v + 1);
      }
      if (event.data?.type === "setIntervalValue") {
        intervalCounter.set(event.data.value);
      }
      if (event.data?.type === "randomize") {
        console.info("randomize", event.data?.value);
        counter.update((v) => v + event.data?.value);
      }
    });

    return () => clearInterval(id);
  });
</script>

<div
  style="background-color: orange; width: 600px; height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;"
>
  <h2 style="color: teal">Svelte App (in iframe)</h2>
  <p style="color: teal">Interval Counter: {$intervalCounter}</p>
  <p style="color: teal">Click Counter: {$clickCounter}</p>
  <p>{$counter}</p>
</div>
