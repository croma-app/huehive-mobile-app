import { useState } from 'react';
import { createChatSession, followUpChatSession, getChatSession } from '../network/chat_session';

const useChatSession = (initialMessages) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const createSession = async (message) => {
    setIsLoading(true);
    setIsCreatingSession(true);
    try {
      const chatSession = await createChatSession(message);
      setIsCreatingSession(false);
      return chatSession;
    } catch (error) {
      console.error('Error creating chat session', error);
      setIsCreatingSession(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const followUpSession = async (sessionId, message) => {
    setIsLoading(true);
    try {
      const chatSession = await followUpChatSession(sessionId, message);
      const latestMessage = chatSession.data.messages[chatSession.data.messages.length - 1];
      setMessages((prevMessages) => [...prevMessages, latestMessage]);

      const interval = setInterval(async () => {
        const messageResponse = await getChatSession(chatSession.data.id, latestMessage.id);
        if (messageResponse.data.length > 0) {
          clearInterval(interval);
          setMessages((prevMessages) => [...prevMessages, ...messageResponse.data]);
        }
      }, 2000);

      return chatSession;
    } catch (error) {
      console.error('Error following up chat session', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    isCreatingSession,
    createSession,
    followUpSession
  };
};

export default useChatSession;
