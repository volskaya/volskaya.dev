import {ChangeEvent, ReactNode, useContext, useRef, useState} from "react";
import {MailStatus, sendMail} from "../util/mail_utils";
import {EMAIL, PurpleWrap, STRING_CONTACT_ERROR, STRING_CONTACT_SUCCESS, USERNAME} from "../util/util";
import FormCSS from "../styles/ContactForm.module.scss";
import CSS from "../styles/Masthead.module.scss";
import GithubButton from "./GithubButton";
import {MastheadContext} from "./Masthead";
import {NotifyType} from "./MouseAttachment";
import {useAppStore} from "../util/app_context";

export function Title({children}: {children?: ReactNode}): JSX.Element {
  return (
    <div className={CSS.title}>
      {children}
      <div className={CSS.line} />
    </div>
  );
}

export function Both(): JSX.Element {
  return (
    <p data-testid="masthead-both" className={CSS.about}>
      I'm just a software developer. Nowadays I focus on mobile and work with{" "}
      <PurpleWrap>Flutter & Firebase</PurpleWrap>.
    </p>
  );
}

export function More({
  emailRef,
  emailOnClick,
}: Readonly<{
  emailRef: React.RefObject<HTMLDivElement>;
  emailOnClick?: () => void;
}>): JSX.Element {
  return (
    <>
      <p className={CSS.about} data-testid="masthead-more">
        If you have a remote position and you're looking to onboard a developer, please throw me an{" "}
        <GithubButton href={`mailto:${EMAIL}`} className={CSS.purpleWrapButton}>
          <PurpleWrap>email</PurpleWrap>
        </GithubButton>
        . I'm always interested in new opportunities, whether it's in mobile, web, back-end or whatever.
      </p>
      <div className={CSS.contactInfo}>
        <GithubButton className={CSS.buttonStyle} onClick={emailOnClick}>
          <span ref={emailRef}>{EMAIL}</span>
        </GithubButton>
        <GithubButton href={`https://github.com/${USERNAME}`} className={CSS.buttonStyle}>
          github.com/{USERNAME}
        </GithubButton>
      </div>
    </>
  );
}

export function ContactForm(): JSX.Element {
  const mastheadContext = useContext(MastheadContext);
  const store = useAppStore();
  const emailRef = useRef("");
  const messageRef = useRef("");
  const [email, _setEmail] = useState("");
  const setEmail = (event: ChangeEvent<HTMLInputElement>) => {
    _setEmail(event.target.value);
    emailRef.current = event.target.value;
  };

  const [message, _setMessage] = useState("");
  const setMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    _setMessage(event.target.value);
    messageRef.current = event.target.value;
  };

  const closeForm = () => {
    _setEmail("");
    _setMessage("");
    mastheadContext.resetView();
  };

  const submitForm = async () => {
    const mailStatus = await sendMail({
      email: emailRef.current,
      message: messageRef.current,
    });

    store.addToLog(
      mailStatus === MailStatus.SUCCESS
        ? {
            message: STRING_CONTACT_SUCCESS,
            type: NotifyType.GREEN,
          }
        : {
            message: STRING_CONTACT_ERROR,
            type: NotifyType.RED,
          }
    );

    closeForm();
  };

  return (
    <div data-testid="contact-form" className={FormCSS.container}>
      <div className={FormCSS.formContainer}>
        <input
          className={FormCSS.inputField}
          value={email}
          onChange={setEmail}
          type="text"
          name="email"
          placeholder="Optional Email Address"
        />
        <textarea
          className={FormCSS.messageField}
          rows={9}
          value={message}
          onChange={setMessage}
          name="message"
          placeholder="Message"
        />
        <div className={FormCSS.buttonRow}>
          <GithubButton testId="button-contact-form-cancel" className={FormCSS.buttonStyle} onClick={closeForm}>
            Cancel
          </GithubButton>
          <GithubButton testId="button-contact-form-send" className={FormCSS.buttonStyle} onClick={submitForm}>
            Send
          </GithubButton>
        </div>
      </div>
    </div>
  );
}
