import {MDCRipple} from "@material/ripple";
import {CSSProperties, useEffect, useRef} from "react";
import styles from "../styles/IconButton.module.scss";
import Link from "next/link";

export default function IconButton({href, style}: {href: string; style?: CSSProperties}) {
  const ref = useRef<HTMLAnchorElement>();

  useEffect(() => {
    const ripple = new MDCRipple(ref.current);
    ripple.unbounded = true;

    return () => ripple.destroy();
  }, [ref.current]);

  return (
    <Link href={href}>
      <a ref={ref} style={style} className={`mdc-icon-button material-icons ${styles.button}`}>
        arrow_back
      </a>
    </Link>
  );
}
