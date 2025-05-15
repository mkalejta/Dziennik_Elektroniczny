import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText, Typography, Divider, TextField, Button, Paper } from "@mui/material";
import { useMessages } from "../contexts/MessagesContext";
import { useUser } from "../contexts/UserContext";

export default function Messages() {
  const { conversations, selectedConversation, setSelectedConversation, sendMessage, newConversation } =
    useMessages();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [newUserId, setNewUserId] = useState("");

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
    if (newUserId.trim()) {
      newConversation(newUserId.trim());
      setNewUserId("");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: "30%", borderRight: "1px solid #ccc", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Twoje konwersacje
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Wpisz ID osoby..."
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={handleCreateConversation}
          >
            Utwórz
          </Button>
        </Box>
        <List>
          {conversations.map((conversation) => {
            const personId =
              user.role === "teacher" ? conversation.personId : conversation.teacherId;

            return (
              <ListItemButton
                key={conversation._id}
                selected={selectedConversation?._id === conversation._id}
                onClick={() => handleConversationSelect(conversation)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Paper
                        sx={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {personId.charAt(0).toUpperCase()}
                      </Paper>
                      {personId}
                    </Box>
                  }
                  secondary={`Ostatnia wiadomość: ${
                    conversation.messages.length > 0
                      ? new Date(
                          conversation.messages[conversation.messages.length - 1].sent
                        ).toLocaleString()
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
              {user.role === "teacher"
                ? selectedConversation.personId
                : selectedConversation.teacherId}
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
                    alignSelf:
                      message.author === user.username ? "flex-end" : "flex-start",
                    backgroundColor:
                      message.author === user.username ? "#d0e7ff" : "#f0f0f0",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right" }}
                  >
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
