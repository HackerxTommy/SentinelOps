import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { chatAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Trash2,
  Bot,
  User,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  Shield,
  Target,
  Code,
  Globe,
  Search,
} from "lucide-react";

/* ── Auto-resize textarea hook ── */
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEnd = useRef(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });

  useEffect(() => {
    chatAPI
      .list()
      .then((r) => {
        setChats(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = async (id) => {
    try {
      const { data } = await chatAPI.get(id);
      setActiveChat(data);
      setMessages(data.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const createChat = async () => {
    try {
      const { data } = await chatAPI.create({ title: "New Chat" });
      setChats((prev) => [data, ...prev]);
      setActiveChat(data);
      setMessages([]);
      return data._id;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    let chatId = activeChat?._id;
    if (!chatId) chatId = await createChat();
    if (!chatId) return;
    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    adjustHeight(true);
    setSending(true);
    try {
      const { data } = await chatAPI.sendMessage(chatId, input);
      setMessages(data.messages);
      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, title: data.title } : c))
      );
    } catch (e) {
      const errMsg =
        e.response?.data?.message || e.message || "Unknown network error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: Could not get response. Details: ${errMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const deleteChat = async (id) => {
    await chatAPI.delete(id);
    setChats((prev) => prev.filter((c) => c._id !== id));
    if (activeChat?._id === id) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const actionButtons = [
    { icon: <Shield className="w-4 h-4" />, label: "Vulnerability Analysis" },
    { icon: <Target className="w-4 h-4" />, label: "Pentest Strategy" },
    { icon: <Code className="w-4 h-4" />, label: "Code Review" },
    { icon: <Globe className="w-4 h-4" />, label: "Recon Help" },
    { icon: <Search className="w-4 h-4" />, label: "Threat Intel" },
  ];

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-48px)]">
        {/* ── Chat Sidebar ── */}
        <div className="w-64 border-r border-white/5 flex flex-col bg-black/30 flex-shrink-0">
          <div className="p-4">
            <button
              onClick={createChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 btn-primary rounded-lg text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {chats.map((c) => (
              <div
                key={c._id}
                onClick={() => loadChat(c._id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                  activeChat?._id === c._id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{c.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(c._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeChat ? (
            /* ── Empty state: v0-style landing ── */
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-8">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-blue-500/40 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-white mb-2">
                    SentinelOps AI
                  </h1>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Your cybersecurity assistant. Ask about vulnerabilities,
                    remediation, pentesting strategies, and more.
                  </p>
                </div>

                {/* v0-style input */}
                <div className="w-full">
                  <div className="relative bg-white/[0.03] rounded-xl border border-white/10">
                    <div className="overflow-y-auto">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          adjustHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about security, vulnerabilities, or pentesting..."
                        className={cn(
                          "w-full px-4 py-3",
                          "resize-none",
                          "bg-transparent",
                          "border-none",
                          "text-white text-sm",
                          "focus:outline-none",
                          "placeholder:text-gray-600 placeholder:text-sm",
                          "min-h-[52px]"
                        )}
                        style={{ overflow: "hidden" }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <button className="group p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-600 hidden group-hover:inline">Attach</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 rounded-lg text-sm text-gray-500 border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center gap-1 transition-colors">
                          <PlusIcon className="w-4 h-4" />
                          Context
                        </button>
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim()}
                          className={cn(
                            "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center gap-1",
                            input.trim()
                              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-400"
                              : "text-gray-600 border-white/10"
                          )}
                        >
                          <ArrowUpIcon className={cn("w-4 h-4", input.trim() ? "text-white" : "text-gray-600")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick action buttons */}
                  <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                    {actionButtons.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          setInput(btn.label);
                          adjustHeight();
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-full border border-white/5 text-gray-500 hover:text-white transition-colors text-xs"
                      >
                        {btn.icon}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Active Chat ── */
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white/5 text-gray-200 border border-white/5 rounded-bl-md"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">
                        {m.content}
                      </pre>
                    </div>
                    {m.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
                    </div>
                    <div className="px-4 py-3 bg-white/5 rounded-2xl rounded-bl-md border border-white/5">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEnd} />
              </div>

              {/* ── v0-style chat input ── */}
              <div className="p-4 border-t border-white/5">
                <div className="relative bg-white/[0.03] rounded-xl border border-white/10">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about security, vulnerabilities, or pentesting..."
                    disabled={sending}
                    className={cn(
                      "w-full px-4 py-3",
                      "resize-none bg-transparent border-none",
                      "text-white text-sm",
                      "focus:outline-none",
                      "placeholder:text-gray-600 placeholder:text-sm",
                      "min-h-[52px] disabled:opacity-50"
                    )}
                    style={{ overflow: "hidden" }}
                  />
                  <div className="flex items-center justify-between p-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button className="group p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={sending || !input.trim()}
                      className={cn(
                        "px-1.5 py-1.5 rounded-lg transition-colors border flex items-center gap-1",
                        input.trim()
                          ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-400"
                          : "text-gray-600 border-white/10"
                      )}
                    >
                      <ArrowUpIcon className={cn("w-4 h-4", input.trim() ? "text-white" : "text-gray-600")} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
