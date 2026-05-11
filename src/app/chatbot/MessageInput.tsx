"use client";

import React, { useEffect, useRef } from "react";

import {
  Paperclip,
  SendHorizonal,
} from "lucide-react";

interface Props {
  input: string;

  setInput: React.Dispatch<
    React.SetStateAction<string>
  >;

  sendMessage: () => void | Promise<void>;
}

const MessageInput = ({
  input,
  setInput,
  sendMessage,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  return (
    <>
      <div className="w-full border-t border-gray-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
        <div
          className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-3
            py-2.5
            flex
            items-end
            justify-between
            gap-3
            bg-white
            transition-all
            duration-200
            sm:px-4 sm:py-3
          "
        >
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              className="
                w-8
                h-8
                sm:w-9
                sm:h-9
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
              ref={textareaRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="
                w-full
                resize-none
                outline-none
                bg-transparent
                text-sm
                text-black
                placeholder:text-gray-400
                leading-6
                min-h-[24px]
                max-h-[120px]
                overflow-y-auto
              "
            />
          </div>

          <button
            type="button"
            onClick={sendMessage}
            className="
              w-9
              h-9
              sm:w-10
              sm:h-10
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
