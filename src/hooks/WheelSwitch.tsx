import {useEffect, useRef, useState} from "react";
import {MOBILE_DETECTION} from "../util/util";

export const useWheelSwitch = (
  {delta = 3, callback}: {delta?: number; callback?: (to: boolean) => void} = {
    delta: 3,
  }
): [React.RefObject<HTMLDivElement>, () => void, boolean, (to: boolean) => void] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const toggle = useRef(false);
  const [val, setVal] = useState(0);
  const wheelEvent = (event: WheelEvent) =>
    event.deltaY > 0
      ? setVal((state) => (state < delta ? state + 1 : state))
      : setVal((state) => (state > 0 ? state - 1 : state));

  const flipToggle = () => setVal(toggle.current ? 0 : delta);
  const setToggle = (to: boolean) => setVal(to ? 10 : 0);

  if (!MOBILE_DETECTION.phone) {
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.addEventListener("wheel", wheelEvent);
      }

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener("wheel", wheelEvent);
        }
      };
    }, [containerRef.current]);
  }

  useEffect(() => {
    if (val === 0) {
      toggle.current = false;
      if (callback) {
        callback(false);
      }
    } else if (val === delta) {
      toggle.current = true;
      if (callback) {
        callback(true);
      }
    }
  }, [val]);

  return [containerRef, flipToggle, toggle.current, setToggle];
};
