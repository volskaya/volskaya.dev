import {useEffect, useRef} from "react";
import CSS from "../styles/MouseFollowingContainer.module.scss";

let lastMouseX = 0;
let lastMouseY = 0;

// Last mouse is set before this fun is used.
export function lastMousePastScreenWidth(line?: number): boolean {
  return typeof window !== "undefined" ? lastMouseX > window.innerWidth * (line || 0.8) : false;
}

function setLastMousePos(event?: MouseEvent) {
  if (event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
}

export default function MouseFollowingContainer({
  children,
  offsetRef,
}: Readonly<{
  children?: JSX.Element | JSX.Element[];
  offsetRef?: React.RefObject<any>;
}>): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const moveContainer = async (event?: MouseEvent) => {
    if (containerRef.current) {
      const x = event ? event.clientX : lastMouseX;
      const y = event ? event.clientY : lastMouseY;
      setLastMousePos(event);

      const offset =
        offsetRef && offsetRef.current ? (lastMousePastScreenWidth() ? offsetRef.current.offsetWidth : 0) : 0;

      containerRef.current.style.transform = `translate(${x + (offset ? -16 : 16) - offset}px,${y - 16}px)`;
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", moveContainer);
    return () => window.removeEventListener("mousemove", moveContainer);
  }, []);

  // Transform needs to be recalculated, when children appear or else the offset
  // will be wrong, until mouse event.
  useEffect(() => {
    if (children) moveContainer();
  }, [children]);

  return (
    <div ref={containerRef} className={CSS.container}>
      {children}
    </div>
  );
}
