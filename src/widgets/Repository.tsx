import {hsl as HSL} from "d3-color";
import React, {useEffect, useState} from "react";
import {animated} from "@react-spring/web";
import {LANGUAGE_COLORS, LANGUAGE_PLACEHOLDER} from "../util/util";
import CSS from "../styles/Repository.module.scss";
import GithubButton from "./GithubButton";
import LazyAvatar from "./LazyAvatar";
import {Repo} from "../util/github_utils";

export default function Repository({
  repo,
  animProps,
}: Readonly<{
  repo: Repo;
  animProps: any;
}>): JSX.Element {
  const [color, setColor] = useState(LANGUAGE_COLORS[repo.language] || LANGUAGE_PLACEHOLDER);

  useEffect(() => {
    const linguistProp = LANGUAGE_COLORS[repo.language];
    const newColor = linguistProp || LANGUAGE_PLACEHOLDER;

    if (newColor !== color) {
      const hsl = HSL(newColor);
      hsl.s -= 0.4;

      setColor(hsl.brighter(0.3).toString());
    }
  }, []);

  return (
    <GithubButton className={CSS.buttonContainer} repoName={repo.name}>
      <animated.div className={CSS.willChange} style={animProps}>
        <div className={CSS.innerContainer}>
          <div className={CSS.avatarFrame}>
            <LazyAvatar repo={repo} />
          </div>

          <div className={CSS.textContainer}>
            <div className={CSS.nameStyle}>{repo.name.replace("-", "_") /* TODO: Remove .replace */}</div>

            <div className={CSS.row}>
              <div className={CSS.langIcon} style={{backgroundColor: color}} />
              <div className={CSS.langStyle}>{repo.language || "Multi-lingual"}</div>
            </div>
          </div>
        </div>
      </animated.div>
    </GithubButton>
  );
}
