"use client";

import React from "react";

import {
  Paperclip,
  SendHorizonal,
} from "lucide-react";

interface Props {
  input: string;

  setInput: React.Dispatch<
    React.SetStateAction<string>
  >;

  sendMessage: () => void;
}

const MessageInput = ({
  input,
  setInput,
  sendMessage,
}: Props) => {
  return (
    <>
      <div className="w-full border-t border-gray-200 bg-white p-5">
        <div
          className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-4
            py-4
            flex
            items-center
            justify-between
            gap-3
            bg-white
          "
        >
          <div className="flex items-center gap-3 w-full">
            <button
              className="
                w-10
                h-10
                rounded-full
                hover:bg-gray-100
                flex
                items-center
                justify-center
                transition-all
                duration-300
                shrink-0
              "
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>

            <textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              className="
                w-full
                resize-none
                outline-none
                bg-transparent
                text-sm
                text-black
                placeholder:text-gray-400
                min-h-[24px]
                max-h-[120px]
              "
            />
          </div>

          <button
            onClick={sendMessage}
            className="
              w-12
              h-12
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              hover:scale-105
              transition-all
              duration-300
              shrink-0
            "
          >
            <SendHorizonal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;