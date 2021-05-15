import {NextRouter} from "next/router";

export enum Routes {
  home = "0",
  github = "1",
}

export type GithubRoute = {
  repo: string;
  p?: string;
};

export type RouteFix = {
  name: string;
  params: {
    repo?: string;
    p?: string; // Path, relative to the repo.
  };
};

export function getRoute(router: NextRouter): Routes {
  if (router.query.repo) return Routes.github;
  return Routes.home;
}

export function isRepoRoute(router: NextRouter): boolean {
  return getRoute(router) === Routes.github;
}

export function getRepoRoute(router: NextRouter): string | undefined {
  return isRepoRoute(router) ? (router.query.repo as string) : undefined;
}

export function getGithubRoute(router: NextRouter): GithubRoute | undefined {
  return isRepoRoute(router)
    ? ({
        repo: router.query.repo as string,
        p: router.query.p as string | undefined,
      } as GithubRoute)
    : undefined;
}
