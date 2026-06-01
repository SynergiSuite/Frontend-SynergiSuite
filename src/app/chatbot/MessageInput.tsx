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
      <div className="w-full border-t border-white/[0.08] bg-transparent px-3 py-3 sm:px-5 sm:py-4">
        <div
          className="
            w-full
            border
            border-white/[0.08]
            rounded-2xl
            px-3
            py-2.5
            flex
            items-end
            justify-between
            gap-3
            bg-white/[0.02]
            focus-within:border-[#5271ff]/50
            transition-all
            duration-300
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
                bg-white/5
                border
                border-white/10
                hover:bg-[#5271ff]/10
                hover:border-[#5271ff]/30
                flex
                items-center
                justify-center
                transition-all
                duration-300
                shrink-0
                text-white/60
                hover:text-white
              "
            >
              <Paperclip className="w-4.5 h-4.5" />
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
                text-white
                placeholder:text-white/30
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
              bg-gradient-to-r
              from-[#5271ff]
              to-[#3a4ec4]
              shadow-[0_0_12px_rgba(82,113,255,0.3)]
              hover:shadow-[0_0_18px_rgba(82,113,255,0.5)]
              flex
              items-center
              justify-center
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              shrink-0
            "
          >
            <SendHorizonal className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
