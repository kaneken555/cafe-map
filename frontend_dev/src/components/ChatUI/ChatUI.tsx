// components/ChatUI/ChatUI.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  createChatSession,
  sendChatMessage,
} from "../../services/chatService";

// よくある質問の定義
interface QuickQuestion {
  id: string;
  text: string;      // 送信されるメッセージテキスト
  label: string;     // ボタンに表示する短縮テキスト
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'nearby-cafe',
    text: '近くのカフェを探して',
    label: '近くのカフェ',
  },
  {
    id: 'quiet-cafe',
    text: '静かで作業しやすいカフェを教えて',
    label: '静かなカフェ',
  },
  {
    id: 'how-to-use',
    text: 'マップの使い方を教えて',
    label: '使い方',
  },
];

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatUIProps {
  initialMessages?: Message[];
}

const ChatUI: React.FC<ChatUIProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // セッション初期化
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await createChatSession({
          context_type: 'general',
        });
        setSessionId(session.id);
        console.log('Chat session created:', session.id);
      } catch (err) {
        console.error('Failed to create chat session:', err);
        setError('チャットセッションの作成に失敗しました');
      }
    };

    initSession();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      // メッセージ送信
      const response = await sendChatMessage({
        session_id: sessionId,
        content: inputText,
      });

      // ユーザーメッセージとAI応答を追加
      const userMsg: Message = {
        id: response.user_message.id,
        text: response.user_message.content,
        sender: "user",
        timestamp: new Date(response.user_message.created_at),
      };

      const aiMsg: Message = {
        id: response.assistant_message.id,
        text: response.assistant_message.content,
        sender: "ai",
        timestamp: new Date(response.assistant_message.created_at),
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setInputText("");
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: QuickQuestion) => {
    if (!sessionId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // メッセージ送信
      const response = await sendChatMessage({
        session_id: sessionId,
        content: question.text,
      });

      // ユーザーメッセージとAI応答を追加
      const userMsg: Message = {
        id: response.user_message.id,
        text: response.user_message.content,
        sender: "user",
        timestamp: new Date(response.user_message.created_at),
      };

      const aiMsg: Message = {
        id: response.assistant_message.id,
        text: response.assistant_message.content,
        sender: "ai",
        timestamp: new Date(response.assistant_message.created_at),
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm space-y-6">
            <div>
              {sessionId ? 'メッセージを送信してチャットを開始' : 'セッションを準備中...'}
            </div>

            {sessionId && (
              <div className="w-full px-4">
                <div className="text-gray-600 text-sm font-medium mb-3 text-center">
                  よくある質問
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      {question.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading || !sessionId}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="送信"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
export type { Message };
