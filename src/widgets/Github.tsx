import {config, useTrail} from "@react-spring/web";
import {useWidthSwitch} from "../hooks/WidthSwitch";
import {BP_LARGE, TESTING} from "../util/util";
import CSS from "../styles/Github.module.scss";
import {useAppStore} from "../util/app_context";
import Repository from "./Repository";

const springConfig = {
  ...config.default,
  mass: 1,
  tension: 500,
  friction: 50,
};

export default function Github({visible}: Readonly<{visible?: boolean}>): JSX.Element {
  const store = useAppStore();
  const isScreenLarge = useWidthSwitch({breakPoint: BP_LARGE});
  const gotPinnedRepos = store.pinnedRepos.length > 0;
  const trail = useTrail(store.pinnedRepos.length, {
    immediate: TESTING,
    config: springConfig,
    opacity: isScreenLarge || visible ? 1 : 0,
    transform: isScreenLarge || visible ? "translate(0px, 0px) scale(1)" : "translate(-32px, -32px) scale(0.8)",
  });

  return (
    <div className={`${CSS.container} ${gotPinnedRepos ? CSS.containerSizes : ""}`}>
      {gotPinnedRepos && (
        <div className={CSS.innerContainer}>
          {store.pinnedRepos.map((repo, i) => (
            <Repository key={i} repo={repo} animProps={trail[i]} />
          ))}
        </div>
      )}
    </div>
  );
}
