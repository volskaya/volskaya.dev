import App from "./app";
import {GITHUB_API, GITHUB_RAW, USERNAME} from "./util";

export type Repo = {
  id: number;
  name: string;
  language: string;
  fade: boolean;
  topics: string[];
};

export type GithubFile = {
  content?: string; // Only on regular files.
  encoding?: string; // Only on regular files.
  download_url: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  url: string;
  repo: string;
  parentPath: string;
};

export type ReqProps = {
  repo: string;
  path?: string;
  onError?: (e: any) => void;
};

const cache = {};

export async function fetchFile({repo, path, onError}: Readonly<ReqProps>): Promise<string | undefined> {
  if (!path) return undefined;

  try {
    const res: any = cache[repo + path]
      ? cache[repo + path]
      : await App.github.get(`${GITHUB_API}/repos/${USERNAME}/${repo}/contents/${path}`);

    if (res.status === 200) {
      if (!cache[repo + path]) cache[repo + path] = res;
      return atob(res.data.content);
    }
  } catch (e) {
    if (onError) onError(e);
  }

  return undefined;
}

export async function getFileList({repo, path = ""}: Readonly<ReqProps>): Promise<GithubFile[]> {
  try {
    const res: any = cache[repo + path]
      ? cache[repo + path]
      : await App.github.get(`${GITHUB_API}/repos/${USERNAME}/${repo}/contents/${path || ""}`);

    if (res.status === 200) {
      if (!cache[repo + path]) cache[repo + path] = res;
      return res.data as GithubFile[];
    }
  } catch (_) {}

  return [];
}

export async function getRepoList(): Promise<Repo[]> {
  try {
    const res = await App.githubPrivate.get(`${GITHUB_API}/users/${USERNAME}/repos`, {
      data: {per_page: 100, sort: "updated"},
    });
    const data = res.status === 200 ? (res.data as Repo[]) : [];

    // Get topics for the returned repos.
    const promises = data.map(async (v) => {
      let topics = v.topics || [];

      if (!topics.length) {
        console.log(`Fetching topics of ${v.name} from ${GITHUB_API}/repos/${USERNAME}/${v.name}/topics`);

        try {
          const topicsRes = await App.githubPrivate.get(`${GITHUB_API}/repos/${USERNAME}/${v.name}/topics`, {
            headers: {Accept: "application/vnd.github.mercy-preview+json"},
          });
          const topicsData = topicsRes.status === 200 ? (topicsRes.data as {names: string[]}) : {names: []};

          topics = topicsData.names;

          if (topics.length) {
            console.log(`${v.name} got topics (${typeof topics}) - ${topics.join(", ")}`);
          }
        } catch (e) {
          console.error(`Failed to get topics for ${v.name} - ${e}`);
        }
      } else {
        console.log(`${v.name} was already fetched with its topics - ${topics}`);
      }

      return {
        id: v.id || null,
        name: v.name || null,
        language: v.language || null,
        fade: v.fade || null,
        topics,
      } as Repo;
    });

    return Promise.all(promises);
  } catch (e) {
    try {
      console.error(`Failed to get repository list - ${e.response.data.message} `);
    } catch (_) {
      console.error(e);
    }
  }

  return [];
}

export function getReadmeasync(repo: string): Promise<string | undefined> {
  return fetchFile({repo, path: "README.md"});
}

// NOTE: No extension, at the end.
export function getAvatarUrl(repoName: string): string {
  return `${GITHUB_RAW}/${USERNAME}/${repoName}/master/.data/avatar.`;
}
