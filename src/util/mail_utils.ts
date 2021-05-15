import Axios from "axios";

export enum MailStatus {
  SUCCESS,
  ERROR,
}

export async function sendMail({
  email,
  message,
}: Readonly<{
  email?: string;
  message?: string;
}>): Promise<MailStatus> {
  const form = new FormData();

  form.set("email", email || "No email");
  form.set("message", message || "No message");

  try {
    const res = await Axios.post("https://jumprock.co/mail/volskaya", form, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    return res.status === 200 && res.data.status === "success" ? MailStatus.SUCCESS : MailStatus.ERROR;
  } catch (e) {
    return MailStatus.ERROR;
  }
}
