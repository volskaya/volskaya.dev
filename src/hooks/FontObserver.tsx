import {useEffect} from "react";
import FontFaceObserver from "fontfaceobserver";
import {MAIN_FONT} from "../util/util";

export const useFontObserver = ({onLoad, onError}: {onLoad?: () => void; onError?: () => void}) =>
  useEffect(() => {
    new FontFaceObserver(MAIN_FONT, {weight: 500})
      .load()
      .then(() => onLoad && onLoad())
      .catch(() => onError && onError());
  }, []);
