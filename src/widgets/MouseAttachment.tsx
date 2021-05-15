import React, {useEffect, useRef, useState} from "react";
import {animated, useTransition} from "@react-spring/web";
import {GREEN, RED, TESTING} from "../util/util";
import MouseFollowingContainer, {lastMousePastScreenWidth} from "./MouseFollowingContainer";
import {useAppStore} from "../util/app_context";

export enum NotifyType {
  WHITE,
  GREEN,
  RED,
}

type AttachItem = {
  key: number;
  elem: JSX.Element;
};

export type MouseNotification = {
  message: string;
  type?: NotifyType;
};

let tKey = 0;
const itemRefs = new WeakMap();

const colors = {
  [NotifyType.GREEN]: GREEN,
  [NotifyType.RED]: RED,
};

export default function MouseAttachment() {
  const store = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [queue, setQueue] = useState<AttachItem[]>(() => []);
  const filterByKey = (key: number) => setQueue((state) => state.filter((item) => item.key !== key));

  useEffect(() => {
    if (store.log.length > 0) {
      const addition = store.log.map((notification) => {
        tKey++;
        setTimeout((key: number) => filterByKey(key), 2000, tKey);

        return {
          key: tKey,
          elem: (
            <div
              key={tKey}
              style={{
                color: notification.type ? colors[notification.type] : undefined,
              }}
            >
              {notification.message}
            </div>
          ),
        };
      });

      setQueue((state) => state.concat(addition));
      store.setLog([]);
    }
  }, [store.log]);

  const transitions = useTransition(queue, {
    keys: (item) => item.key,
    immediate: TESTING,
    from: {
      opacity: 0,
      height: 0,
      transform: `translate(${lastMousePastScreenWidth() ? "16px" : "-16px"}, 0px)`,
    },
    enter: ((item: AttachItem) => async (next: any) =>
      await next({
        opacity: 1,
        height: itemRefs.get(item).offsetHeight,
        transform: "translate(0px, 0px)",
      })) as any,
    leave: ((item: AttachItem) => async (next: any) =>
      await next({
        opacity: 0,
        height: itemRefs.get(item).offsetHeight,
        transform: "translate(0px, -16px)",
      })) as any,
  });

  return (
    <MouseFollowingContainer offsetRef={containerRef}>
      <div ref={containerRef}>
        {transitions((style, item) => (
          <animated.div key={item.key} style={style}>
            <div ref={(ref) => ref && itemRefs.set(item, ref)}>{item.elem}</div>
          </animated.div>
        ))}
      </div>
    </MouseFollowingContainer>
  );
}
