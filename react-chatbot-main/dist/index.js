// src/App.tsx
import { useEffect as useEffect2, useState as useState2 } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import styled2, { keyframes as keyframes2 } from "styled-components";

// src/components/chatbot.tsx
import { useState, useEffect, useRef } from "react";

// src/utils/generateSession.tsx
import axios from "axios";

// src/baseUrl.tsx
var baseUrl = "http://localhost:3100/api/v1";
var baseUrl_default = baseUrl;

// src/utils/generateSession.tsx
var generateSession = async ({ email, username, chatbotId }) => {
  try {
    const response = await axios.post(`${baseUrl_default}/session/create`, {
      email,
      username,
      chatbotId
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while generating session");
  }
};
var generateSession_default = generateSession;

// src/components/chatbot.tsx
import axios3 from "axios";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { IoSend } from "react-icons/io5";

// src/utils/generateSuggestions.tsx
import axios2 from "axios";
var generateSugesstions = async (bussinessDetails) => {
  try {
    const prompt = `Based on this business info: "${bussinessDetails}"

Generate exactly 4 short customer questions (each under 40 characters). Return only the questions, one per line:`;
    const res = await axios2.post(`${baseUrl_default}/chatbot/generate`, { prompt });
    if (res.data.success && res.data.data) {
      const suggestions2 = res.data.data.split("\n").map((s) => s.trim()).filter((s) => s.length > 5 && s.length < 50).map((s) => s.replace(/^\d+[\.\)\-\s]*/, "")).filter((s) => s.includes("?") || s.toLowerCase().includes("what") || s.toLowerCase().includes("how")).slice(0, 4);
      if (suggestions2.length >= 2) {
        return suggestions2;
      }
    }
  } catch (error) {
    console.error("Error generating suggestions via backend:", error);
  }
  const businessLower = bussinessDetails.toLowerCase();
  const suggestions = [];
  if (businessLower.includes("service") || businessLower.includes("development") || businessLower.includes("consulting")) {
    suggestions.push("What services do you offer?");
  }
  if (businessLower.includes("price") || businessLower.includes("cost") || businessLower.includes("$") || businessLower.includes("rate")) {
    suggestions.push("What are your prices?");
  }
  if (businessLower.includes("support") || businessLower.includes("help") || businessLower.includes("24/7") || businessLower.includes("assistance")) {
    suggestions.push("How can I get support?");
  }
  if (businessLower.includes("contact") || businessLower.includes("email") || businessLower.includes("reach")) {
    suggestions.push("How do I contact you?");
  }
  if (suggestions.length < 4) suggestions.push("What services do you offer?");
  if (suggestions.length < 4) suggestions.push("What are your hours?");
  if (suggestions.length < 4) suggestions.push("How do I contact you?");
  if (suggestions.length < 4) suggestions.push("Tell me about your company");
  return suggestions.slice(0, 4);
};
var generateSuggestions_default = generateSugesstions;

// src/components/chatbot.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Chatbot = ({
  chatbotDetails,
  theme,
  position,
  wantToShowSuggestions = false
}) => {
  const [session, setSession] = useState({
    started: false,
    email: "",
    username: "",
    sessionId: ""
  });
  const [messages, setMessages] = useState([
    { role: "bot", message: "Hello! How can I assist you today?" }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
  let bussinessDetails = "Bussiness Details :";
  bussinessDetails += "Bussiness Name : " + chatbotDetails.bussinessName + ",";
  bussinessDetails += "Bussiness Category : " + chatbotDetails.bussinessCategory + ",";
  bussinessDetails += "Bussiness Description : " + chatbotDetails.bussinessDescription + ",";
  bussinessDetails += "Questionaries :";
  chatbotDetails.bussinessDetails.forEach((item) => {
    bussinessDetails += item.question + " : " + item.answer + ",";
  });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = async () => {
    setShowSuggestions(false);
    if (input.trim() !== "" && !loading) {
      const updatedMessages = [
        ...messages,
        { role: "user", message: input }
      ];
      setMessages(updatedMessages);
      const temp = input;
      setInput("");
      setLoading(true);
      try {
        const backendHistory = [];
        for (let i = 1; i < updatedMessages.length - 1; i += 2) {
          const userMsg = updatedMessages[i];
          const botMsg = updatedMessages[i + 1];
          if (userMsg && botMsg) {
            backendHistory.push({
              question: userMsg.message,
              answer: botMsg.message
            });
          }
        }
        const res = await axios3.post(`${baseUrl_default}/chatbot/getResponse`, {
          messages: backendHistory,
          message: temp,
          session_id: session.sessionId,
          chatbot_id: chatbotDetails.id
        });
        if (!res.data.success) {
          throw new Error("Failed to get response from AI");
        }
        const botMessageIndex = updatedMessages.length;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", message: "Typing..." }
          // Placeholder while bot is typing
        ]);
        let content = "";
        const typewriterEffect = async (text) => {
          for (let i = 0; i < text.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 10));
            content += text.charAt(i);
            setMessages((prevMessages) => [
              ...prevMessages.slice(0, botMessageIndex),
              { role: "bot", message: content }
            ]);
            scrollToBottom();
          }
        };
        setLoading(false);
        await typewriterEffect(res.data.data);
        if (wantToShowSuggestions && (content.includes("sorry") || content.includes("apologize") || content.includes("error") || content.includes("Sorry"))) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", message: "Sorry, something went wrong." }
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    } else {
      alert("Please enter a valid message");
    }
  };
  const handleStartSession = async () => {
    setLoading(true);
    if (name.trim() !== "" && email.trim() !== "") {
      try {
        const response = await generateSession_default({
          email,
          username: name,
          chatbotId: chatbotDetails.id
        });
        setSession({
          started: true,
          email,
          username: name,
          sessionId: response.session._id
        });
      } catch (error) {
        console.error("Error starting session", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getSugesstionsList = async () => {
      if (wantToShowSuggestions && showSuggestions) {
        const suggestionsList = await generateSuggestions_default(bussinessDetails);
        console.log(suggestionsList);
        setSuggestions(suggestionsList);
        console.log(suggestionsList);
      }
    };
    getSugesstionsList();
  }, [wantToShowSuggestions, showSuggestions, bussinessDetails]);
  const handleSugesstionClick = async (sugg) => {
    if (loading) return;
    setInput(sugg);
    setShowSuggestions(false);
  };
  if (!session.started) {
    return /* @__PURE__ */ jsxs(ChatbotContainer, { position, children: [
      /* @__PURE__ */ jsx(Header, { theme, children: "Chat Support" }),
      /* @__PURE__ */ jsxs(FormContainer, { children: [
        /* @__PURE__ */ jsx(
          HelpImage,
          {
            src: "https://res.cloudinary.com/dvxvf2vxu/image/upload/v1725171366/help_wa1buy.png",
            alt: "Chatbot"
          }
        ),
        /* @__PURE__ */ jsx(
          FormInput,
          {
            theme,
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Your Name",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          FormInput,
          {
            theme,
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Your Email",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(FormButton, { theme, disabled: loading, onClick: handleStartSession, children: loading ? "Starting..." : "Start Chat" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(ChatbotContainer, { position, children: [
    /* @__PURE__ */ jsx(Header, { theme, children: "Chat Support" }),
    /* @__PURE__ */ jsxs(MessagesContainer, { ref: messagesContainerRef, children: [
      messages.map((message, index) => /* @__PURE__ */ jsx(MessageBubble, { theme, role: message.role, children: message.message }, index)),
      showSuggestions && /* @__PURE__ */ jsx(SuggestionsContainer, { children: suggestions.map((sugg) => /* @__PURE__ */ jsx(Suggestion, { theme, onClick: () => handleSugesstionClick(sugg), children: sugg })) }),
      loading && /* @__PURE__ */ jsx(MessageBubble, { theme, role: "bot", children: "Typing..." }),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxs(ChatInputContainer, { children: [
      /* @__PURE__ */ jsx(
        ChatInput,
        {
          theme,
          type: "text",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyPress: (e) => {
            if (e.key === "Enter") handleSendMessage();
          },
          placeholder: "Type a message..."
        }
      ),
      /* @__PURE__ */ jsx(SendButton, { theme, onClick: handleSendMessage, children: /* @__PURE__ */ jsx(IoSend, { color: "white", width: 200, height: 100, size: 20 }) })
    ] })
  ] });
};
var chatbot_default = Chatbot;
var slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
var ChatbotContainer = styled.div`
  width: 100%;
  max-width: 380px;
  height: 100%;
  max-height: 500px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: absolute;
  animation: ${slideUp} 0.3s forwards;
  font-family: "Outfit", sans-serif;
  z-index: 9999;
  transition: transform 0.12s, opacity 0.12s;
  transform-origin: bottom;
  




  
  @media (max-width: 768px) {
    max-height: 100%;
  }
`;
var Header = styled.div`
  background-color: ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};
  color: white;
  padding: 16px;
  text-align: center;
  font-size: 1.2em;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  a {
    color: white;
    text-decoration: none;
  }
`;
var FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 30px;
  }
`;
var HelpImage = styled.img`
  width: 100%;
  max-width: 220px;
  border-radius: 15px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin-bottom: 20px;
`;
var FormInput = styled.input`
  width: 100%;
  max-width: 300px;
    font-family: "Outfit", sans-serif;
   padding: 12px;
    margin: 10px 0;
    border-radius: 5px;
    outline:none;
  border: 1px solid
    ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};
  font-size: 1em;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    background-color: white !important;
    color: black !important;

  :focus {
    outline: none;
    border:1px solid red;
     
  }
        :placeholder {
    color: #b3b3b3;
  }
    ::placeholder {
    color: #b3b3b3;
    }
`;
var FormButton = styled.button`
  background-color: ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  :hover {
    background-color: ${(props) => props.theme === "primary" ? "#0056b3" : props.theme === "secondary" ? "#23272a" : props.theme === "professional" ? "#00305a" : props.theme === "tech" ? "#5a6268" : "blue"};
  }

  :disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  :active {
    transform: scale(0.95);
  }
`;
var MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f9f9f9;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: #f9f9f9; /* Track color */
    border-radius: 10px; /* Rounded edges */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b0b0b0; /* Thumb color (scroll handle) */
    border-radius: 10px; /* Rounded thumb */
    border: 2px solid #f9f9f9; /* Adds space around thumb */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #909090; /* Change color on hover */
  }

  @media (max-width: 768px) {
    padding: 10px; /* Make padding smaller on mobile */
    &::-webkit-scrollbar {
      width: 6px; /* Make scrollbar thinner on smaller screens */
    }
  }
`;
var MessageBubble = styled.div`
  align-self: ${(props) => props.role === "user" ? "flex-end" : "flex-start"};
  background-color: ${(props) => props.role === "user" ? props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "#e0e0e0" : "#e0e0e0"};
  color: ${(props) => props.role === "user" ? "white" : "black"};
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 80%;
  animation: ${slideUp} 0.3s ease-out;
`;
var ChatInputContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;


`;
var ChatInput = styled.input`
  flex: 1;
  border: 1px solid
    ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};
  padding: 10px;
  border-radius: 4px;
  margin-right: 10px;
  outline:none;
    font-family: "Outfit", sans-serif;
    font-weight:500;
    font-size:0.9em;

  :focus {
    outline: none;
    border-color: ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};

  }
`;
var SendButton = styled.button`
  background-color: ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "blue"};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  :hover {
    background-color: ${(props) => props.theme === "primary" ? "#0056b3" : props.theme === "secondary" ? "#23272a" : props.theme === "professional" ? "#00305a" : props.theme === "tech" ? "#5a6268" : "blue"};
  }

  :active {
    transform: scale(0.95);
  }
`;
var SuggestionsContainer = styled.div`

  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  gap:10px;
  padding:0px;
  background-color:#f9f9f9;
  border-radius:10px;
  max-width:90%;
  animation: ${slideUp} 0.3s ease-out;
  height:fit-content;
  max-height:300px;
`;
var Suggestion = styled.div`
  background-color: ${(props) => props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "#e0e0e0"};
  color: white;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  font-size:0.9em;
  animation: ${slideUp} 0.3s ease-out;
  cursor:pointer;
   &:hover {
    transform: translateY(-3px); /* Subtle lift on hover */
    background-color: ${(props) => props.theme === "primary" ? "#0056b3" : props.theme === "secondary" ? "#23272b" : props.theme === "professional" ? "#003366" : props.theme === "tech" ? "#5a6268" : "#bdbdbd"};
  }
`;

// src/utils/getChatbotDetails.tsx
import axios4 from "axios";
var getChatbotDetails = async (token) => {
  try {
    const response = await axios4.get(`${baseUrl_default}/user/token/verify`, {
      params: {
        token
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Something went wrong while fetching chatbot details");
  }
};
var getChatbotDetails_default = getChatbotDetails;

// src/App.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var bounce = keyframes2`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;
var spin = keyframes2`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
var AppContainer = styled2.div`
  font-family: 'Outfit', sans-serif;
`;
var ChatbotToggleButton = styled2.div`
  position: fixed;
  bottom: 20px;
  ${({ position }) => position === "left" ? "left: 20px;" : "right: 20px;"}
  font-size: 2em;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, background-color 0.3s, color 0.3s;
  ${({ theme }) => theme === "primary" ? "background-color: #007bff; color: white;" : theme === "secondary" ? "background-color: #343a40; color: white;" : theme === "professional" ? "background-color: #004085; color: white;" : theme === "tech" ? "background-color: #6c757d; color: white;" : "background-color: #007bff; color: white;"}
  animation: ${(props) => props.$animate ? bounce : "none"} 1s infinite;
  z-index: 999;
  &:hover {
    transform: scale(1.1);
  }
`;
var ChatbotWrapper = styled2.div`
  position: fixed;
  ${({ position }) => position === "left" ? "left: 60px;" : "right: 20px;"}
  bottom: 80px;
  width: 350px;
  height: 500px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  ${({ $show }) => $show ? "opacity: 1; transform: translateY(-10px);" : "opacity: 0; display: none; transform: translateY(20px);"}
  z-index: 999;
  @media (max-width: 768px) {
    width: 330px;
    height: 80%;
  }
`;
var Loader = styled2.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid ${({ theme }) => theme === "primary" ? "#007bff" : "#343a40"};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 150px auto;
  margin-top: 200px;
`;
var App = ({
  icon,
  toggleBtnBgColor = "",
  toggleBtncolor = "",
  animate = true,
  token,
  theme = "primary",
  position = "right",
  wantToShowSuggestions = false
}) => {
  const [show, setShow] = useState2(false);
  const [chatbotDetails, setChatbotDetails] = useState2(null);
  useEffect2(() => {
    const fetchChatbotDetails = async () => {
      try {
        const details = await getChatbotDetails_default(token);
        setChatbotDetails(details);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChatbotDetails();
  }, [token]);
  if (!token) {
    console.error("Valid Token is required");
    throw new Error("Valid Token is required");
  }
  return /* @__PURE__ */ jsxs2(AppContainer, { children: [
    /* @__PURE__ */ jsx2(
      ChatbotToggleButton,
      {
        position,
        theme,
        $animate: !show && animate,
        style: { backgroundColor: toggleBtnBgColor, color: toggleBtncolor },
        onClick: () => setShow(!show),
        children: show ? /* @__PURE__ */ jsx2(AiOutlineClose, {}) : icon || /* @__PURE__ */ jsx2(TbMessageChatbot, { size: 45 })
      }
    ),
    /* @__PURE__ */ jsx2(ChatbotWrapper, { $show: show, position, children: chatbotDetails ? /* @__PURE__ */ jsx2(chatbot_default, { chatbotDetails, theme, position, wantToShowSuggestions }) : /* @__PURE__ */ jsx2(Loader, { theme }) })
  ] });
};
var App_default = App;
export {
  App_default as ChatBot
};
