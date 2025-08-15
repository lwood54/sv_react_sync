import * as React from 'react';

let state = 0
let listeners: Array<() => void> = []

const myStore = {
  updateCount(newValue: number) {
    state = newValue;
    emit();
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
export const useSvelteStore = () => {
  const store = React.useSyncExternalStore(myStore.subscribe, myStore.getSnap)

  React.useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [])

  return { store };
}
