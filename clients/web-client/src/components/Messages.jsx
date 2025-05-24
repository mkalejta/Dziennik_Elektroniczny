import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText, Typography, Divider, TextField, Button, Paper, MenuItem, Select } from "@mui/material";
import { useMessages } from "../contexts/MessagesContext";
import { useUser } from "../contexts/UserContext";

export default function Messages() {
  const { conversations, selectedConversation, setSelectedConversation, sendMessage, newConversation, availableUsers, getUserById } = useMessages();
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const { user } = useUser();

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation._id, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleCreateConversation = () => {
    if (selectedUserId) {
      newConversation(selectedUserId);
      setSelectedUserId("");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: "30%", borderRight: "1px solid #ccc", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Twoje konwersacje
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Select fullWidth value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>
              Wybierz użytkownika
            </MenuItem>
            {availableUsers.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} {user.surname}
              </MenuItem>
            ))}
          </Select>
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleCreateConversation} disabled={!selectedUserId}>
            Utwórz
          </Button>
        </Box>
        <List>
          {conversations.map((conversation) => {
            // Sprawdź, czy zalogowany użytkownik jest teacherId czy personId
            const isTeacher = user.username === conversation.teacherId;
            const otherUserId = isTeacher ? conversation.personId : conversation.teacherId;
            const otherUser = getUserById(otherUserId);

            return (
              <ListItemButton
                key={conversation._id}
                selected={selectedConversation?._id === conversation._id}
                onClick={() => handleConversationSelect(conversation)}
              >
                <ListItemText
                  primary={`Rozmowa z: ${otherUser ? `${otherUser.name} ${otherUser.surname} (${otherUser.role})` : "Nieznany użytkownik"}`}
                  secondary={`Ostatnia wiadomość: ${
                    conversation.messages.length > 0
                      ? new Date(conversation.messages[conversation.messages.length - 1].sent).toLocaleString()
                      : "Brak wiadomości"
                  }`}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
        {selectedConversation ? (
          <>
            <Typography variant="h6" gutterBottom>
              Rozmowa z:{" "}
              {(() => {
                const isTeacher = user.username === selectedConversation.teacherId;
                const otherUserId = isTeacher ? selectedConversation.personId : selectedConversation.teacherId;
                const otherUser = getUserById(otherUserId);
                return otherUser ? `${otherUser.name} ${otherUser.surname} (${otherUser.role})` : "Nieznany użytkownik";
              })()}
            </Typography>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {selectedConversation.messages.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    alignSelf: message.author === user.username ? "flex-end" : "flex-start",
                    backgroundColor: message.author === user.username ? "#d0e7ff" : "#f0f0f0",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption" sx={{ display: "block", textAlign: "right" }}>
                    {new Date(message.sent).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Napisz wiadomość..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Wyślij
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
            Wybierz konwersację, aby wyświetlić wiadomości
          </Typography>
        )}
      </Box>
    </Box>
  );
}
