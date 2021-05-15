import {animated, useSpring} from "@react-spring/web";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {AppStoreProvider, useAppStore} from "../util/app_context";
import {isRepoRoute} from "../util/router";
import {BP_EXTRA_LARGE, PINNED_REPOS, TESTING} from "../util/util";
import CSS from "../styles/App.module.scss";
import Grain from "../widgets/Grain";
import MouseAttachment from "../widgets/MouseAttachment";
import TriangleOverlay from "../widgets/TriangleOverlay";
import Landing from "../widgets/Landing";
import CodeView from "../widgets/CodeView";
import Navbar from "../widgets/Navbar";
import Sidebar from "../widgets/Sidebar";
import Ripple from "../widgets/Ripple";
import GradientOverlay from "../widgets/GradientOverlay";
import {getRepoList, Repo} from "../util/github_utils";
import {GetStaticProps} from "next";

type Props = {
  repos: Repo[];
  pinnedRepos: Repo[];
};

const useShieldHideEffect = () =>
  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById("landingContainer");

      if (container) {
        container.style.opacity = "0";
        setTimeout(() => container.parentNode!.removeChild(container), 500);
      }
    }, 500);
  }, []);

export const getStaticProps: GetStaticProps<Props> = async (_) => {
  const repos = await getRepoList();
  const pinnedRepos = repos.filter((repo) => PINNED_REPOS.has(repo.name));
  return {props: {repos, pinnedRepos}};
};

export default function Index(props: Props): JSX.Element {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [rippleHidden, setRippleHidden] = useState(false);
  const rippleSpring = useSpring({
    opacity: loaded || rippleHidden ? 0 : 1,
    delay: 250,
    onRest: () => setRippleHidden(true),
    config: {duration: 250},
  });

  useEffect(() => setLoaded(true));

  return (
    <>
      {router.isReady && loaded && (
        <AppStoreProvider {...props}>
          <Home />
        </AppStoreProvider>
      )}
      {!rippleHidden && (
        <animated.div style={rippleSpring} className={CSS.loadingContainer}>
          <Ripple />
        </animated.div>
      )}
    </>
  );
}

export function Home(): JSX.Element {
  const store = useAppStore();
  const router = useRouter();
  const isGithubRoute = isRepoRoute(router);
  const [, setRedraws] = useState(0);
  const incrementRedraws = () => setRedraws((v) => v + 1);

  const breakPoint = BP_EXTRA_LARGE;
  const [width, setWidth] = useState(
    window.innerWidth >= breakPoint ? Math.round(window.innerWidth / 2) : window.innerWidth
  );
  const recalculateWidth = () =>
    setWidth(window.innerWidth >= breakPoint ? Math.round(window.innerWidth / 2) : window.innerWidth);

  const githubSpring = useSpring({
    immediate: TESTING,
    transform: `translateX(${isGithubRoute ? width : 0}px)`,
  });

  useShieldHideEffect();
  useEffect(() => {
    window.addEventListener("resize", incrementRedraws);
    window.addEventListener("orientationchange", incrementRedraws);
    window.addEventListener("resize", recalculateWidth);
    return () => {
      window.removeEventListener("resize", incrementRedraws);
      window.removeEventListener("orientationchange", incrementRedraws);
      window.removeEventListener("resize", recalculateWidth);
    };
  }, []);

  return (
    <>
      <div className={CSS.landingContainer}>
        <animated.div style={githubSpring}>
          <Landing />
          <TriangleOverlay />
        </animated.div>
      </div>

      <animated.div style={githubSpring} className={CSS.codeViewContainer}>
        <CodeView />
      </animated.div>

      <Navbar />
      <Sidebar visible={!store.extended && !isGithubRoute} />

      {GradientOverlay}

      <Grain toggle={store.grainOn} />
      <MouseAttachment />
    </>
  );
}
