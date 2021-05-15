import Axios, {AxiosInstance} from "axios";
import {GITHUB_API} from "./util";

export default class App {
  private static cachedGithubPrivate: AxiosInstance | undefined;
  private static cachedGithub: AxiosInstance | undefined;

  static get githubPrivate(): AxiosInstance {
    if (App.cachedGithubPrivate === undefined) {
      App.cachedGithubPrivate = Axios.create({baseURL: GITHUB_API});
      App.cachedGithubPrivate.defaults.headers.common["Accept"] = `application/vnd.github.v3+json`;

      if (process.env.GITHUB_API_TOKEN) {
        App.cachedGithubPrivate.defaults.headers.common["Authorization"] = `token ${process.env.GITHUB_API_TOKEN}`;
        console.log("Using a Github token");
      } else {
        console.log(`GITHUB_API_TOKEN token was not set (${process.env.GITHUB_API_TOKEN})`);
      }
    }

    return App.cachedGithubPrivate;
  }

  static get github(): AxiosInstance {
    if (App.cachedGithub === undefined) {
      App.cachedGithub = Axios.create({baseURL: GITHUB_API});
      App.cachedGithub.defaults.headers.common["accept"] = `application/vnd.github.v3+json`;
    }
    return App.cachedGithub;
  }
}
