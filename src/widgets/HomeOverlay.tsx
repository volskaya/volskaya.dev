import {useRouter} from "next/router";
import CSS from "../styles/HomeOverlay.module.scss";
import {getRoute, Routes} from "../util/router";

export default function HomeOverlay(): JSX.Element {
  const router = useRouter();
  const isOnHomeRoute = getRoute(router) === Routes.home;
  const goHome = () => router.push("/");

  return (
    <div
      className={CSS.container}
      style={{pointerEvents: !isOnHomeRoute ? "auto" : "none"}}
      onClick={!isOnHomeRoute ? goHome : undefined}
    />
  );
}
