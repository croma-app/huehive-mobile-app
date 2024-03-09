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
