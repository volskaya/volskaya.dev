import Axios from "axios";
import React, {useEffect, useState} from "react";
import CSS from "../styles/LazyAvatar.module.scss";
import CodeBranch from "../svg/CodeBranch";
import {getAvatarUrl, Repo} from "../util/github_utils";

enum Ext {
  NONE = "",
  JPG = "jpg",
  GIF = "gif",
}

const supportedExtensions = [Ext.JPG, Ext.GIF];
const avatarCache = new WeakMap<object, {ext: Ext; promise?: Promise<Ext>}>();

const lazyFindAvatar = async (repo: Repo): Promise<Ext> => {
  const cache = avatarCache.get(repo);

  if (cache && cache.promise) {
    return cache.promise;
  } else {
    const promise: Promise<Ext> = new Promise(async (resolve) => {
      const url = getAvatarUrl(repo.name);

      for (const ext of supportedExtensions) {
        try {
          const data: any | undefined = (await Axios.get(url + ext)).data;

          if (data) {
            avatarCache.set(repo, {
              ext,
              promise,
            });

            resolve(ext);
            break;
          }
        } catch (e) {} // File not found.
      }

      // If nothing found, then just return Ext.NONE for all further requests.
      resolve(Ext.NONE);
    });

    avatarCache.set(repo, {
      ext: Ext.NONE,
      promise,
    });

    return promise;
  }
};

export default function LazyAvatar({repo}: Readonly<{repo: Repo}>): JSX.Element {
  const [url] = useState(() => getAvatarUrl(repo.name));
  const [loaded, setLoaded] = useState(Ext.NONE);

  // Attempt to fetch .jpg, .gif.
  useEffect(() => {
    const cache = avatarCache.get(repo);

    if (cache && !cache.promise) {
      setLoaded(cache.ext);
    } else {
      lazyFindAvatar(repo).then(setLoaded);
    }
  }, []);

  return (
    <div className={CSS.container}>
      <CodeBranch />
      <div
        className={CSS.imageFrame}
        style={{
          opacity: loaded ? 1 : 0,
          backgroundImage: loaded !== Ext.NONE ? `url('${url + loaded}')` : undefined,
        }}
      />
    </div>
  );
}
