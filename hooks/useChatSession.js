import { useState } from 'react';
import { createChatSession, followUpChatSession, getChatSession } from '../network/chat_session';
import { sendClientError } from '../libs/Helpers';

const useChatSession = (initialMessages) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState();

  const fetchNewMessages = async (chatSession, latestMessage) => {
    const interval = setInterval(async () => {
      try {
        const messageResponse = await getChatSession(chatSession.data.id, latestMessage.id);
        if (messageResponse.data.length > 0) {
          clearInterval(interval);
          setMessages((prevMessages) => [...prevMessages, ...messageResponse.data]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching chat session updates', error);
        setError(error.toString());
        sendClientError('fetch_new_message', error.toString());
        clearInterval(interval);
      }
    }, 2000);
  };

  const createSession = async (message) => {
    setIsLoading(true);
    setIsCreatingSession(true);
    setError(null);
    try {
      const chatSession = await createChatSession(message);
      const latestMessage = chatSession.data.messages[chatSession.data.messages.length - 1];
      setMessages([...messages, latestMessage]);
      await fetchNewMessages(chatSession, latestMessage);
      return chatSession;
    } catch (error) {
      console.error('Error creating chat session', error);
      setError(error.toString());
      sendClientError('create_session', error.toString());
      throw error;
    } finally {
      setIsCreatingSession(false);
    }
  };

  const followUpSession = async (sessionId, message) => {
    setIsLoading(true);
    setError(null);

    try {
      const chatSession = await followUpChatSession(sessionId, message);
      const latestMessage = chatSession.data.messages[chatSession.data.messages.length - 1];
      setMessages((prevMessages) => [...prevMessages, latestMessage]);
      await fetchNewMessages(chatSession, latestMessage);
      return chatSession;
    } catch (error) {
      console.error('Error following up chat session', error);
      setError(error.toString());
      sendClientError('followUpSession', error.toString());
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, isCreatingSession, error, createSession, followUpSession };
};

export default useChatSession;
