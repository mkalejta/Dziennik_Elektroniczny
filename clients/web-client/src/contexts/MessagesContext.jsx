import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import useFetch from "../hooks/useFetch";

const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const fetchedConversations = useFetch(
    user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/messages/teacher/${user?.username}`
      : ["student", "parent"].includes(user?.role)
      ? `${import.meta.env.VITE_API_URL}/messages/user/${user?.username}`
      : null
  );

  useEffect(() => {
    if (fetchedConversations) {
      setConversations(fetchedConversations);
    }
  }, [fetchedConversations]);

  // Pobierz listę użytkowników na podstawie roli
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${user?.username}/receivers`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setAvailableUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const getUserById = (userId) => {
    return availableUsers.find((u) => u._id === userId);
  };

  const sendMessage = async (conversationId, content) => {
    try {
      const newMessage = {
        author: user.username,
        content,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/messages/${conversationId}`,
        newMessage,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const updatedConversation = res.data;

      if (selectedConversation && selectedConversation._id === conversationId) {
        setSelectedConversation(updatedConversation);
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversationId ? updatedConversation : conversation
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const newConversation = async (userId) => {
    try {
      const body = {
        teacherId: user.role === "teacher" ? user.username : userId,
        personId: user.role === "teacher" ? userId : user.username,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const createdConversation = res.data;

      setConversations((prev) => [...prev, createdConversation]);
      setSelectedConversation(createdConversation);
    } catch (err) {
      console.error("Failed to create new conversation:", err);
    }
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        newConversation,
        availableUsers,
        getUserById
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}