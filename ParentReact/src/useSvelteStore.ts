import * as React from 'react';

let state = {
  iDontChange: 'foo',
  count: 0
}

let listeners: Array<() => void> = []
// only rerender on these values
const subscribedValues = new Set();

const myStore = {
  updateCount(newValue: number) {
    state = { ...state, count: newValue }
    if (subscribedValues.has('count')) {
      emit();
    }
  },
  updateIDontChange(newValue: string) {
    state = { ...state, iDontChange: newValue }
    if (subscribedValues.has('iDontChange')) {
      emit();
    }
  },
  subscribe(_listener: () => void) {
    listeners = [...listeners, _listener];
    return () => {
      listeners = listeners.filter(l => l !== _listener);
    }
  },
  getSnap() {
    return state
  }
}

const emit = () => {
  for (const listener of listeners) {
    listener();
  }
}

function handleMessage(event: MessageEvent) {
  if (event.data?.type === "count_update") {
    console.log('count_update')
    myStore.updateCount(event.data.value)
  }
}

const builder = (store: typeof state) => ({
  values<const T extends Array<keyof typeof state>>(...values: T) {
    subscribedValues.clear();
    values.forEach(v => subscribedValues.add(v));

    return {
      subscribe() {
        return {
          ...store,
          randomizeValue,
          // we can cast this for the user's sake, not our own
        } as Pick<typeof state, T[number]> & { randomizeValue: typeof randomizeValue };;
      },
    };
  },
})

// an example of function calling
function randomizeValue() {
  const svelteFrame: HTMLIFrameElement | null = document.querySelector('#svelte-frame');
  if (!svelteFrame) {
    return;
  }
  svelteFrame.contentWindow?.postMessage({ type: 'randomize', value: Math.floor(Math.random() * 100) }, "*");
}

export const useSvelteStore = () => {
  const store = React.useSyncExternalStore(myStore.subscribe, myStore.getSnap)

  React.useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [])

  return builder(store);
}
