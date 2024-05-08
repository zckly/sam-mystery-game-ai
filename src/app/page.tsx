"use client";

import { useChat } from "ai/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const { messages, input, setInput, handleInputChange, handleSubmit, append } =
    useChat();
  const [options, setOptions] = useState<string[]>([]);
  const effectRan = useRef(false);

  // When page loads, call the AI
  useEffect(() => {
    if (!effectRan.current) {
      // call AI
      append({
        role: "user",
        content: `Start a text-based RPG with me that revolves around a mystery. Keep your responses brief. After every response, include multiple choice options that I can take starting with "OPTIONS:". I can also provide my own actions.
        
Here is an example of a response:
You wake up in a dimly lit, old-fashioned study room, with no memory of how you got there. As your eyes adjust to the low light, you notice a large, ancient-looking map spread across a heavy wooden table, and several books scattered around. On the table, next to the map, there's a note written in a rushed scrawl.

You approach the table, and as you’re about to read the note, you hear footsteps outside the door.

OPTIONS:
A. Quickly hide behind the curtains.
B. Pretend to be busy reading a book.
C. Open the door to see who is outside.`,
      });

      return () => {
        effectRan.current = true;
      };
    }
  }, []);
  // When messages are received
  // For the last assistant message, parse out the multiple choice options
  useEffect(() => {
    // Get the last assistant message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      // Parse out the multiple choice options
      // Split the content by the "OPTIONS:" string
      const options = lastMessage.content.split("OPTIONS:")[1] ?? "";
      // Split each option by the newline character
      const optionsList = options.split("\n").filter(Boolean);
      // Convert the list of options to an array
      setOptions(optionsList);
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch bg-white text-black">
      {messages.slice(1).map((m, i) => (
        <div
          key={m.id}
          className={clsx(
            m.role === "user" ? "text-gray-700 text-right" : "text-black",
            "whitespace-pre-wrap text-lg"
          )}
        >
          {m.content.split("OPTIONS")[0] ?? ""}
          <div className="flex flex-col gap-2">
            {i === messages.length - 2 &&
              m.role === "assistant" &&
              options.map((option, i) => (
                <button
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  key={i}
                  onClick={() => {
                    append({
                      role: "user",
                      content: option,
                    });
                  }}
                >
                  {option}
                </button>
              ))}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
