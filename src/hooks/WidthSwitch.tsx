import {useEffect, useState} from "react";

export const useWidthSwitch = ({breakPoint}: Readonly<{breakPoint: number}>): boolean => {
  const [toggle, setToggle] = useState(typeof window !== "undefined" ? window.innerWidth > breakPoint : false);
  const recalculate = () => setToggle(typeof window !== "undefined" ? window.innerWidth >= breakPoint : false);

  useEffect(() => {
    window.addEventListener("resize", recalculate);
    recalculate();
    return () => window.removeEventListener("resize", recalculate);
  });

  return toggle;
};
