import React from "react";
import CSS from "../styles/CodeView.module.scss";
import ReactMarkdown from "react-markdown";
import Gfm from "remark-gfm";
import {
  codeRenderer,
  emphasisRenderer,
  headingRenderer,
  imageRenderer,
  linkRenderer,
  listRenderer,
  paragraphRenderer,
} from "../util/markdown_renderers";

export default function Markdown({children}: {children: any}): JSX.Element {
  return (
    <ReactMarkdown
      skipHtml={false}
      plugins={[Gfm]}
      className={CSS.markdownContainer}
      disallowedElements={["thead"]}
      components={{
        p: paragraphRenderer,
        img: imageRenderer,
        code: codeRenderer,
        h1: headingRenderer,
        h2: headingRenderer,
        h3: headingRenderer,
        h4: headingRenderer,
        h5: headingRenderer,
        h6: headingRenderer,
        em: emphasisRenderer,
        strong: emphasisRenderer,
        pre: emphasisRenderer,
        a: linkRenderer,
        ol: listRenderer,
        ul: listRenderer,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
