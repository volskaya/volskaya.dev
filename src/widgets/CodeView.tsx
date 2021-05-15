import {useRouter} from "next/router";
import React, {useEffect, useState, RefObject} from "react";
import CSS from "../styles/CodeView.module.scss";
import {useAppStore} from "../util/app_context";
import {fetchFile, Repo} from "../util/github_utils";
import {getGithubRoute} from "../util/router";
import {GITHUB, README_FILENAME, USERNAME} from "../util/util";
import GithubButton from "./GithubButton";
import {NotifyType} from "./MouseAttachment";
import NoScrollWrap from "./NoScrollWrap";
import Ripple from "./Ripple";

const Markdown: any = React.lazy(() => import("./Markdown"));

const techBit = `[//]: #tech`;
const getTech = (techBitLine: string): string[] =>
  techBitLine.includes(techBit) ? techBitLine.slice(techBit.length + 2, techBitLine.length - 1).split(",") : [];

export default function CodeView({
  innerRef,
}: Readonly<{innerRef?: RefObject<HTMLDivElement> | ((element: HTMLOrSVGElement | null) => void)}>): JSX.Element {
  const store = useAppStore();
  const router = useRouter();
  const githubRoute = getGithubRoute(router);
  const [repo, setRepo] = useState<Repo | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  // Whether to use syntax highlighting, instead of markdown.
  const [useCode, setUseCode] = useState(false);
  const [tech, setTech] = useState<string[]>(() => []);
  const openInGithub = (event: React.MouseEvent) => {
    event.preventDefault();
    window.open(`${GITHUB}/${USERNAME}/${title}`);
  };

  useEffect(() => {
    if (content && !useCode) setTech(getTech(content.split("\n")[0]));
  }, [content]);

  const topics = tech.length ? tech : repo?.topics ?? [];
  const onError = (e: any) => {
    let apiLimitReached = false;
    try {
      apiLimitReached = e.response.status === 403;
    } catch (_) {}

    // Only react to api limit error.
    if (apiLimitReached) {
      store.addToLog({
        message: apiLimitReached ? "Hourly Github API limit reached" : "Github request failed",
        type: NotifyType.RED,
      });
    }
  };

  useEffect(() => {
    const githubRouteCopy = githubRoute; // Dereference early.

    if (githubRouteCopy) {
      fetchFile({
        repo: githubRouteCopy.repo,
        path: githubRouteCopy.p || README_FILENAME,
        onError,
      }).then((file) => {
        const filename = (githubRouteCopy.p ?? README_FILENAME).split("/").pop() || "";
        const extension = filename.split(".").pop();
        const isMarkdown = extension && extension === "md";

        console.log(store.repos);
        console.log(store.repos.find((v) => v.name === githubRouteCopy.repo));

        setRepo(store.repos.find((v) => v.name === githubRouteCopy.repo));
        setTitle(filename === README_FILENAME ? githubRouteCopy.repo ?? filename : filename);
        setContent(file);
        setUseCode(!isMarkdown);
        setLoaded(true);
      });
    }
  }, [router.asPath]);

  const body = loaded ? (
    <NoScrollWrap>
      <div className={CSS.contentScrollablePadding}>
        {title && !useCode && (
          <GithubButton
            href={`${GITHUB}/${USERNAME}/${title}`}
            className={CSS.titleStyle}
            title="Open repository in Github"
          >
            {title}
          </GithubButton>
        )}

        {!useCode && (
          <div className={CSS.techFrame}>
            {topics.map((val, i) => (
              <div className={CSS.techText} key={i}>
                {val}
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign: "left"}}>
          {content && title ? (
            !useCode ? (
              <React.Suspense fallback={<></>}>
                <Markdown>{content}</Markdown>
              </React.Suspense>
            ) : (
              {content}
            )
          ) : (
            title && (
              <div className={CSS.notFoundContainer}>
                {githubRoute?.p ?? "Repository"} not found!
                <br />
                <a href={`${GITHUB}/${USERNAME}/${title}`} onClick={openInGithub}>
                  View open the repository on Github
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </NoScrollWrap>
  ) : undefined;

  return (
    <div className={CSS.container} ref={innerRef}>
      <div className={CSS.contentFrame}>{body ?? <Ripple center={true} />}</div>
    </div>
  );
}
