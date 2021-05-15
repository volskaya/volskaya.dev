import React, {useEffect, useRef, useState} from "react";
import {animated, useTrail, useTransition} from "@react-spring/web";
import {useCopyNode} from "../hooks/CopyNode";
import {useFontObserver} from "../hooks/FontObserver";
import {useWheelSwitch} from "../hooks/WheelSwitch";
import CSS from "../styles/Masthead.module.scss";
import GithubButton from "./GithubButton";
import {Both, ContactForm, More, Title} from "./MastheadHocs";
import {useRouter} from "next/router";
import {getRoute, Routes} from "../util/router";
import {NAME, TESTING, ENABLE_CONTACT} from "../util/util";
import {useAppStore} from "../util/app_context";

export enum View {
  LESS,
  MORE,
  CONTACT,
}

type Elem = {
  key: number;
  elem: JSX.Element;
};

type State = {
  type: View;
  children: Elem[];
};

const childRefs = new WeakMap<object, HTMLDivElement | undefined>();
const tweenChildHeight = (child: Elem): any => async (next: any) =>
  await next({
    opacity: 1,
    height: childRefs.get(child)!.offsetHeight, // FIXME: Null check
  });

export const MastheadContext = React.createContext({
  type: View.LESS,
  children: [] as Elem[],
  setView: (view: View) => console.log(view),
  resetView: () => console.log(),
});

const useMastheadContext = (): [State, (view: View) => void, () => void] => {
  const views = useViews();
  const [state, _setState] = useState<State>(() => ({
    type: View.LESS,
    children: views[View.LESS],
  }));

  const setState = (view: View) => _setState({type: view, children: views[view]});
  const resetState = () => _setState({type: View.LESS, children: views[View.LESS]});

  return [state, setState, resetState];
};

export default function Masthead(): JSX.Element {
  const router = useRouter();
  const contactLock = useRef(false);
  const [, setRedraws] = useState(0);
  const incrementRedraws = () => setRedraws((v) => v + 1);
  const [view, setView, resetView] = useMastheadContext();
  const onHomeRoute = getRoute(router) === Routes.home;
  const openContact = () => setView(View.CONTACT);
  const [wheelTargetRef, flipToggle, , setToggle] = useWheelSwitch({
    callback: (wheelToggle: boolean) => !contactLock.current && setView(wheelToggle ? View.MORE : View.LESS),
  });

  // Trail.
  const trail = useTrail(view.children.length, {
    immediate: TESTING,
    opacity: onHomeRoute ? 1 : 0,
    from: {opacity: 0},
  });

  // Transition.
  const transitions = useTransition(view.children, {
    immediate: TESTING,
    keys: (item: Elem) => item.key,
    unique: true,
    from: {opacity: 0, height: 0},
    leave: {opacity: 0, height: 0},
    update: tweenChildHeight,
    enter: tweenChildHeight,
  } as any);

  useEffect(() => {
    contactLock.current = view.type === View.CONTACT;
    if (contactLock.current) setToggle(false);
  }, [view.type]);

  useEffect(() => {
    window.addEventListener("resize", incrementRedraws);
    return () => window.removeEventListener("resize", incrementRedraws);
  }, []);

  useFontObserver({onLoad: incrementRedraws, onError: incrementRedraws});

  return (
    <MastheadContext.Provider value={{...view, setView, resetView}}>
      <div data-testid="masthead-container" ref={wheelTargetRef} className={CSS.container}>
        {transitions((style, item, ___, i) => (
          <animated.div key={item.key} style={trail[i]} className={CSS.widthFix}>
            <animated.div style={style} className={CSS.containOverflow}>
              <div ref={(ref) => ref && childRefs.set(item, ref)}>{item.elem}</div>
            </animated.div>
          </animated.div>
        ))}

        <animated.div
          className={CSS.buttonContainer}
          style={{
            ...trail[view.children.length],
            display: view.type === View.LESS || view.type === View.MORE ? "flex" : "none",
          }}
        >
          {ENABLE_CONTACT && (
            <GithubButton testId="button-contact-form" onClick={openContact} className={CSS.readMore}>
              Contact
            </GithubButton>
          )}
          <GithubButton testId="button-read-more" onClick={flipToggle} className={CSS.readMore}>
            {view.type === View.LESS ? "Hire me" : "Read less"}
          </GithubButton>
        </animated.div>
      </div>
    </MastheadContext.Provider>
  );
}

const useViews = (): Record<View, Elem[]> => {
  const store = useAppStore();
  const [emailRef, copyEmail] = useCopyNode({
    callback: () => store.addToLog("Copied email to clipboard"),
  });
  const [lessView] = useState<Elem[]>(() => [
    {
      key: 0,
      elem: (
        <Title>
          <div>
            Hello,
            <br />
            I'm {NAME}
          </div>
        </Title>
      ),
    },
    {
      key: 1,
      elem: <Both />,
    },
  ]);
  const [moreView] = useState<Elem[]>(() => [
    {
      key: 1,
      elem: <Both />,
    },
    {
      key: 2,
      elem: <More emailRef={emailRef} emailOnClick={copyEmail} />,
    },
  ]);
  const [contactView] = useState<Elem[]>(() => [
    {
      key: 3,
      elem: <Title>Contact me</Title>,
    },
    {
      key: 4,
      elem: <ContactForm />,
    },
  ]);

  const viewsRef = useRef({
    [View.LESS]: lessView,
    [View.MORE]: moreView,
    [View.CONTACT]: contactView,
  });

  return viewsRef.current;
};
