import getAxiosClient from './axios.client';

export const createChatSession = async (chatSession) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post('chat_sessions.json', chatSession);
};

export const getChatSession = async (chatSessionId, lastMessageId) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.get(
    `chat_sessions/${chatSessionId}/new_messages?last_message_id=${lastMessageId}&format=json`
  );
};

export const followUpChatSession = async (id, chatSession) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.patch(`chat_sessions/${id}.json`, chatSession);
};

export const getChatSessions = async () => {
  const axiosClient = await getAxiosClient();
  // https://huehive.co/chat_sessions.json?chat_session_type=color_palette
  return axiosClient.get('chat_sessions.json?chat_session_type=color_palette');
};
