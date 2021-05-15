import CSS from "../styles/NoScrollWrap.module.scss";

export default function NoScrollWrap({
  children,
}: Readonly<{
  children: JSX.Element | JSX.Element[];
}>): JSX.Element {
  return <div className={CSS.hiddenScrollBar}>{children}</div>;
}
