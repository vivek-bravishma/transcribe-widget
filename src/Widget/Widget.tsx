import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import Chat from "../components/Chat";

class ChatComp extends HTMLElement {
  connectedCallback() {
    render(createElement(Chat), this);
  }

  disconnectedCallback() {
    unmountComponentAtNode(Chat as any);
  }
}

customElements.define("voice-call-transcription", ChatComp);
