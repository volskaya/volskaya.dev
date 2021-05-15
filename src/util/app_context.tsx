import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {MouseNotification} from "../widgets/MouseAttachment";
import {Repo} from "./github_utils";
import {getStorageBool} from "./util";

const AppContext = createContext({
  repos: [] as Repo[],
  pinnedRepos: [] as Repo[],
  grainOn: false,
  setGrainOn: ((to: boolean) => console.log(to)) as Dispatch<SetStateAction<boolean>>,
  log: [] as MouseNotification[],
  setLog: (state: []) => console.log(state),
  addToLog: (message: MouseNotification | string) => console.log(message),
  extended: false,
});

export const useAppStore = () => useContext(AppContext);
const lastGrainState = getStorageBool("grain");

export function AppStoreProvider({
  repos,
  pinnedRepos,
  children,
}: Readonly<{
  repos: Repo[];
  pinnedRepos: Repo[];
  children: ReactNode;
}>) {
  const [log, setLog] = useState<MouseNotification[]>(() => []);
  const [extended, setExtended] = useState(false);
  const [grainOn, setGrainOn] = useState(lastGrainState === undefined ? true : lastGrainState);
  const scrollEvent = () => setExtended(window.scrollY > window.innerHeight * 0.25);
  const addToLog = (message: MouseNotification | string) =>
    setLog((state) => [...state, typeof message === "string" ? {message} : message]);

  useEffect(() => {
    const grainState = getStorageBool("grain");
    if (grainState !== undefined && grainOn !== grainState) setGrainOn(grainState);

    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, []);

  const value = {
    repos: repos ?? [],
    pinnedRepos: pinnedRepos ?? [],
    grainOn,
    setGrainOn,
    log,
    setLog,
    addToLog,
    extended,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
