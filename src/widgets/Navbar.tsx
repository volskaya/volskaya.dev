import {CSSProperties, MouseEvent, RefObject, useState} from "react";
import {animated, useChain, useSpring, useSpringRef} from "@react-spring/web";
import useMeasure from "react-use-measure";
import {EMAIL, GITHUB, MATERIAL_GRAY_700, MATERIAL_GRAY_800, MOBILE_DETECTION, TESTING, USERNAME} from "../util/util";
import CSS from "../styles/Navbar.module.scss";
import {useAppStore} from "../util/app_context";
import {useRouter} from "next/router";
import {useCopyNode} from "../hooks/CopyNode";
import {getRoute, Routes} from "../util/router";
import {useFontObserver} from "../hooks/FontObserver";
import GithubButton from "./GithubButton";
import NewbieTip from "./NewbieTip";
import {Arrow3 as Arrow} from "../svg/Arrows";
import {Repo} from "../util/github_utils";
import GithubIcon from "../svg/GithubIcon";
import GrainIcon from "../svg/GrainIcon";

function Text({
  children,
  className,
  style,
  title,
  onClick,
  innerRef,
}: Readonly<{
  children: string | JSX.Element | JSX.Element[];
  className?: string;
  style?: CSSProperties;
  title?: string;
  onClick?: (event?: MouseEvent) => void;
  innerRef?: RefObject<HTMLDivElement>;
}>): JSX.Element {
  const childrenIsString = typeof children === "string";

  return (
    <div
      onClick={onClick}
      className={className || CSS.textFrame}
      style={style}
      title={title}
      ref={!childrenIsString ? innerRef : undefined}
    >
      {childrenIsString ? (
        <div className={CSS.text} ref={innerRef}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

const Line: JSX.Element = (
  <Text>
    <div
      style={{
        width: 2,
        height: 16,
        backgroundColor: MATERIAL_GRAY_700,
        margin: 16,
      }}
    />
  </Text>
);

export default function Navbar() {
  const router = useRouter();
  const store = useAppStore();
  const [menuRef, menuMeasurements] = useMeasure();
  const [homeButtonRef, homeButtonMeasurements] = useMeasure();
  const [lowerHalfRef, lowerHalfMeasurements] = useMeasure();
  const navSpringRef = useSpringRef();
  const menuSpringRef = useSpringRef();
  const [_, setRedraws] = useState(0);
  const incrementRedraws = () => setRedraws((v) => v + 1);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomeRoute = getRoute(router) === Routes.home;
  const toggleMenu = () => setMenuOpen((state) => !state);
  const toggleGrain = () => {
    store.addToLog({message: "Toggled grain"});
    store.setGrainOn((state) => {
      localStorage.setItem("grain", !state ? "true" : "false");
      return !state;
    });
  };
  const didNavigate = () => setMenuOpen(false);
  const [emailRef, copyEmail] = useCopyNode({
    callback: () => store.addToLog("Copied email to clipboard"),
  });
  const goToGithub = () => {
    didNavigate();
    window.open(`${GITHUB}/${USERNAME}`);
  };
  const goHome = () => {
    didNavigate();
    if (router) router.push("/");
  };

  const onMouseLeaveMenu = () => {
    if (!MOBILE_DETECTION.mobile && hasNavigated) {
      setMenuOpen(false);
      setHasNavigated(false);
    }
  };

  const navSpring = useSpring({
    immediate: TESTING,
    ref: navSpringRef,
    paddingBottom: menuOpen ? 16 : 0,
    paddingTop: menuOpen ? 16 : 0,
    x: menuOpen ? menuMeasurements.height : 0,
    o: menuOpen ? 0 : 1, // Lower portion opacity.
    zo: menuOpen ? 1 : 0, // Github button opacity.
    bo: isHomeRoute ? 0 : 1,
    homeHeight: !isHomeRoute ? homeButtonMeasurements.height : 0,
    homeOpacity: !isHomeRoute ? 1 : 0,
    containerTransform: `translateY(${menuOpen ? Math.round(lowerHalfMeasurements.height / 2) : 0}px)`,
  });

  const menuSpring = useSpring({
    immediate: TESTING,
    ref: menuSpringRef,
    transform: `translateX(-${menuOpen ? 100 : 0}%)`,
  });

  useChain(menuOpen ? [navSpringRef, menuSpringRef] : [menuSpringRef, navSpringRef], [0, 0.25]);
  useFontObserver({onLoad: incrementRedraws, onError: incrementRedraws});

  return (
    <div className={CSS.container}>
      <animated.div style={{transform: navSpring.containerTransform}} className={CSS.innerContainer}>
        <GithubButton className={CSS.navButton} onClick={copyEmail} title="Copy to clipboard" callback={didNavigate}>
          <div className={CSS.notificationContainer}>
            <NewbieTip
              prefixElem={<Arrow className={CSS.notificationArrow} color={MATERIAL_GRAY_800} style={{width: 56}} />}
            >
              Click to copy to clipboard
            </NewbieTip>
          </div>
          <Text innerRef={emailRef}>{EMAIL}</Text>
        </GithubButton>
        {Line}

        {/* Nav menu */}
        <animated.div style={{height: navSpring.x}} className={CSS.menuPlaceholder}>
          <animated.div ref={menuRef} style={menuSpring} className={CSS.menuContainer} onMouseLeave={onMouseLeaveMenu}>
            <div className={CSS.menuInnerContainer}>
              <GithubButton className={CSS.menuItem} onClick={goHome}>
                HOME
              </GithubButton>
              <div>
                <span
                  style={{
                    color: MATERIAL_GRAY_700,
                    transform: "scale(0.8)",
                    marginLeft: 8,
                  }}
                >
                  Github
                </span>
                <div className={CSS.menuRows}>
                  {store!.repos.map((repo: Repo, i) => (
                    <GithubButton repoName={repo.name} callback={didNavigate} key={i} className={CSS.menuItem}>
                      {repo.name.replaceAll("-", "_")}
                    </GithubButton>
                  ))}
                </div>
              </div>
            </div>
          </animated.div>
        </animated.div>

        <GithubButton className={CSS.navButton} onClick={toggleMenu} title="Toggle nav menu">
          <animated.div style={{opacity: navSpring.zo}} className={CSS.background} />
          <animated.div
            className={CSS.textFrame}
            style={{
              paddingBottom: navSpring.paddingBottom,
              paddingTop: navSpring.paddingTop,
            }}
          >
            <div className={CSS.text}>Nav</div>
          </animated.div>
        </GithubButton>

        <animated.div
          style={{
            height: navSpring.homeHeight,
            opacity: navSpring.homeOpacity,
            width: "100%",
          }}
        >
          <div ref={homeButtonRef}>
            {Line}

            <GithubButton className={CSS.navButton} onClick={goHome} title="Return home">
              <div className={CSS.textFrame}>
                <div className={CSS.text}>Home</div>
              </div>
            </GithubButton>
          </div>
        </animated.div>

        {/* Lower half, which is made invisible, when menu rolls out */}
        {!MOBILE_DETECTION.mobile && (
          <>
            <animated.div style={{opacity: navSpring.o, width: "100%"}}>
              <div ref={lowerHalfRef}>
                {Line}
                <GithubButton className={CSS.navButton} onClick={goToGithub} title="Open Github in a new tab">
                  <div className={CSS.textFlex}>
                    <Text>Github</Text>
                    <GithubIcon className={CSS.githubIconContainer} />
                  </div>
                </GithubButton>

                {Line}
                <GithubButton className={CSS.navButton} onClick={toggleGrain} title="Toggle animated grain overlay">
                  <Text>
                    <GrainIcon
                      style={{
                        width: 24,
                        height: 24,
                        transform: "rotate(90deg)",
                      }}
                    />
                  </Text>
                </GithubButton>
              </div>
            </animated.div>
          </>
        )}
      </animated.div>
    </div>
  );
}
