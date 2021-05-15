import React from "react";
import {
  fireEvent,
  render,
  waitForElement,
  cleanup,
  waitForDomChange,
  wait
} from "react-testing-library";
import Masthead from "./Masthead";

afterEach(cleanup);

describe("<Masthead />", () => {
  // Theres a weird null act error
  console.error = () => {};

  test("Renders container", () => {
    render(<Masthead />);
  });

  test("Has Masthead buttons", () => {
    const { getByTestId } = render(<Masthead />);
    const contactForm = getByTestId("button-contact-form");
    const readMore = getByTestId("button-read-more");

    expect(contactForm).toBeTruthy();
    expect(readMore).toBeTruthy();
  });

  test("Starts with View.LESS view", () => {
    const { container } = render(<Masthead />);

    expect(container.innerHTML).toContain("Hello, I'm");
    expect(container.innerHTML).toContain("a self taught developer");
    expect(container.innerHTML).not.toContain("have been coding for almost");
  });

  test('Clicking "Read More" switches to View.MORE view', async () => {
    expect.assertions(4);

    const { container, getByTestId } = render(<Masthead />);
    const readMore = getByTestId("button-read-more");

    fireEvent.click(readMore);
    await waitForElement(() => getByTestId("masthead-more"));

    expect(container.innerHTML).toContain("a self taught developer");
    expect(container.innerHTML).toContain("have been coding for almost");
    expect(container.innerHTML).toContain("Hello"); // Animation hasn't faded out yet

    // Animation fades out previous element
    await wait(() => expect(container.innerHTML).not.toContain("Hello"));
  });

  test('Clicking "Contact Form" switches to View.CONTACT view', async () => {
    const { container, getByTestId } = render(<Masthead />);
    const contactForm = getByTestId("button-contact-form");

    expect(contactForm).toBeTruthy();

    fireEvent.click(contactForm);
    await waitForElement(() => getByTestId("contact-form"));

    expect(container.innerHTML).toContain("Contact me");
    expect(container.innerHTML).toContain("Hello"); // Animation hasn't faded out yet

    // Animation fades out previous element
    await wait(() => expect(container.innerHTML).not.toContain("Hello"));
  });

  test('Closing "Contact Form" returns you to View.LESS view', async () => {
    const { container, getByTestId } = render(<Masthead />);
    const contactForm = getByTestId("button-contact-form");

    expect(contactForm).toBeTruthy();

    fireEvent.click(contactForm);
    await waitForElement(() => getByTestId("contact-form"));
    await waitForDomChange({ container });

    const cancelButton = getByTestId("button-contact-form-cancel");
    expect(cancelButton).toBeTruthy();
    expect(container.innerHTML).toContain("Contact me");
    expect(container.innerHTML).not.toContain("Hello");

    fireEvent.click(cancelButton);
    await waitForElement(() => getByTestId("masthead-both"));
    await wait(() => {
      expect(container.innerHTML).not.toContain("Contact me");
      expect(container.innerHTML).toContain("Hello");
    });
  });
});
