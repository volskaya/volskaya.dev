import CSS from "../styles/Ripple.module.scss";

export default function Ripple({center}: {center?: boolean}) {
  const ripple = (
    <div className={CSS.ripple}>
      <div />
      <div />
    </div>
  );

  return center ? <div className={CSS.center}>{ripple}</div> : ripple;
}
