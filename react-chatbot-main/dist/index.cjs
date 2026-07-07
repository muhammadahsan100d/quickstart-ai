"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  ChatBot: () => App_default
});
module.exports = __toCommonJS(src_exports);

// src/App.tsx
var import_react2 = require("react");
var import_tb = require("react-icons/tb");
var import_ai = require("react-icons/ai");
var import_styled_components3 = __toESM(require("styled-components"), 1);

// src/components/chatbot.tsx
var import_react = require("react");

// src/utils/generateSession.tsx
var import_axios = __toESM(require("axios"), 1);

// src/baseUrl.tsx
var baseUrl = "http://localhost:3100/api/v1";
var baseUrl_default = baseUrl;

// src/utils/generateSession.tsx
var generateSession = async ({ email, username, chatbotId }) => {
  try {
    const response = await import_axios.default.post(`${baseUrl_default}/session/create`, {
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
var import_axios3 = __toESM(require("axios"), 1);
var import_styled_components = __toESM(require("styled-components"), 1);
var import_styled_components2 = require("styled-components");
var import_io5 = require("react-icons/io5");

// src/utils/generateSuggestions.tsx
var import_axios2 = __toESM(require("axios"), 1);
var generateSugesstions = async (bussinessDetails) => {
  try {
    const prompt = `Based on this business info: "${bussinessDetails}"

Generate exactly 4 short customer questions (each under 40 characters). Return only the questions, one per line:`;
    const res = await import_axios2.default.post(`${baseUrl_default}/chatbot/generate`, { prompt });
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
var import_jsx_runtime = require("react/jsx-runtime");
var Chatbot = ({
  chatbotDetails,
  theme,
  position,
  wantToShowSuggestions = false
}) => {
  const [session, setSession] = (0, import_react.useState)({
    started: false,
    email: "",
    username: "",
    sessionId: ""
  });
  const [messages, setMessages] = (0, import_react.useState)([
    { role: "bot", message: "Hello! How can I assist you today?" }
  ]);
  const [suggestions, setSuggestions] = (0, import_react.useState)([]);
  const [showSuggestions, setShowSuggestions] = (0, import_react.useState)(false);
  const [input, setInput] = (0, import_react.useState)("");
  const [name, setName] = (0, import_react.useState)("");
  const [email, setEmail] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(false);
  const messagesEndRef = (0, import_react.useRef)(null);
  const messagesContainerRef = (0, import_react.useRef)(null);
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
  (0, import_react.useEffect)(() => {
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
        const res = await import_axios3.default.post(`${baseUrl_default}/chatbot/getResponse`, {
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
  (0, import_react.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChatbotContainer, { position, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { theme, children: "Chat Support" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormContainer, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          HelpImage,
          {
            src: "https://res.cloudinary.com/dvxvf2vxu/image/upload/v1725171366/help_wa1buy.png",
            alt: "Chatbot"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormButton, { theme, disabled: loading, onClick: handleStartSession, children: loading ? "Starting..." : "Start Chat" })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChatbotContainer, { position, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { theme, children: "Chat Support" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MessagesContainer, { ref: messagesContainerRef, children: [
      messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, { theme, role: message.role, children: message.message }, index)),
      showSuggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionsContainer, { children: suggestions.map((sugg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Suggestion, { theme, onClick: () => handleSugesstionClick(sugg), children: sugg })) }),
      loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, { theme, role: "bot", children: "Typing..." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChatInputContainer, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendButton, { theme, onClick: handleSendMessage, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_io5.IoSend, { color: "white", width: 200, height: 100, size: 20 }) })
    ] })
  ] });
};
var chatbot_default = Chatbot;
var slideUp = import_styled_components2.keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
var ChatbotContainer = import_styled_components.default.div`
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
var Header = import_styled_components.default.div`
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
var FormContainer = import_styled_components.default.form`
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
var HelpImage = import_styled_components.default.img`
  width: 100%;
  max-width: 220px;
  border-radius: 15px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin-bottom: 20px;
`;
var FormInput = import_styled_components.default.input`
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
var FormButton = import_styled_components.default.button`
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
var MessagesContainer = import_styled_components.default.div`
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
var MessageBubble = import_styled_components.default.div`
  align-self: ${(props) => props.role === "user" ? "flex-end" : "flex-start"};
  background-color: ${(props) => props.role === "user" ? props.theme === "primary" ? "#007bff" : props.theme === "secondary" ? "#343a40" : props.theme === "professional" ? "#004085" : props.theme === "tech" ? "#6c757d" : "#e0e0e0" : "#e0e0e0"};
  color: ${(props) => props.role === "user" ? "white" : "black"};
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 80%;
  animation: ${slideUp} 0.3s ease-out;
`;
var ChatInputContainer = import_styled_components.default.div`
  display: flex;
  padding: 8px 16px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;


`;
var ChatInput = import_styled_components.default.input`
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
var SendButton = import_styled_components.default.button`
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
var SuggestionsContainer = import_styled_components.default.div`

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
var Suggestion = import_styled_components.default.div`
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
var import_axios4 = __toESM(require("axios"), 1);
var getChatbotDetails = async (token) => {
  try {
    const response = await import_axios4.default.get(`${baseUrl_default}/user/token/verify`, {
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
var import_jsx_runtime2 = require("react/jsx-runtime");
var bounce = import_styled_components3.keyframes`
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
var spin = import_styled_components3.keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
var AppContainer = import_styled_components3.default.div`
  font-family: 'Outfit', sans-serif;
`;
var ChatbotToggleButton = import_styled_components3.default.div`
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
var ChatbotWrapper = import_styled_components3.default.div`
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
var Loader = import_styled_components3.default.div`
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
  const [show, setShow] = (0, import_react2.useState)(false);
  const [chatbotDetails, setChatbotDetails] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(AppContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ChatbotToggleButton,
      {
        position,
        theme,
        $animate: !show && animate,
        style: { backgroundColor: toggleBtnBgColor, color: toggleBtncolor },
        onClick: () => setShow(!show),
        children: show ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_ai.AiOutlineClose, {}) : icon || /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_tb.TbMessageChatbot, { size: 45 })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChatbotWrapper, { $show: show, position, children: chatbotDetails ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(chatbot_default, { chatbotDetails, theme, position, wantToShowSuggestions }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Loader, { theme }) })
  ] });
};
var App_default = App;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatBot
});
