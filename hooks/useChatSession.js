import { useState } from 'react';
import { createChatSession, followUpChatSession, getChatSession } from '../network/chat_session';
import { sendClientError } from '../libs/Helpers';

const useChatSession = (initialMessages) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState();

  const fetchNewMessages = async (chatSessionId, latestMessage) => {
    const interval = setInterval(async () => {
      try {
        const messageResponse = await getChatSession(chatSessionId, latestMessage.id);
        if (messageResponse.data.length > 0) {
          setIsLoading(false);
          clearInterval(interval);
          setMessages((prevMessages) => [...prevMessages, ...messageResponse.data]);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching chat session updates', error);
        setError(error.toString());
        sendClientError('fetch_new_message', error.toString());
        clearInterval(interval);
      }
    }, 2000);
  };

  const createSession = async (message) => {
    setIsCreatingSession(true);
    setError(null);
    try {
      const chatSession = await createChatSession(message);
      const latestMessage = chatSession.data.messages[chatSession.data.messages.length - 1];
      setMessages([...messages, latestMessage]);
      await fetchNewMessages(chatSession.data.id, latestMessage);
      setIsCreatingSession(false);
      return chatSession;
    } catch (error) {
      console.error('Error creating chat session', error);
      setError(error.toString());
      sendClientError('create_session', error.toString());
      setIsCreatingSession(false);
      throw error;
    }
  };

  const followUpSession = async (sessionId, message) => {
    setError(null);
    try {
      const chatSessionRes = await followUpChatSession(sessionId, message);
      const latestMessage = chatSessionRes.data;
      setMessages((prevMessages) => [...prevMessages, latestMessage]);
      await fetchNewMessages(sessionId, latestMessage);
      return new Promise.resolve();
    } catch (error) {
      console.error('Error following up chat session', error);
      setError(error.toString());
      sendClientError('followUpSession', error.toString());
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    setIsLoading,
    isCreatingSession,
    error,
    createSession,
    followUpSession
  };
};

export default useChatSession;
