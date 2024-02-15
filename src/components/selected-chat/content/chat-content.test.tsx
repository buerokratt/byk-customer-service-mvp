import React from "react";
import { render } from "../../../utils/test.utils";
import ChatContent from "./chat-content";
import { Chat } from "../../../model/chat.model";
import { CHAT_STATUS } from "../../../utils/constants";

describe("SelectedChat component", () => {
  const selectedChat: Chat = {
    id: "404",
    status: CHAT_STATUS.OPEN,
    lastMessage: "No messages",
    created: "Now!",
    ended: "Later...",
    updated: "",
  };

  it("should render selected chat content", () => {
    render(<ChatContent selectedChat={selectedChat} />);
  });
});
