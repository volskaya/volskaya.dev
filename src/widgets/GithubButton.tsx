import {useRouter} from "next/router";
import React from "react";
import CSS from "../styles/GithubButton.module.scss";
import {GithubRoute} from "../util/router";

export default function GithubButton({
  testId,
  repoName,
  className,
  style,
  title,
  href,
  children,
  onClick,
  callback,
}: Readonly<{
  testId?: string;
  repoName?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  callback?: () => void;
}>): JSX.Element {
  const router = useRouter();
  const child = typeof children !== "string" ? children : children || repoName;
  const onMouseUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (onClick) {
      onClick();
    } else if (repoName) {
      router.push({
        pathname: "/",
        query: {repo: repoName, p: "README.md"} as GithubRoute,
      });
    }

    if (callback) callback();
  };

  return href ? (
    <a data-testid={testId} href={href} className={className || CSS.container} style={style} title={title}>
      <span className={CSS.passtrough}>{child}</span>
    </a>
  ) : (
    <button data-testid={testId} className={className || CSS.container} style={style} title={title} onClick={onMouseUp}>
      <span className={CSS.passtrough}>{child}</span>
    </button>
  );
}
