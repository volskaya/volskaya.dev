import CSS from "../styles/Landing.module.scss";
import {useAppStore} from "../util/app_context";
import Github from "./Github";
import HomeOverlay from "./HomeOverlay";
import Masthead from "./Masthead";

export default function Landing(): JSX.Element {
  // Whether the github view is toggle on, since its hidden
  // on smaller screens.
  const store = useAppStore();

  return (
    <div className={CSS.container}>
      <div className={CSS.cell}>
        <Masthead />
      </div>
      <Github visible={store.extended} />
      {/* {!!store.pinnedRepos.length ? <Github visible={store.extended} /> : <div style={{width: "50%"}} />} */}
      <HomeOverlay />
    </div>
  );
}
