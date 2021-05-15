import GithubButton from "../widgets/GithubButton";
import CSS from "../styles/MarkdownRenderers.module.scss";
import {
  CodeComponent,
  HeadingComponent,
  NormalComponent,
  OrderedListComponent,
  ReactBaseProps,
  ReactMarkdownProps,
  UnorderedListComponent,
} from "react-markdown/src/ast-to-react";

const headerStyles = {
  1: CSS.titleStyle,
  2: CSS.titleStyle,
  3: CSS.titleStyle,
  4: CSS.titleStyle,
  5: CSS.titleStyle,
  6: CSS.captionStyle,
};

// Image.
export const imageRenderer: NormalComponent = ({src, alt}) => (
  <div className={CSS.imageFrame}>
    <img src={src as string} alt={alt as string} width="80%" />
  </div>
);

// Paragraph.
export const paragraphRenderer: NormalComponent = ({children}) =>
  // Only wrap in paragraph, if children contain no images.
  children.find((child: any) => typeof child === "object" && child.key && !!child.key.match(/image/g)) ? (
    children
  ) : (
    <p>{children}</p>
  );

// Code.
export const codeRenderer: CodeComponent = (props) =>
  props.inline ? (
    <code className={CSS.inlineCode}>{props.children}</code>
  ) : (
    <div className={CSS.codeStyle}>
      <code>{props.children}</code>
    </div>
  );

// Header.
export const headingRenderer: HeadingComponent = ({children, level}) => (
  <div className={headerStyles[level]} style={level === 6 ? {marginBottom: 0} : {}}>
    {children}
  </div>
);

// Emphasis.
export const emphasisRenderer: NormalComponent = (props) => {
  const renderingCode = props.node.children.length && props.node.children[0].tagName === "code";
  return <span className={`${CSS.emphasisStyle} ${renderingCode ? CSS.emphasisOnCode : ""}`}>{props.children}</span>;
};

// Link.
export const linkRenderer: NormalComponent = ({href, children}) => (
  <GithubButton className={CSS.linkButton} href={href as string}>
    {children}
  </GithubButton>
);

// List.
export const listRenderer: UnorderedListComponent & OrderedListComponent = (props) =>
  props.ordered ? <ol>{props.children}</ol> : <ul>{props.children}</ul>;
