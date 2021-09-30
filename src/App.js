import "./styles.css";
import { useCallback, useEffect, useState } from "react";

const useIdleTimeout = (timeout, onTimeout, onActivity) => {
  const fireOnTimeout = useCallback(() => {
    if (typeof onTimeout === "function") {
      onTimeout();
    }
  }, [onTimeout]);

  const fireOnActivity = useCallback(() => {
    if (typeof onActivity === "function") {
      onActivity();
    }
  }, [onActivity]);

  useEffect(() => {
    let timer;

    const set = () => {
      timer = window.setTimeout(fireOnTimeout, timeout);
    };

    const clear = () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };

    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchcancel",
      "touchend",
      "touchmove",
      "touchstart"
    ];

    const resetTimeout = () => {
      clear();
      set();
    };

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
      window.addEventListener(events[i], fireOnActivity);
    }

    set();
    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        window.removeEventListener(events[i], fireOnActivity);
        clear();
      }
    };
  }, [timeout, fireOnTimeout, fireOnActivity]);
};

export default function App() {
  const [active, setActive] = useState(false);

  const onActivity = () => {
    setActive(true);
  };

  const onTimeout = () => {
    setActive(false);
  };

  useIdleTimeout(3000, onTimeout, onActivity);

  return (
    <div className="App">
      <h1>Прошу, не трогай меня</h1>
      {active && <h2>ААА НУ ПОЖАЛУЙСТА, НЕ ТРОГАЙ</h2>}
    </div>
  );
}
