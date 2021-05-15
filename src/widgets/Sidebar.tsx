import {animated, config, useTrail} from "@react-spring/web";
import {useWidthSwitch} from "../hooks/WidthSwitch";
import {BP_LARGE, TESTING} from "../util/util";
import CSS from "../styles/Sidebar.module.scss";
import LazyAvatar from "./LazyAvatar";
import {useAppStore} from "../util/app_context";

const springConfig = {
  ...config.default,
  mass: 1,
  tension: 750,
  friction: 50,
};

export default function Sidebar({
  visible,
}: Readonly<{
  visible?: boolean;
}>): JSX.Element {
  const store = useAppStore();
  const isScreenLarge = useWidthSwitch({breakPoint: BP_LARGE});
  const pinnedLen = store.pinnedRepos.length;
  const trail = useTrail(pinnedLen, {
    immediate: TESTING,
    config: springConfig,
    opacity: visible ? 1 : 0,
    transform: visible ? "translate(0px, 0px) scale(1)" : "translate(8px, 32px) scale(1.2)",
  });

  return (
    <div className={CSS.container}>
      {!isScreenLarge
        ? store.pinnedRepos.map((repo, i) => (
            <animated.div key={i} className={CSS.holster} style={trail[pinnedLen - i - 1]}>
              <LazyAvatar repo={repo} />
            </animated.div>
          ))
        : undefined}
    </div>
  );
}
