import {useRef} from "react";

export const copyNodeSelection = (ref: React.RefObject<any>, callback?: () => void): void => {
  if (ref.current) {
    try {
      const selection = document.getSelection();

      if (selection) {
        const range = document.createRange();

        range.selectNodeContents(ref.current);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();

        if (callback) {
          callback();
        }
      }
    } catch (_) {} // Do nothing.
  }
};

export const useCopyNode = ({
  callback,
}: Readonly<{callback?: () => void}>): [React.RefObject<HTMLDivElement>, () => void] => {
  const emailRef = useRef<HTMLDivElement>(null);
  const copyEmail = () => copyNodeSelection(emailRef, callback);

  return [emailRef, copyEmail];
};
