import axiosInstance from './axios.client';

export const createChatSession = async (message) => {
  return axiosInstance.post('chat_sessions.json', message);
};

export const getChatSession = async (chatSessionId, lastMessageId) => {
  return axiosInstance.get(
    `chat_sessions/${chatSessionId}/new_messages?last_message_id=${lastMessageId}&format=json`
  );
};

export const followUpChatSession = async (id, message) => {
  return axiosInstance.post(`chat_sessions/${id}/messages`, message);
};

export const getChatSessions = async () => {
  // https://huehive.co/chat_sessions.json?chat_session_type=color_palette
  return axiosInstance.get('chat_sessions.json?chat_session_type=color_palette');
};
