import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiX, FiSend, FiTrash2 } from "react-icons/fi";
import { chatWithAI } from "../services/api";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm Daily Wire AI. Ask me about news, technology, politics, sports, business or anything happening on your news portal.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      // Send complete conversation to backend
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data } = await chatWithAI({
        message,
        history,
      });

      if (data?.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply ||
              "Sorry, I couldn't generate a response.",
            news: data.news || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data?.message ||
              "Sorry, something went wrong.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the AI server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends message
    // Shift + Enter creates new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 👋 What would you like to know?",
      },
    ]);
  };

  return (
    <>
      {/* Floating AI Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI Chat"
          className="
            fixed bottom-6 right-6 z-[100]
            w-14 h-14
            rounded-full
            bg-crimson
            text-white
            shadow-xl
            flex items-center justify-center
            hover:scale-105
            transition-transform
          "
        >
          <FiMessageCircle size={25} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className="
            fixed
            bottom-5 right-5
            z-[100]
            w-[380px]
            max-w-[calc(100vw-24px)]
            h-[600px]
            max-h-[calc(100vh-40px)]
            bg-paper
            dark:bg-ink
            border border-ink/10
            dark:border-paper/10
            rounded-2xl
            shadow-2xl
            overflow-hidden
            flex flex-col
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between
              px-4 py-3
              bg-ink
              dark:bg-ink-soft
              text-white
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-9 h-9
                  rounded-full
                  bg-crimson
                  flex items-center justify-center
                  font-bold
                "
              >
                AI
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Daily Wire AI
                </h3>

                <p className="text-[11px] text-white/60">
                  AI News Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="
                  p-2
                  rounded-lg
                  hover:bg-white/10
                  transition
                "
              >
                <FiTrash2 size={17} />
              </button>

              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="
                  p-2
                  rounded-lg
                  hover:bg-white/10
                  transition
                "
              >
                <FiX size={19} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-4 py-4
              space-y-4
              bg-paper
              dark:bg-ink
            "
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%]
                    rounded-2xl
                    px-4 py-3
                    text-sm
                    leading-relaxed
                    whitespace-pre-wrap
                    ${
                      message.role === "user"
                        ? "bg-crimson text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-ink-soft text-ink dark:text-paper rounded-bl-md"
                    }
                  `}
                >
                  {message.content}

                  {/* News results */}
                  {message.news?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.news.map((article) => (
                        <a
                          key={article._id}
                          href={`/news/${article.slug}`}
                          className="
                            block
                            p-2
                            rounded-lg
                            bg-white
                            dark:bg-ink
                            border
                            border-ink/10
                            dark:border-paper/10
                            hover:border-crimson
                            transition
                          "
                        >
                          {article.image?.url && (
                            <img
                              src={article.image.url}
                              alt={article.title}
                              className="
                                w-full
                                h-28
                                object-cover
                                rounded-md
                                mb-2
                              "
                            />
                          )}

                          <p className="font-semibold text-xs">
                            {article.title}
                          </p>

                          {article.description && (
                            <p className="text-[11px] opacity-60 mt-1 line-clamp-2">
                              {article.description}
                            </p>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-slate-100
                    dark:bg-ink-soft
                    rounded-2xl
                    rounded-bl-md
                    px-4 py-3
                  "
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="
              border-t
              border-ink/10
              dark:border-paper/10
              p-3
              bg-paper
              dark:bg-ink
            "
          >
            <div
              className="
                flex items-end
                gap-2
                bg-slate-100
                dark:bg-ink-soft
                rounded-xl
                px-3 py-2
              "
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Ask Daily Wire AI..."
                className="
                  flex-1
                  resize-none
                  bg-transparent
                  outline-none
                  text-sm
                  text-ink
                  dark:text-paper
                  placeholder:text-slate-400
                  max-h-24
                "
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="
                  w-9 h-9
                  rounded-lg
                  bg-crimson
                  text-white
                  flex items-center justify-center
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <FiSend size={17} />
              </button>
            </div>

            <p className="text-[10px] text-center opacity-40 mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;