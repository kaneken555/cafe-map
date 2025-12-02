import { API_BASE_PATH } from "../constants/api";

/**
 * CSRFトークンを取得
 */
const getCsrfToken = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_PATH}/csrf/`, {
    credentials: "include",
  });
  const data = await response.json();
  return data.csrfToken;
};

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used?: number;
  response_time_ms?: number;
  model_name?: string;
  related_cafes?: string[];
  related_location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
}

export interface ChatSession {
  id: number;
  map?: number;
  context_type: string;
  context_data?: any;
  title?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  message_count: number;
}

export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  session_id: number;
  content: string;
  context?: {
    current_location?: {
      lat: number;
      lng: number;
    };
    selected_cafe_id?: string;
    [key: string]: any;
  };
}

export interface SendMessageResponse {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
}

/**
 * チャットセッション一覧を取得
 */
export const getChatSessions = async (): Promise<{ sessions: ChatSession[] }> => {
  const response = await fetch(`${API_BASE_PATH}/chat/sessions/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat sessions: ${response.statusText}`);
  }

  return response.json();
};

/**
 * 新しいチャットセッションを作成
 */
export const createChatSession = async (data: {
  context_type?: string;
  context_data?: any;
  map_id?: number;
}): Promise<ChatSession> => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_PATH}/chat/sessions/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create chat session: ${response.statusText}`);
  }

  return response.json();
};

/**
 * チャットセッション詳細を取得
 */
export const getChatSessionDetail = async (sessionId: number): Promise<ChatSessionDetail> => {
  const response = await fetch(`${API_BASE_PATH}/chat/sessions/${sessionId}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat session detail: ${response.statusText}`);
  }

  return response.json();
};

/**
 * チャットセッションを削除
 */
export const deleteChatSession = async (sessionId: number): Promise<void> => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_PATH}/chat/sessions/${sessionId}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete chat session: ${response.statusText}`);
  }
};

/**
 * セッション内のメッセージ一覧を取得
 */
export const getChatMessages = async (
  sessionId: number,
  limit?: number,
  offset?: number
): Promise<{ messages: ChatMessage[]; count: number }> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const queryString = params.toString();
  const url = `${API_BASE_PATH}/chat/sessions/${sessionId}/messages/${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat messages: ${response.statusText}`);
  }

  return response.json();
};

/**
 * メッセージを送信してAI応答を取得
 */
export const sendChatMessage = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_PATH}/chat/messages/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to send chat message: ${response.statusText}`);
  }

  return response.json();
};
