import React, {useEffect, useState} from "react";
import {randomBetween, TESTING} from "../util/util";
import CSS from "../styles/NewbieTip.module.scss";

export default function NewbiewTip({
  style,
  className,
  children,
  prefixElem,
  postfixElem,
}: Readonly<{
  style?: React.CSSProperties;
  className?: string;
  children: string;
  prefixElem?: JSX.Element;
  postfixElem?: JSX.Element;
}>): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState("block");

  useEffect(() => {
    setTimeout(
      () => {
        setVisible(true);
        setTimeout(
          () => {
            setVisible(false);
            setTimeout(() => setDisplay("none"), 1000);
          },
          !TESTING ? randomBetween(2000, 6000) : 0
        );
      },
      !TESTING ? randomBetween(250, 500) : 0
    );
  }, []);

  return (
    <div
      className={className || CSS.container}
      style={{
        ...style,
        display,
        opacity: visible ? 1 : 0,
      }}
    >
      {prefixElem}
      <div className={CSS.text}>{children}</div>
      {postfixElem}
    </div>
  );
}
