import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ReactMarkdown from "react-markdown";

const TypingText = ({ text = "", speed = 20, onComplete }) => {
  const [displayed, setDisplayed] = useState("");
  const lastTextRef = useRef("");

  useEffect(() => {
    if (text === lastTextRef.current) return;
    lastTextRef.current = text;

    let index = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </span>
  );
};

const ChatBot = () => {
  const [conversations, setConversations] = useState(() => {
   
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentConv, setCurrentConv] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingBotIndex, setTypingBotIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConv, typingBotIndex]);
const sanitizeText = (text) => {
  return text.replace(/"/g, ''); 
};
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

 const handleSend = async () => {
  if (!input.trim() || typingBotIndex !== null) return;

  // Message utilisateur
  const userMessage = { sender: "user", text: input };

  // Ajout du message utilisateur à la conversation
  const updatedConv = [...currentConv, userMessage];
  setCurrentConv(updatedConv);
  setInput("");
  setLoading(true);

  try {
    // Envoi au backend
    const res = await axios.post("http://127.0.0.1:8000/chat", {
      message: input,
    });

    // Message bot
    const botMessage = { sender: "bot", text: res.data.response };

    // Ajout du message bot à la conversation
    setCurrentConv(prev => [...prev, botMessage]);

    
    setTypingBotIndex(updatedConv.length);
  } catch (error) {

    const errorMessage = { sender: "bot", text: "❌ Erreur serveur" };
    setCurrentConv(prev => [...prev, errorMessage]);
    setTypingBotIndex(null);
  }

  setLoading(false);
};

  const onTypingComplete = () => {
    setTypingBotIndex(null);
  };

  const handleNewDiscussion = () => {
    if (currentConv.length > 0) {
      setConversations((prev) => [
        {
          id: Date.now(),
          title: currentConv[0]?.text.slice(0, 20) || "Nouvelle discussion",
          messages: currentConv,
        },
        ...prev,
      ]);
    }
    setCurrentConv([]);
    setTypingBotIndex(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "85vh" }}>
      {/* Barre latérale */}
      <Box
        sx={{
          width: 280,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRight: "1px solid #2c2c2c",
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          💬 Discussions
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewDiscussion}
          color="dark"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Nouvelle discussion
        </Button>

        <Divider sx={{ mb: 2, borderColor: "#333" }} />

        <List dense>
          {conversations.length === 0 && (
            <Typography variant="body2" color="gray">
              Aucune discussion.
            </Typography>
          )}
          {conversations.map((conv) => (
            <ListItem
              key={conv.id}
              button
              color="dark"
              onClick={() => {
                setCurrentConv(conv.messages);
                setTypingBotIndex(null);
              }}
              sx={{
                bgcolor: "white",
                mb: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#3a3a3a" },
              }}
            >
              <ListItemText
                secondary={conv.title}
                  
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
     
        <Box
          sx={{
            mb: 3,
            textAlign: "center",
            p: 2,
            borderRadius: 2,
            color: "#fff",
            boxShadow: "0 0 15px",
          }}
          color="dark"
        >
          <Typography variant="h4" fontWeight="bold">
            Assistant Intelligent
          </Typography>
          <Typography variant="subtitle2">
            Posez vos questions sur les commandes, les stocks ou la production
          </Typography>
        </Box>

        {/* Messages */}
        <Paper
          elevation={6}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            color: "#f0f0f0",
            borderRadius: 2,
          }}
        >
          {currentConv.length === 0 && (
            <Typography color="gray" textAlign="center" mt={10}>
              💭 Démarrez une discussion...
            </Typography>
          )}

         {currentConv.map((msg, index) => (
  <Box
    key={index}
    display="flex"
    justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
    mb={1.5}
  >
    <Box
      px={2}
      py={1.2}
      bgcolor="white"
      color="black"
      borderRadius={2}
      maxWidth="75%"
      sx={{
        fontWeight: 500,
        boxShadow: msg.sender === "user"
          ? "0px 4px 10px rgba(0, 123, 255, 0.2)" 
          
          : "0px 4px 10px rgba(0, 200, 83, 0.2)", 
      }}
    >
      {msg.sender === "bot" && index === typingBotIndex ? (
        <TypingText text={sanitizeText(msg.text)} onComplete={() => setTypingBotIndex(null)} />

      ) : msg.sender === "bot" ? (
        <ReactMarkdown>{sanitizeText(msg.text)}</ReactMarkdown>
      ) : (
        msg.text
      )}
    </Box>
  </Box>
))}

          {loading && (
            <Box textAlign="center" mt={2}>
              <CircularProgress color="primary" />
            </Box>
          )}
          <div ref={chatEndRef} />
        </Paper>

        {/* Saisie */}
        <Divider sx={{ my: 2 }} />
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Tapez votre message..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              borderRadius: 1,
              mr: 1.5,
            }}
            disabled={typingBotIndex !== null}
          />
          <IconButton
            type="submit"
            color="primary"
            sx={{
              bgcolor: "#1976d2",
              color: "#fff",
              "&:hover": { bgcolor: "#1565c0" },
            }}
            disabled={!input.trim() || typingBotIndex !== null}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBot;
