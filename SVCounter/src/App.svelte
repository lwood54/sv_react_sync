<script lang="ts">
  import { onMount } from "svelte";
  import { intervalCounter, clickCounter } from "./store.js";
  import { readable } from "svelte/store";

  let intervalVal = $state($intervalCounter);
  let clickVal = $state($clickCounter);

  const counter = readable(0, (_, update) => {
    setInterval(() => {
      update((prev) => prev + 1);
      window.parent.postMessage({ type: "count_update", value: $counter }, "*");
    }, 500);
  });

  intervalCounter.subscribe((val) => {
    intervalVal = val;
    window.parent.postMessage({ type: "intervalCounter", value: val }, "*");
  });

  clickCounter.subscribe((val) => {
    clickVal = val;
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
    });

    return () => clearInterval(id);
  });
</script>

<div
  style="background-color: orange; width: 600px; height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;"
>
  <h2 style="color: teal">Svelte App (in iframe)</h2>
  <p style="color: teal">Interval Counter: {intervalVal}</p>
  <p style="color: teal">Click Counter: {clickVal}</p>
  <p>{$counter}</p>
</div>
