import { useState, useEffect } from "react";
import { getCookie } from "../../lib/cookie-utils";
import { useNavigate } from "react-router-dom";

// Polyfill for crypto.randomUUID if not supported (e.g., in non-secure contexts or older browsers)
if (!crypto.randomUUID) {
  crypto.randomUUID = function randomUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };
}

const Chatting = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [conversationId, setConversationId] = useState("");

  // Replace with your actual token and URL
  const token = getCookie("access_token");
  const url = `ws://10.10.12.10:3000/ws/chat?token=${token}`;

  // Receiver hardcoded, can make dynamic if needed
  const receiver = 33;

  const navigate = useNavigate();

  useEffect(() => {
    let ws;
    let reconnectInterval;

    const connect = () => {
      setErrorMessage(""); // Clear previous errors
      ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);
        setSocket(ws);
        // Note: Join is now manual via button
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received:", data);

          if (data.type === "message.field_error" || data.type === "chat.error" || data.type === "message_field_error") {
            // Improved error handling to display field-specific errors if present
            const errors = Object.entries(data)
              .filter(([key]) => key !== "type")
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            setErrorMessage(errors || data.text || data.message || JSON.stringify(data));
          } else if (data.type === "connection.open") {
            // Handle connection open if needed
          } else if (data.type === "chat.join") {
            // Extract conversation details from response
            if (data.data) {
              setConversation(data.data.conversation);
              setConversationId(data.data.conversation_id);
              setIsJoined(true);
              // Update the route with the conversation ID
              navigate(`/conversation/${data.data.conversation_id}`);
            }
            setMessages((prev) => [...prev, data]);
          } else if (data.type === "chat.message") {
            setMessages((prev) => [...prev, data]);
          } // Add more type handlers as needed
        } catch (err) {
          console.error("Invalid JSON received:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setErrorMessage("Connection error occurred.");
      };

      ws.onclose = (event) => {
        console.log(
          "Disconnected. Code:",
          event.code,
          "Reason:",
          event.reason,
          "Clean close?",
          event.wasClean
        );
        setIsConnected(false);
        setIsJoined(false);
        // Start reconnection if not a clean close
        if (!event.wasClean) {
          reconnectInterval = setTimeout(connect, 5000); // Reconnect after 5 seconds
        }
      };
    };

    connect(); // Initial connection

    return () => {
      if (ws) ws.close();
      if (reconnectInterval) clearTimeout(reconnectInterval);
    };
  }, [url, navigate]); // Re-run if URL changes (e.g., token updates)

  const joinConversation = () => {
    if (socket && isConnected) {
      const payload = {
        type: "chat.join",
        data: {},
        receiver: receiver,
      };

      if (conversationId) {
        // If user provided a conversation ID, include it to join existing
        payload.data.conversation_id = conversationId;
      } else {
        // Generate a new conversation ID if empty
        const uuid1 = crypto.randomUUID().replace(/-/g, '');
        const uuid2 = crypto.randomUUID().replace(/-/g, '');
        const generatedId = uuid1 + uuid2;
        setConversationId(generatedId);
        payload.data.conversation_id = generatedId;
      }

      console.log("Sending join:", payload);
      socket.send(JSON.stringify(payload));
    } else {
      setErrorMessage("Not connected. Cannot join conversation.");
    }
  };

  const sendMessage = () => {
    if (!isJoined) {
      setErrorMessage("Please join the conversation first.");
      return;
    }
    if (socket && isConnected && input.trim()) {
      if (!conversation) {
        setErrorMessage("Conversation ID not set. Please rejoin.");
        return;
      }
      const payload = {
        type: "chat.message",
        text: input,  // Changed from 'message' to 'text' based on backend error patterns
        receiver: receiver,
        message_type: "Text",
        conversation: conversation, // Use the conversation PK from join response (e.g., 8)
      };
      console.log("Sending:", payload);
      socket.send(JSON.stringify(payload));
      setInput("");
    } else if (!input.trim()) {
      setErrorMessage("Message cannot be empty.");
    } else {
      setErrorMessage("Not connected. Cannot send message.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chatting with WebSocket</h2>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      <div>Joined: {isJoined ? `Yes (Conversation: ${conversation})` : "No"}</div>
      {errorMessage && (
        <div style={{ color: "red" }}>Error: {errorMessage}</div>
      )}
      {!isJoined && (
        <>
          <input
            type="text"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Conversation ID (optional for new, auto-generated if empty)"
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={joinConversation} style={{ marginBottom: "10px" }}>
            Join Conversation
          </button>
        </>
      )}
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            <strong>{msg.user || "Unknown"}:</strong> {msg.text || msg.message}  {/* Updated to handle potential 'text' field */}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "70%", marginRight: "10px" }}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        disabled={!isJoined}
      />
      <button onClick={sendMessage} disabled={!isJoined}>
        Send
      </button>
    </div>
  );
};

export default Chatting;

















// import { useState, useRef, useEffect } from "react";
// import { getCookie } from "../../lib/cookie-utils";
// import {
//   Send,
//   X,
//   Search,
//   MoreHorizontal,
//   Menu,
//   Archive,
//   BellOff,
//   Trash2,
//   DollarSign,
//   ImagePlus,
//   Plus,
// } from "lucide-react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// // Polyfill for crypto.randomUUID if not supported
// if (!crypto.randomUUID) {
//   crypto.randomUUID = function randomUUID() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//       (
//         c ^
//         (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//       ).toString(16)
//     );
//   };
// }
// export default function ConversationPage() {
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentUser, setCurrentUser] = useState(null);
//   const [message, setMessage] = useState("");
//   const [selectedConvoId, setSelectedConvoId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [joinedConvos, setJoinedConvos] = useState(new Set());
//   const token = getCookie("access_token");
//   const dropdownRef = useRef(null);
//   const messagesEndRef = useRef(null); // For auto-scroll
//   const navigate = useNavigate();
//   const location = useLocation(); // To access state for new conversations
//   const { id } = useParams();
//   console.log(currentUser);
//   console.log(conversations, "conversations ");

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert("Image size should be less than 5MB");
//         return;
//       }

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//         setImageFile(file);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImageFile(null);
//   };

//   // Handle create offer
//   const handleCreateOffer = () => {
//     // Your logic for creating an offer
//     console.log("Create offer clicked");
//     // You can open a modal or navigate to offer creation page
//   };

//   console.log(messages, "Messages ");
//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await fetch("http://10.10.12.10:3000/api/user/retrieve", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setCurrentUser(data);
//         } else {
//           console.error("Failed to fetch current user");
//         }
//       } catch (err) {
//         console.error("Error fetching current user:", err);
//       }
//     };
//     fetchCurrentUser();
//   }, [token]);
//   // Fetch conversations (made into a reusable function)
//   const fetchConvos = async () => {
//     try {
//       const res = await fetch(
//         "http://10.10.12.10:3000/api/chat/conversations",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(res, "database-------------------------------");
//       if (res.ok) {
//         let data = await res.json();
//         // Sort by last message time descending
//         data.sort((a, b) => {
//           const timeA = a.last_message
//             ? new Date(a.last_message.created_at).getTime()
//             : 0;
//           const timeB = b.last_message
//             ? new Date(b.last_message.created_at).getTime()
//             : 0;
//           return timeB - timeA;
//         });
//         setConversations(data.map((convo) => ({ ...convo, starred: false }))); // Add starred locally
//         // Initialize messages with last_message if present
//         const initialMessages = {};
//         data.forEach((convo) => {
//           initialMessages[convo.id] = convo.last_message
//             ? [convo.last_message]
//             : [];
//         });
//         setMessages(initialMessages);
//       } else {
//         console.error("Failed to fetch conversations");
//       }
//     } catch (err) {
//       console.error("Error fetching conversations:", err);
//     }
//   };
//   // Fetch conversations on mount and when id changes (to refresh after new creation)
//   useEffect(() => {
//     fetchConvos();
//   }, [token, id]); // Added id to dependencies to re-fetch on navigation (e.g., after creating new)
//   // WebSocket connection
//   useEffect(() => {
//     if (!token) return;
//     let ws;
//     let reconnectInterval;
//     const connect = () => {
//       const url = `ws://10.10.12.10:3000/ws/chat?token=${token}`;
//       ws = new WebSocket(url);
//       ws.onopen = () => {
//         console.log("Connected to WebSocket");
//         setIsConnected(true);
//         setSocket(ws);
//         setErrorMessage("");
//       };
//       ws.onmessage = (event) => {
//         try {
//           const result = JSON.parse(event.data);
//           const data = result.data;
//           if (
//             result.type === "message.field_error" ||
//             result.type === "chat.error" ||
//             result.type === "message_field_error"
//           ) {
//             const errors = Object.entries(result)
//               .filter(([key]) => key !== "type")
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//             setErrorMessage(
//               errors || result.text || result.message || JSON.stringify(result)
//             );
//           } else if (result.type === "chat.join") {
//             // Handle join if needed, e.g., update inbox users
//             if (data.conversation) {
//               setConversations((prev) =>
//                 prev.map((c) =>
//                   c.id === data.conversation
//                     ? {
//                         ...c,
//                         currently_in_inbox:
//                           data.users_ids_who_are_currently_inbox || [],
//                       }
//                     : c
//                 )
//               );
//             }
//             // New: For new conversations, add the new convo locally and navigate
//             if (data.conversation_id && id === "new") {
//               const receiver = location.state?.receiver;
//               if (receiver) {
//                 const newConvo = {
//                   id: data.conversation, // PK
//                   conversation_id: data.conversation_id, // UUID
//                   currently_in_inbox:
//                     data.users_ids_who_are_currently_inbox || [],
//                   chat_with: {
//                     id: receiver.id,
//                     full_name: receiver.full_name,
//                     photo: receiver.photo || "https://via.placeholder.com/40",
//                     is_online: false, // Default, update if needed
//                     last_login: null,
//                   },
//                   last_message: null, // No message yet
//                 };
//                 setConversations((prev) =>
//                   [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   })
//                 );
//                 setSelectedConvoId(data.conversation); // Select the new one
//                 setJoinedConvos(
//                   (prev) => new Set([...prev, data.conversation])
//                 );
//                 navigate(`/conversation/${data.conversation_id}`);
//               }
//             }
//           } else if (result.type === "chat.message") {
//             const convoId = data.conversation;
//             if (convoId) {
//               setMessages((prev) => {
//                 const prevMsgs = prev[convoId] || [];
//                 const optimisticIndex = prevMsgs.findIndex((msg) => {
//                   const isTemp =
//                     typeof msg.id === "string" && msg.id.startsWith("temp-");
//                   const textMatch = msg.text === data.text;
//                   const senderMatch = msg.sender.id === data.sender.id;
//                   const timeMatch =
//                     Math.abs(
//                       new Date(msg.created_at).getTime() -
//                         new Date(data.created_at).getTime()
//                     ) < 5000; // Within 5s
//                   return (
//                     (isTemp && textMatch && senderMatch) ||
//                     (textMatch && senderMatch && timeMatch)
//                   );
//                 });
//                 if (optimisticIndex !== -1) {
//                   // Replace optimistic with server version
//                   const updatedMsgs = [...prevMsgs];
//                   updatedMsgs[optimisticIndex] = {
//                     ...data,
//                     id: data.id || updatedMsgs[optimisticIndex].id,
//                   }; // Keep ID if server doesn't provide
//                   return { ...prev, [convoId]: updatedMsgs };
//                 } else {
//                   // Add as new
//                   return { ...prev, [convoId]: [...prevMsgs, data] };
//                 }
//               });
//               // Update conversation preview and last_message
//               setConversations((prev) => {
//                 const existing = prev.find((c) => c.id === convoId);
//                 if (existing) {
//                   return prev
//                     .map((c) =>
//                       c.id === convoId
//                         ? {
//                             ...c,
//                             last_message: data,
//                             preview: data.text || "",
//                             time: data.created_at,
//                           }
//                         : c
//                     )
//                     .sort((a, b) => {
//                       const timeA = a.last_message
//                         ? new Date(a.last_message.created_at).getTime()
//                         : 0;
//                       const timeB = b.last_message
//                         ? new Date(b.last_message.created_at).getTime()
//                         : 0;
//                       return timeB - timeA;
//                     });
//                 } else {
//                   // For new convos
//                   const isOutgoing = data.sender.id === currentUser?.user_id;
//                   const chatWith = isOutgoing ? data.receiver : data.sender;
//                   const newConvo = {
//                     id: convoId,
//                     conversation_id: data.conversation_id || `temp-${convoId}`,
//                     currently_in_inbox:
//                       data.users_ids_who_are_currently_inbox || [],
//                     chat_with: {
//                       id: chatWith.id,
//                       full_name: chatWith.full_name,
//                       photo: chatWith.photo || "https://via.placeholder.com/40",
//                       is_online: chatWith.is_online || false,
//                       last_login: chatWith.last_login || null,
//                     },
//                     last_message: data,
//                   };
//                   return [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   });
//                 }
//               });
//             } else {
//               console.error("No conversation ID in message data:", data);
//             }
//           }
//         } catch (err) {
//           console.error("Invalid JSON received:", err);
//         }
//       };
//       ws.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         setIsConnected(false);
//         setErrorMessage("Connection error occurred.");
//       };
//       ws.onclose = (event) => {
//         console.log(
//           "Disconnected. Code:",
//           event.code,
//           "Reason:",
//           event.reason,
//           "Clean close?",
//           event.wasClean
//         );
//         setIsConnected(false);
//         if (!event.wasClean) {
//           reconnectInterval = setTimeout(connect, 5000);
//         }
//       };
//     };
//     connect();
//     return () => {
//       if (ws) ws.close();
//       if (reconnectInterval) clearTimeout(reconnectInterval);
//     };
//   }, [token, id, location.state, currentUser]); // Added dependencies
//   // New: Auto-join for new conversations when id === 'new'
//   useEffect(() => {
//     if (
//       id === "new" &&
//       location.state?.createNew &&
//       location.state?.receiver &&
//       socket &&
//       isConnected
//     ) {
//       joinConversation(location.state.receiver.id);
//     }
//   }, [id, location.state, socket, isConnected]);
//   // Fetch full message history when selecting a conversation
//   useEffect(() => {
//     if (selectedConvoId && id !== "new" && selectedConvoId !== "new") {
//       // Skip for new
//       const fetchMessages = async () => {
//         try {
//           const res = await fetch(
//             `http://10.10.12.10:3000/api/chat/conversation/${selectedConvoId}/messages`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           if (res.ok) {
//             const data = await res.json();
//             setMessages((prev) => ({ ...prev, [selectedConvoId]: data }));
//           } else {
//             console.error("Failed to fetch messages");
//           }
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };
//       fetchMessages();
//       // Join conversation if not already joined
//       if (socket && isConnected && !joinedConvos.has(selectedConvoId)) {
//         const convo = conversations.find((c) => c.id === selectedConvoId);
//         console.log(convo);
//         if (convo) {
//           const payload = {
//             type: "chat.join",
//             data: { conversation: selectedConvoId },
//             receiver: convo.chat_with.id,
//           };
//           socket.send(JSON.stringify(payload));
//           setJoinedConvos((prev) => new Set([...prev, selectedConvoId]));
//         }
//       }
//     }
//   }, [
//     selectedConvoId,
//     socket,
//     isConnected,
//     conversations,
//     joinedConvos,
//     token,
//     id, // Added id
//   ]);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages[selectedConvoId]]);
//   // Set selected conversation from URL param
//   useEffect(() => {
//     if (id && id !== "new" && conversations.length > 0) {
//       const selected = conversations.find(
//         (convo) => convo.conversation_id === id
//       );
//       if (selected) {
//         setSelectedConvoId(selected.id);
//       }
//     } else if (id === "new") {
//       setSelectedConvoId("new");
//     }
//   }, [id, conversations]);
//   // Initialize messages for new conversation
//   useEffect(() => {
//     if (id === "new") {
//       setMessages((prev) => ({ ...prev, new: [] }));
//     }
//   }, [id]);
//   // New: Join conversation function (for new or existing)
//   const joinConversation = (receiverId) => {
//     if (socket && isConnected) {
//       let generatedId = "";
//       if (id === "new") {
//         // Generate new UUID for new conversation
//         const uuid1 = crypto.randomUUID().replace(/-/g, "");
//         const uuid2 = crypto.randomUUID().replace(/-/g, "");
//         generatedId = uuid1 + uuid2;
//       }
//       const payload = {
//         type: "chat.join",
//         data: { conversation_id: generatedId }, // Empty or generated for new
//         receiver: receiverId,
//       };
//       console.log("Sending join:", payload);
//       socket.send(JSON.stringify(payload));
//     } else {
//       setErrorMessage("Not connected. Cannot join conversation.");
//     }
//   };
//   const sendMessage = () => {
//     if (selectedConvoId === "new") return; // Prevent sending in temp new state
//     if (message.trim() && socket && isConnected && selectedConvoId) {
//       const convo = conversations.find((c) => c.id === selectedConvoId);
//       if (!convo) return;
//       const payload = {
//         type: "chat.message",
//         text: message.trim(),
//         receiver: convo.chat_with.id,
//         message_type: "Text",
//         conversation: selectedConvoId,
//       };
//       socket.send(JSON.stringify(payload));
//       // Optimistic add with temp ID
//       const tempId = `temp-${Date.now()}`;
//       const newMsg = {
//         ...payload,
//         sender: currentUser
//           ? { id: currentUser.user_id, full_name: currentUser.full_name }
//           : { id: -1, full_name: "Me" },
//         receiver: convo.chat_with,
//         created_at: new Date().toISOString(),
//         id: tempId, // For dedupe
//       };
//       setMessages((prev) => ({
//         ...prev,
//         [selectedConvoId]: [...(prev[selectedConvoId] || []), newMsg],
//       }));
//       // Update preview
//       setConversations((prev) =>
//         prev
//           .map((c) =>
//             c.id === selectedConvoId
//               ? {
//                   ...c,
//                   last_message: newMsg,
//                   preview: message.trim(),
//                   time: newMsg.created_at,
//                 }
//               : c
//           )
//           .sort((a, b) => {
//             const timeA = a.last_message
//               ? new Date(a.last_message.created_at).getTime()
//               : 0;
//             const timeB = b.last_message
//               ? new Date(b.last_message.created_at).getTime()
//               : 0;
//             return timeB - timeA;
//           })
//       );
//       setMessage("");
//       setErrorMessage("");
//     }
//   };
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredConversations = conversations.filter((convo) => {
//     const matchesSearch = convo.chat_with.full_name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });
//   const handleDropdownAction = (action) => {
//     if (action === "archive") {
//       alert(`Archived chat with ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "mute") {
//       alert(`Muted notifications for ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "delete") {
//       if (
//         window.confirm(
//           `Are you sure you want to delete the chat with ${currentConvo?.chat_with.full_name}?`
//         )
//       ) {
//         setConversations((prev) =>
//           prev.filter((convo) => convo.id !== selectedConvoId)
//         );
//         setMessages((prev) => {
//           const newMessages = { ...prev };
//           delete newMessages[selectedConvoId];
//           return newMessages;
//         });
//         setSelectedConvoId(null);
//         setShowSidebar(false);
//       }
//     }
//     setShowDropdown(false);
//   };
//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };
//   let currentConvo = conversations.find(
//     (convo) => convo.id === selectedConvoId
//   );
//   if (!currentConvo && id === "new" && location.state?.receiver) {
//     currentConvo = {
//       chat_with: {
//         ...location.state.receiver,
//         is_online: false,
//         last_login: null,
//       },
//     };
//   }
//   console.log(currentConvo, "-----------------------------");
//   return (
//     <div className="flex h-[70vh] md:h-[91vh] overflow-hidden bg-white border-b border-gray-200">
//       {/* Connection Status */}
//       <div
//         className={`fixed top-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
//           isConnected
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }`}
//       >
//         {isConnected ? "Connected" : "Disconnected"}
//       </div>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full shadow-md hover:bg-[#B0A8E0] transition-colors"
//         onClick={toggleSidebar}
//       >
//         {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>
//       <div
//         className={`${
//           showSidebar ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto shadow-lg lg:shadow-none`}
//       >
//         <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
//           <div className="flex items-center justify-between mb-3 sm:mb-4">
//             <div className="relative flex-1 ml-2">
//               <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 placeholder="Search contacts..."
//                 className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {filteredConversations.length > 0 ? (
//             filteredConversations.map((convo) => (
//               <div
//                 key={convo.id}
//                 onClick={() => {
//                   setSelectedConvoId(convo.id);
//                   if (socket && isConnected) {
//                     const payload = {
//                       type: "chat.join",
//                       receiver: convo.chat_with.id,
//                     };
//                     socket.send(JSON.stringify(payload));
//                   }
//                   navigate(`/conversation/${convo.conversation_id}`);
//                   setShowSidebar(false);
//                 }}
//                 className={`flex items-center p-3 sm:p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors ${
//                   selectedConvoId === convo.id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={convo.chat_with.photo}
//                     alt={convo.chat_with.full_name}
//                     className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex-shrink-0 shadow-sm"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://via.placeholder.com/40"; // Fallback
//                     }}
//                   />
//                   {convo.chat_with.is_online && (
//                     <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                   )}
//                 </div>
//                 <div className="ml-2 sm:ml-3 flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
//                       {convo.chat_with.full_name}
//                     </h3>
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-gray-500">
//                         {convo.last_message
//                           ? new Date(
//                               convo.last_message.created_at
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
//                     {convo.last_message?.text || ""}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
//               No conversations found.
//             </p>
//           )}
//         </div>
//       </div>
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {currentConvo ? (
//           <>
//             <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <button
//                     className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                     onClick={toggleSidebar}
//                   >
//                     <Menu className="w-5 h-5" />
//                   </button>
//                   <div className="relative">
//                     <img
//                       src={currentConvo.chat_with.photo}
//                       alt={currentConvo.chat_with.full_name}
//                       className="w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-sm"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                     {currentConvo.chat_with.is_online && (
//                       <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-sm sm:text-base text-gray-900">
//                       {currentConvo.chat_with.full_name}
//                     </h2>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
//                       <span>
//                         {currentConvo.chat_with.is_online
//                           ? "Online"
//                           : currentConvo.chat_with.last_login
//                           ? `Last seen: ${new Date(
//                               currentConvo.chat_with.last_login
//                             ).toLocaleString()}`
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <MoreHorizontal className="w-5 h-5 text-gray-400" />
//                 </button>
//               </div>
//               {showDropdown && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute right-2 sm:right-4 top-10 sm:top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
//                 >
//                   <button
//                     onClick={() => handleDropdownAction("archive")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <Archive className="w-4 h-4" /> Archive Chat
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("mute")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <BellOff className="w-4 h-4" /> Mute Notifications
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("delete")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete Chat
//                   </button>
//                 </div>
//               )}
//             </div>
//             {/* Messages */}
//             <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 flex flex-col-reverse">
//               <div ref={messagesEndRef} /> {/* For scroll */}
//               {messages[selectedConvoId]?.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`mb-2 sm:mb-3 ${
//                     msg.sender.id === currentUser?.user_id
//                       ? "flex justify-end"
//                       : "flex justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] sm:max-w-[60%] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-md ${
//                       msg.sender.id === currentUser?.user_id
//                         ? "bg-[#C8C1F5] text-black rounded-br-none"
//                         : "bg-white text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-xs sm:text-sm break-words">{msg.text}</p>
//                     <div
//                       className={`text-xs mt-1 ${
//                         msg.sender.id === currentUser?.user_id
//                           ? "text-gray-700"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {new Date(msg.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Message Input */}
//             <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-sm">
//               {errorMessage && (
//                 <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
//               )}
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex-1 relative">
//                   {/* Image preview */}
//                   {selectedImage && (
//                     <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
//                       <div className="relative">
//                         <img
//                           src={selectedImage}
//                           alt="Selected"
//                           className="w-20 h-20 object-cover rounded"
//                         />
//                         <button
//                           onClick={removeImage}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     placeholder={
//                       isConnected ? "Type a message..." : "Connecting..."
//                     }
//                     disabled={
//                       !isConnected ||
//                       !selectedConvoId ||
//                       selectedConvoId === "new"
//                     }
//                     className="w-full pl-3 sm:pl-4 pr-20 sm:pr-24 py-2 sm:py-3 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm disabled:opacity-50 focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//                   />

//                   {/* Image upload and Create Offer buttons inside input */}
//                   <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                     {/* Image Upload Button */}
//                     <label className="cursor-pointer p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors">
//                       <ImagePlus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         disabled={
//                           !isConnected ||
//                           !selectedConvoId ||
//                           selectedConvoId === "new"
//                         }
//                         className="hidden"
//                       />
//                     </label>

//                     {/* Create Offer Button */}
//                     <button
//                       onClick={handleCreateOffer}
//                       disabled={
//                         !isConnected ||
//                         !selectedConvoId ||
//                         selectedConvoId === "new"
//                       }
//                       className="p-1.5 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gray-200"
//                       title="Create Offer"
//                     >
//                       <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />{" "}
//                       Create Offer
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   onClick={sendMessage}
//                   disabled={
//                     !message.trim() ||
//                     !isConnected ||
//                     !selectedConvoId ||
//                     selectedConvoId === "new"
//                   }
//                   className="bg-[#C8C1F5] disabled:bg-gray-300 disabled:cursor-not-allowed text-black p-2 sm:p-3 rounded-full hover:bg-[#B0A8E0] transition-colors shadow-sm"
//                 >
//                   <Send className="w-4 sm:w-5 h-4 sm:h-5" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm bg-gray-50">
//             {id === "new"
//               ? "Starting new conversation..."
//               : "Select a conversation to start chatting"}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import { useState, useRef, useEffect } from "react";
// import { getCookie } from "../../lib/cookie-utils";
// import {
//   Send,
//   X,
//   Search,
//   MoreHorizontal,
//   Menu,
//   Archive,
//   BellOff,
//   Trash2,
//   ImagePlus,
//   Plus,
// } from "lucide-react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import useSellerServices from "../../hooks/useSellerServices";
// import useMe from "../../hooks/useMe";
// // Polyfill for crypto.randomUUID if not supported
// if (!crypto.randomUUID) {
//   crypto.randomUUID = function randomUUID() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//       (
//         c ^
//         (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//       ).toString(16)
//     );
//   };
// }
// export default function ConversationPage() {
//   const { user, loading} = useMe();
//   console.log(user);
  
  
//   const {service} = useSellerServices([])
//   const activeServices = service?.filter(s => s.status === "Approved");
// console.log(activeServices, "---------------------------------------------------------Active Services");

//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentUser, setCurrentUser] = useState(null);
//   const [message, setMessage] = useState("");
//   const [selectedConvoId, setSelectedConvoId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [joinedConvos, setJoinedConvos] = useState(new Set());
//   const token = getCookie("access_token");
//   const dropdownRef = useRef(null);
//   const messagesEndRef = useRef(null); // For auto-scroll
//   const navigate = useNavigate();
//   const location = useLocation(); // To access state for new conversations
//   const { id } = useParams();
//   console.log(currentUser);
//   console.log(conversations, "conversations ");

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert("Image size should be less than 5MB");
//         return;
//       }

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//         setImageFile(file);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImageFile(null);
//   };

//   // Send image
//   const sendImage = async () => {
//     if (!imageFile || !selectedConvoId || selectedConvoId === "new") return;
//     const convo = conversations.find((c) => c.id === selectedConvoId);
//     if (!convo) return;
//     setErrorMessage("");
//     try {
//       const formData = new FormData();
//       formData.append("media", imageFile);
//       formData.append("conversation", selectedConvoId.toString());
//       formData.append("receiver", convo.chat_with.id.toString());
//       formData.append("message_type", "Media");
//       if (message.trim()) {
//         formData.append("text", message.trim());
//       }
//       const response = await axios.post("http://10.10.12.10:3000/api/chat/send-image", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = response.data;
//       setMessages((prev) => {
//         const prevMsgs = prev[selectedConvoId] || [];
//         return { ...prev, [selectedConvoId]: [...prevMsgs, data] };
//       });
//       // Update conversation preview and last_message
//       setConversations((prev) => {
//         return prev
//           .map((c) =>
//             c.id === selectedConvoId
//               ? {
//                   ...c,
//                   last_message: data,
//                   preview: data.text ? data.text + " [Image]" : "[Image]",
//                   time: data.created_at,
//                 }
//               : c
//           )
//           .sort((a, b) => {
//             const timeA = a.last_message
//               ? new Date(a.last_message.created_at).getTime()
//               : 0;
//             const timeB = b.last_message
//               ? new Date(b.last_message.created_at).getTime()
//               : 0;
//             return timeB - timeA;
//           });
//       });
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Error sending image: " + (err.response ? JSON.stringify(err.response.data) : err.message));
//     }
//   };

//   // Handle create offer
//   const handleCreateOffer = () => {
//     // Your logic for creating an offer
//     console.log("Create offer clicked");
//     // You can open a modal or navigate to offer creation page
//   };

//   // Handle send (text or image)
//   const handleSend = async () => {
//     if (!isConnected || !selectedConvoId || selectedConvoId === "new") return;
//     if (imageFile) {
//       await sendImage();
//       removeImage();
//       setMessage("");
//     } else if (message.trim()) {
//       sendMessage();
//     }
//   };

//   console.log(messages, "Messages ");
//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await fetch("http://10.10.12.10:3000/api/user/retrieve", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setCurrentUser(data);
//         } else {
//           console.error("Failed to fetch current user");
//         }
//       } catch (err) {
//         console.error("Error fetching current user:", err);
//       }
//     };
//     fetchCurrentUser();
//   }, [token]);
//   // Fetch conversations (made into a reusable function)
//   const fetchConvos = async () => {
//     try {
//       const res = await fetch(
//         "http://10.10.12.10:3000/api/chat/conversations",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(res, "database-------------------------------");
//       if (res.ok) {
//         let data = await res.json();
//         // Sort by last message time descending
//         data.sort((a, b) => {
//           const timeA = a.last_message
//             ? new Date(a.last_message.created_at).getTime()
//             : 0;
//           const timeB = b.last_message
//             ? new Date(b.last_message.created_at).getTime()
//             : 0;
//           return timeB - timeA;
//         });
//         setConversations(data.map((convo) => ({ ...convo, starred: false }))); // Add starred locally
//         // Initialize messages with last_message if present
//         const initialMessages = {};
//         data.forEach((convo) => {
//           initialMessages[convo.id] = convo.last_message
//             ? [convo.last_message]
//             : [];
//         });
//         setMessages(initialMessages);
//       } else {
//         console.error("Failed to fetch conversations");
//       }
//     } catch (err) {
//       console.error("Error fetching conversations:", err);
//     }
//   };
//   // Fetch conversations on mount and when id changes (to refresh after new creation)
//   useEffect(() => {
//     fetchConvos();
//   }, [token, id]); // Added id to dependencies to re-fetch on navigation (e.g., after creating new)
//   // WebSocket connection
//   useEffect(() => {
//     if (!token) return;
//     let ws;
//     let reconnectInterval;
//     const connect = () => {
//       const url = `ws://10.10.12.10:3000/ws/chat?token=${token}`;
//       ws = new WebSocket(url);
//       ws.onopen = () => {
//         console.log("Connected to WebSocket");
//         setIsConnected(true);
//         setSocket(ws);
//         setErrorMessage("");
//       };
//       ws.onmessage = (event) => {
//         try {
//           const result = JSON.parse(event.data);
//           const data = result.data;
//           if (
//             result.type === "message.field_error" ||
//             result.type === "chat.error" ||
//             result.type === "message_field_error"
//           ) {
//             const errors = Object.entries(result)
//               .filter(([key]) => key !== "type")
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//             setErrorMessage(
//               errors || result.text || result.message || JSON.stringify(result)
//             );
//           } else if (result.type === "chat.join") {
//             // Handle join if needed, e.g., update inbox users
//             if (data.conversation) {
//               setConversations((prev) =>
//                 prev.map((c) =>
//                   c.id === data.conversation
//                     ? {
//                         ...c,
//                         currently_in_inbox:
//                           data.users_ids_who_are_currently_inbox || [],
//                       }
//                     : c
//                 )
//               );
//             }
//             // New: For new conversations, add the new convo locally and navigate
//             if (data.conversation_id && id === "new") {
//               const receiver = location.state?.receiver;
//               if (receiver) {
//                 const newConvo = {
//                   id: data.conversation, // PK
//                   conversation_id: data.conversation_id, // UUID
//                   currently_in_inbox:
//                     data.users_ids_who_are_currently_inbox || [],
//                   chat_with: {
//                     id: receiver.id,
//                     full_name: receiver.full_name,
//                     photo: receiver.photo || "https://via.placeholder.com/40",
//                     is_online: false, // Default, update if needed
//                     last_login: null,
//                   },
//                   last_message: null, // No message yet
//                 };
//                 setConversations((prev) =>
//                   [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   })
//                 );
//                 setSelectedConvoId(data.conversation); // Select the new one
//                 setJoinedConvos(
//                   (prev) => new Set([...prev, data.conversation])
//                 );
//                 navigate(`/conversation/${data.conversation_id}`);
//               }
//             }
//           } else if (result.type === "chat.message") {
//             const convoId = data.conversation;
//             if (convoId) {
//               setMessages((prev) => {
//                 const prevMsgs = prev[convoId] || [];
//                 const optimisticIndex = prevMsgs.findIndex((msg) => {
//                   const isTemp =
//                     typeof msg.id === "string" && msg.id.startsWith("temp-");
//                   const textMatch = msg.text === data.text;
//                   const senderMatch = msg.sender.id === data.sender.id;
//                   const timeMatch =
//                     Math.abs(
//                       new Date(msg.created_at).getTime() -
//                         new Date(data.created_at).getTime()
//                     ) < 5000; // Within 5s
//                   return (
//                     (isTemp && textMatch && senderMatch) ||
//                     (textMatch && senderMatch && timeMatch)
//                   );
//                 });
//                 if (optimisticIndex !== -1) {
//                   // Replace optimistic with server version
//                   const updatedMsgs = [...prevMsgs];
//                   updatedMsgs[optimisticIndex] = {
//                     ...data,
//                     id: data.id || updatedMsgs[optimisticIndex].id,
//                   }; // Keep ID if server doesn't provide
//                   return { ...prev, [convoId]: updatedMsgs };
//                 } else {
//                   // Add as new
//                   return { ...prev, [convoId]: [...prevMsgs, data] };
//                 }
//               });
//               // Update conversation preview and last_message
//               setConversations((prev) => {
//                 const existing = prev.find((c) => c.id === convoId);
//                 if (existing) {
//                   return prev
//                     .map((c) =>
//                       c.id === convoId
//                         ? {
//                             ...c,
//                             last_message: data,
//                             preview: data.text ? data.text + (data.media ? " [Image]" : "") : (data.media ? "[Image]" : ""),
//                             time: data.created_at,
//                           }
//                         : c
//                     )
//                     .sort((a, b) => {
//                       const timeA = a.last_message
//                         ? new Date(a.last_message.created_at).getTime()
//                         : 0;
//                       const timeB = b.last_message
//                         ? new Date(b.last_message.created_at).getTime()
//                         : 0;
//                       return timeB - timeA;
//                     });
//                 } else {
//                   // For new convos
//                   const isOutgoing = data.sender.id === currentUser?.user_id;
//                   const chatWith = isOutgoing ? data.receiver : data.sender;
//                   const newConvo = {
//                     id: convoId,
//                     conversation_id: data.conversation_id || `temp-${convoId}`,
//                     currently_in_inbox:
//                       data.users_ids_who_are_currently_inbox || [],
//                     chat_with: {
//                       id: chatWith.id,
//                       full_name: chatWith.full_name,
//                       photo: chatWith.photo || "https://via.placeholder.com/40",
//                       is_online: chatWith.is_online || false,
//                       last_login: chatWith.last_login || null,
//                     },
//                     last_message: data,
//                   };
//                   return [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   });
//                 }
//               });
//             } else {
//               console.error("No conversation ID in message data:", data);
//             }
//           }
//         } catch (err) {
//           console.error("Invalid JSON received:", err);
//         }
//       };
//       ws.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         setIsConnected(false);
//         setErrorMessage("Connection error occurred.");
//       };
//       ws.onclose = (event) => {
//         console.log(
//           "Disconnected. Code:",
//           event.code,
//           "Reason:",
//           event.reason,
//           "Clean close?",
//           event.wasClean
//         );
//         setIsConnected(false);
//         if (!event.wasClean) {
//           reconnectInterval = setTimeout(connect, 5000);
//         }
//       };
//     };
//     connect();
//     return () => {
//       if (ws) ws.close();
//       if (reconnectInterval) clearTimeout(reconnectInterval);
//     };
//   }, [token, id, location.state, currentUser]); // Added dependencies
//   // New: Auto-join for new conversations when id === 'new'
//   useEffect(() => {
//     if (
//       id === "new" &&
//       location.state?.createNew &&
//       location.state?.receiver &&
//       socket &&
//       isConnected
//     ) {
//       joinConversation(location.state.receiver.id);
//     }
//   }, [id, location.state, socket, isConnected]);
//   // Fetch full message history when selecting a conversation
//   useEffect(() => {
//     if (selectedConvoId && id !== "new" && selectedConvoId !== "new") {
//       // Skip for new
//       const fetchMessages = async () => {
//         try {
//           const res = await fetch(
//             `http://10.10.12.10:3000/api/chat/conversation/${selectedConvoId}/messages`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           if (res.ok) {
//             const data = await res.json();
//             setMessages((prev) => ({ ...prev, [selectedConvoId]: data }));
//           } else {
//             console.error("Failed to fetch messages");
//           }
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };
//       fetchMessages();
//       // Join conversation if not already joined
//       if (socket && isConnected && !joinedConvos.has(selectedConvoId)) {
//         const convo = conversations.find((c) => c.id === selectedConvoId);
//         console.log(convo);
//         if (convo) {
//           const payload = {
//             type: "chat.join",
//             data: { conversation: selectedConvoId },
//             receiver: convo.chat_with.id,
//           };
//           socket.send(JSON.stringify(payload));
//           setJoinedConvos((prev) => new Set([...prev, selectedConvoId]));
//         }
//       }
//     }
//   }, [
//     selectedConvoId,
//     socket,
//     isConnected,
//     conversations,
//     joinedConvos,
//     token,
//     id, // Added id
//   ]);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages[selectedConvoId]]);
//   // Set selected conversation from URL param
//   useEffect(() => {
//     if (id && id !== "new" && conversations.length > 0) {
//       const selected = conversations.find(
//         (convo) => convo.conversation_id === id
//       );
//       if (selected) {
//         setSelectedConvoId(selected.id);
//       }
//     } else if (id === "new") {
//       setSelectedConvoId("new");
//     }
//   }, [id, conversations]);
//   // Initialize messages for new conversation
//   useEffect(() => {
//     if (id === "new") {
//       setMessages((prev) => ({ ...prev, new: [] }));
//     }
//   }, [id]);
//   // New: Join conversation function (for new or existing)
//   const joinConversation = (receiverId) => {
//     if (socket && isConnected) {
//       let generatedId = "";
//       if (id === "new") {
//         // Generate new UUID for new conversation
//         const uuid1 = crypto.randomUUID().replace(/-/g, "");
//         const uuid2 = crypto.randomUUID().replace(/-/g, "");
//         generatedId = uuid1 + uuid2;
//       }
//       const payload = {
//         type: "chat.join",
//         data: { conversation_id: generatedId }, // Empty or generated for new
//         receiver: receiverId,
//       };
//       console.log("Sending join:", payload);
//       socket.send(JSON.stringify(payload));
//     } else {
//       setErrorMessage("Not connected. Cannot join conversation.");
//     }
//   };
//   const sendMessage = () => {
//     if (selectedConvoId === "new") return; // Prevent sending in temp new state
//     if (message.trim() && socket && isConnected && selectedConvoId) {
//       const convo = conversations.find((c) => c.id === selectedConvoId);
//       if (!convo) return;
//       const payload = {
//         type: "chat.message",
//         text: message.trim(),
//         receiver: convo.chat_with.id,
//         message_type: "Text",
//         conversation: selectedConvoId,
//       };
//       socket.send(JSON.stringify(payload));
//       // Optimistic add with temp ID
//       const tempId = `temp-${Date.now()}`;
//       const newMsg = {
//         ...payload,
//         sender: currentUser
//           ? { id: currentUser.user_id, full_name: currentUser.full_name }
//           : { id: -1, full_name: "Me" },
//         receiver: convo.chat_with,
//         created_at: new Date().toISOString(),
//         id: tempId, // For dedupe
//       };
//       setMessages((prev) => ({
//         ...prev,
//         [selectedConvoId]: [...(prev[selectedConvoId] || []), newMsg],
//       }));
//       // Update preview
//       setConversations((prev) =>
//         prev
//           .map((c) =>
//             c.id === selectedConvoId
//               ? {
//                   ...c,
//                   last_message: newMsg,
//                   preview: message.trim(),
//                   time: newMsg.created_at,
//                 }
//               : c
//           )
//           .sort((a, b) => {
//             const timeA = a.last_message
//               ? new Date(a.last_message.created_at).getTime()
//               : 0;
//             const timeB = b.last_message
//               ? new Date(b.last_message.created_at).getTime()
//               : 0;
//             return timeB - timeA;
//           })
//       );
//       setMessage("");
//       setErrorMessage("");
//     }
//   };
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredConversations = conversations.filter((convo) => {
//     const matchesSearch = convo.chat_with.full_name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });
//   const handleDropdownAction = (action) => {
//     if (action === "archive") {
//       alert(`Archived chat with ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "mute") {
//       alert(`Muted notifications for ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "delete") {
//       if (
//         window.confirm(
//           `Are you sure you want to delete the chat with ${currentConvo?.chat_with.full_name}?`
//         )
//       ) {
//         setConversations((prev) =>
//           prev.filter((convo) => convo.id !== selectedConvoId)
//         );
//         setMessages((prev) => {
//           const newMessages = { ...prev };
//           delete newMessages[selectedConvoId];
//           return newMessages;
//         });
//         setSelectedConvoId(null);
//         setShowSidebar(false);
//       }
//     }
//     setShowDropdown(false);
//   };
//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };
//   let currentConvo = conversations.find(
//     (convo) => convo.id === selectedConvoId
//   );
//   if (!currentConvo && id === "new" && location.state?.receiver) {
//     currentConvo = {
//       chat_with: {
//         ...location.state.receiver,
//         is_online: false,
//         last_login: null,
//       },
//     };
//   }
//   console.log(currentConvo, "-----------------------------");

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div className="flex h-[91vh] overflow-hidden bg-white border-b border-gray-200">
//       {/* Connection Status */}
//       <div
//         className={`fixed top-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
//           isConnected
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }`}
//       >
//         {isConnected ? "Connected" : "Disconnected"}
//       </div>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full shadow-md hover:bg-[#B0A8E0] transition-colors"
//         onClick={toggleSidebar}
//       >
//         {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>
//       <div
//         className={`${
//           showSidebar ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto shadow-lg lg:shadow-none`}
//       >
//         <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
//           <div className="flex items-center justify-between mb-3 sm:mb-4">
//             <div className="relative flex-1 ml-2">
//               <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 placeholder="Search contacts..."
//                 className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {filteredConversations.length > 0 ? (
//             filteredConversations.map((convo) => (
//               <div
//                 key={convo.id}
//                 onClick={() => {
//                   setSelectedConvoId(convo.id);
//                   if (socket && isConnected) {
//                     const payload = {
//                       type: "chat.join",
//                       receiver: convo.chat_with.id,
//                     };
//                     socket.send(JSON.stringify(payload));
//                   }
//                   navigate(`/conversation/${convo.conversation_id}`);
//                   setShowSidebar(false);
//                 }}
//                 className={`flex items-center p-3 sm:p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors ${
//                   selectedConvoId === convo.id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={convo.chat_with.photo}
//                     alt={convo.chat_with.full_name}
//                     className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex-shrink-0 shadow-sm"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://via.placeholder.com/40"; // Fallback
//                     }}
//                   />
//                   {convo.chat_with.is_online && (
//                     <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                   )}
//                 </div>
//                 <div className="ml-2 sm:ml-3 flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
//                       {convo.chat_with.full_name}
//                     </h3>
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-gray-500">
//                         {convo.last_message
//                           ? new Date(
//                               convo.last_message.created_at
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
//                     {convo.last_message?.text ? convo.last_message.text + (convo.last_message?.media ? " [Image]" : "") : (convo.last_message?.media ? "Image" : "")}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
//               No conversations found.
//             </p>
//           )}
//         </div>
//       </div>
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {currentConvo ? (
//           <>
//             <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <button
//                     className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                     onClick={toggleSidebar}
//                   >
//                     <Menu className="w-5 h-5" />
//                   </button>
//                   <div className="relative">
//                     <img
//                       src={currentConvo.chat_with.photo}
//                       alt={currentConvo.chat_with.full_name}
//                       className="w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-sm"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                     {currentConvo.chat_with.is_online && (
//                       <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-sm sm:text-base text-gray-900">
//                       {currentConvo.chat_with.full_name}
//                     </h2>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
//                       <span>
//                         {currentConvo.chat_with.is_online
//                           ? "Online"
//                           : currentConvo.chat_with.last_login
//                           ? `Last seen: ${new Date(
//                               currentConvo.chat_with.last_login
//                             ).toLocaleString()}`
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <MoreHorizontal className="w-5 h-5 text-gray-400" />
//                 </button>
//               </div>
//               {showDropdown && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute right-2 sm:right-4 top-10 sm:top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
//                 >
//                   <button
//                     onClick={() => handleDropdownAction("archive")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <Archive className="w-4 h-4" /> Archive Chat
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("mute")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <BellOff className="w-4 h-4" /> Mute Notifications
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("delete")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete Chat
//                   </button>
//                 </div>
//               )}
//             </div>
//             {/* Messages */}
//             <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 flex flex-col-reverse">
//               <div ref={messagesEndRef} /> {/* For scroll */}
//               {messages[selectedConvoId]?.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`mb-2 sm:mb-3 ${
//                     msg.sender.id === currentUser?.user_id
//                       ? "flex justify-end"
//                       : "flex justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] sm:max-w-[60%] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-md ${
//                       msg.sender.id === currentUser?.user_id
//                         ? "bg-[#C8C1F5] text-black rounded-br-none"
//                         : "bg-white text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     {msg.media && (
//                       <img
//                         src={msg.media}
//                         alt="message media"
//                         className="max-w-full h-auto rounded"
//                       />
//                     )}
//                     {msg.text && (
//                       <p className={`text-xs sm:text-sm break-words ${msg.media ? "mt-2" : ""}`}>{msg.text}</p>
//                     )}
//                     <div
//                       className={`text-xs mt-1 ${
//                         msg.sender.id === currentUser?.user_id
//                           ? "text-gray-700"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {new Date(msg.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Message Input */}
//             <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-sm">
//               {errorMessage && (
//                 <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
//               )}
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex-1 relative">
//                   {/* Image preview */}
//                   {selectedImage && (
//                     <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
//                       <div className="relative">
//                         <img
//                           src={selectedImage}
//                           alt="Selected"
//                           className="w-20 h-20 object-cover rounded"
//                         />
//                         <button
//                           onClick={removeImage}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSend()}
//                     placeholder={
//                       isConnected ? "Type a message..." : "Connecting..."
//                     }
//                     disabled={
//                       !isConnected ||
//                       !selectedConvoId ||
//                       selectedConvoId === "new"
//                     }
//                     className="w-full pl-3 sm:pl-4 pr-20 sm:pr-24 py-2 sm:py-3 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm disabled:opacity-50 focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//                   />

//                   {/* Image upload and Create Offer buttons inside input */}
//                   <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                     {/* Image Upload Button */}
//                     <label className={`cursor-pointer p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors ${(!selectedConvoId || selectedConvoId === "new") ? "opacity-50 cursor-not-allowed" : ""}`}>
//                       <ImagePlus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         disabled={
//                           !selectedConvoId ||
//                           selectedConvoId === "new"
//                         }
//                         className="hidden"
//                       />
//                     </label>

//                     {/* Create Offer Button */}
//                     {
//                       user && user.role === "Seller" && (
//                         <button
//                           onClick={handleCreateOffer}
//                           disabled={
//                             !isConnected ||
//                             !selectedConvoId ||
//                             selectedConvoId === "new"
//                           }
//                           className="p-1.5 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gray-200"
//                           title="Create Offer"
//                         >
//                           <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />{" "}
//                           Create Offer
//                         </button>
//                       )
//                     }
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSend}
//                   disabled={
//                     !(message.trim() || imageFile) ||
//                     !isConnected ||
//                     !selectedConvoId ||
//                     selectedConvoId === "new"
//                   }
//                   className="bg-[#C8C1F5] disabled:bg-gray-300 disabled:cursor-not-allowed text-black p-2 sm:p-3 rounded-full hover:bg-[#B0A8E0] transition-colors shadow-sm"
//                 >
//                   <Send className="w-4 sm:w-5 h-4 sm:h-5" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm bg-gray-50">
//             {id === "new"
//               ? "Starting new conversation..."
//               : "Select a conversation to start chatting"}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }























// import { useState, useRef, useEffect } from "react";
// import { getCookie } from "../../lib/cookie-utils";
// import {
//   Send,
//   X,
//   Search,
//   MoreHorizontal,
//   Menu,
//   Archive,
//   BellOff,
//   Trash2,
// } from "lucide-react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// // Polyfill for crypto.randomUUID if not supported
// if (!crypto.randomUUID) {
//   crypto.randomUUID = function randomUUID() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//       (
//         c ^
//         (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//       ).toString(16)
//     );
//   };
// }
// export default function ConversationPage() {
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentUser, setCurrentUser] = useState(null);
//   const [message, setMessage] = useState("");
//   const [selectedConvoId, setSelectedConvoId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [joinedConvos, setJoinedConvos] = useState(new Set());
//   const token = getCookie("access_token");
//   const dropdownRef = useRef(null);
//   const messagesEndRef = useRef(null); // For auto-scroll
//   const navigate = useNavigate();
//   const location = useLocation(); // To access state for new conversations
//   const { id } = useParams();
//   console.log(currentUser);
//   console.log(conversations, "conversations ");

//   console.log(messages, "Messages ");
//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await fetch("http://10.10.12.10:3000/api/user/retrieve", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setCurrentUser(data);
//         } else {
//           console.error("Failed to fetch current user");
//         }
//       } catch (err) {
//         console.error("Error fetching current user:", err);
//       }
//     };
//     fetchCurrentUser();
//   }, [token]);
//   // Fetch conversations (made into a reusable function)
//   const fetchConvos = async () => {
//     try {
//       const res = await fetch(
//         "http://10.10.12.10:3000/api/chat/conversations",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(res, "database-------------------------------");
//       if (res.ok) {
//         let data = await res.json();
//         // Sort by last message time descending
//         data.sort((a, b) => {
//           const timeA = a.last_message
//             ? new Date(a.last_message.created_at).getTime()
//             : 0;
//           const timeB = b.last_message
//             ? new Date(b.last_message.created_at).getTime()
//             : 0;
//           return timeB - timeA;
//         });
//         setConversations(data.map((convo) => ({ ...convo, starred: false }))); // Add starred locally
//         // Initialize messages with last_message if present
//         const initialMessages = {};
//         data.forEach((convo) => {
//           initialMessages[convo.id] = convo.last_message
//             ? [convo.last_message]
//             : [];
//         });
//         setMessages(initialMessages);
//       } else {
//         console.error("Failed to fetch conversations");
//       }
//     } catch (err) {
//       console.error("Error fetching conversations:", err);
//     }
//   };
//   // Fetch conversations on mount and when id changes (to refresh after new creation)
//   useEffect(() => {
//     fetchConvos();
//   }, [token, id]); // Added id to dependencies to re-fetch on navigation (e.g., after creating new)
//   // WebSocket connection
//   useEffect(() => {
//     if (!token) return;
//     let ws;
//     let reconnectInterval;
//     const connect = () => {
//       const url = `ws://10.10.12.10:3000/ws/chat?token=${token}`;
//       ws = new WebSocket(url);
//       ws.onopen = () => {
//         console.log("Connected to WebSocket");
//         setIsConnected(true);
//         setSocket(ws);
//         setErrorMessage("");
//       };
//       ws.onmessage = (event) => {

//         try {
//           const result = JSON.parse(event.data);
//           const data = result.data;
//           if (
//             result.type === "message.field_error" ||
//             result.type === "chat.error" ||
//             result.type === "message_field_error"
//           ) {
//             const errors = Object.entries(result)
//               .filter(([key]) => key !== "type")
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//             setErrorMessage(
//               errors || result.text || result.message || JSON.stringify(result)
//             );
//           } else if (result.type === "chat.join") {
//             // Handle join if needed, e.g., update inbox users
//             if (data.conversation) {
//               setConversations((prev) =>
//                 prev.map((c) =>
//                   c.id === data.conversation
//                     ? {
//                         ...c,
//                         currently_in_inbox:
//                           data.users_ids_who_are_currently_inbox || [],
//                       }
//                     : c
//                 )
//               );
//             }
//             // New: For new conversations, add the new convo locally and navigate
//             if (data.conversation_id && id === "new") {
//               const receiver = location.state?.receiver;
//               if (receiver) {
//                 const newConvo = {
//                   id: data.conversation, // PK
//                   conversation_id: data.conversation_id, // UUID
//                   currently_in_inbox:
//                     data.users_ids_who_are_currently_inbox || [],
//                   chat_with: {
//                     id: receiver.id,
//                     full_name: receiver.full_name,
//                     photo: receiver.photo || "https://via.placeholder.com/40",
//                     is_online: false, // Default, update if needed
//                     last_login: null,
//                   },
//                   last_message: null, // No message yet
//                 };
//                 setConversations((prev) =>
//                   [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   })
//                 );
//                 setSelectedConvoId(data.conversation); // Select the new one
//                 setJoinedConvos(
//                   (prev) => new Set([...prev, data.conversation])
//                 );
//                 navigate(`/conversation/${data.conversation_id}`);
//               }
//             }
//           } else if (result.type === "chat.message") {
//             const convoId = data.conversation;
//             if (convoId) {
//               setMessages((prev) => {
//                 const prevMsgs = prev[convoId] || [];
//                 const optimisticIndex = prevMsgs.findIndex((msg) => {
//                   const isTemp =
//                     typeof msg.id === "string" && msg.id.startsWith("temp-");
//                   const textMatch = msg.text === data.text;
//                   const senderMatch = msg.sender.id === data.sender.id;
//                   const timeMatch =
//                     Math.abs(
//                       new Date(msg.created_at).getTime() -
//                         new Date(data.created_at).getTime()
//                     ) < 5000; // Within 5s
//                   return (
//                     (isTemp && textMatch && senderMatch) ||
//                     (textMatch && senderMatch && timeMatch)
//                   );
//                 });
//                 if (optimisticIndex !== -1) {
//                   // Replace optimistic with server version
//                   const updatedMsgs = [...prevMsgs];
//                   updatedMsgs[optimisticIndex] = {
//                     ...data,
//                     id: data.id || updatedMsgs[optimisticIndex].id,
//                   }; // Keep ID if server doesn't provide
//                   return { ...prev, [convoId]: updatedMsgs };
//                 } else {
//                   // Add as new
//                   return { ...prev, [convoId]: [...prevMsgs, data] };
//                 }
//               });
//               // Update conversation preview and last_message
//               setConversations((prev) => {
//                 const existing = prev.find((c) => c.id === convoId);
//                 if (existing) {
//                   return prev
//                     .map((c) =>
//                       c.id === convoId
//                         ? {
//                             ...c,
//                             last_message: data,
//                             preview: data.text || "",
//                             time: data.created_at,
//                           }
//                         : c
//                     )
//                     .sort((a, b) => {
//                       const timeA = a.last_message
//                         ? new Date(a.last_message.created_at).getTime()
//                         : 0;
//                       const timeB = b.last_message
//                         ? new Date(b.last_message.created_at).getTime()
//                         : 0;
//                       return timeB - timeA;
//                     });
//                 } else {
//                   // For new convos
//                   const isOutgoing = data.sender.id === currentUser?.user_id;
//                   const chatWith = isOutgoing ? data.receiver : data.sender;
//                   const newConvo = {
//                     id: convoId,
//                     conversation_id: data.conversation_id || `temp-${convoId}`,
//                     currently_in_inbox:
//                       data.users_ids_who_are_currently_inbox || [],
//                     chat_with: {
//                       id: chatWith.id,
//                       full_name: chatWith.full_name,
//                       photo: chatWith.photo || "https://via.placeholder.com/40",
//                       is_online: chatWith.is_online || false,
//                       last_login: chatWith.last_login || null,
//                     },
//                     last_message: data,
//                   };
//                   return [...prev, newConvo].sort((a, b) => {
//                     const timeA = a.last_message
//                       ? new Date(a.last_message.created_at).getTime()
//                       : 0;
//                     const timeB = b.last_message
//                       ? new Date(b.last_message.created_at).getTime()
//                       : 0;
//                     return timeB - timeA;
//                   });
//                 }
//               });
//             } else {
//               console.error("No conversation ID in message data:", data);
//             }
//           }
//         } catch (err) {
//           console.error("Invalid JSON received:", err);
//         }
//       };
//       ws.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         setIsConnected(false);
//         setErrorMessage("Connection error occurred.");
//       };
//       ws.onclose = (event) => {
//         console.log(
//           "Disconnected. Code:",
//           event.code,
//           "Reason:",
//           event.reason,
//           "Clean close?",
//           event.wasClean
//         );
//         setIsConnected(false);
//         if (!event.wasClean) {
//           reconnectInterval = setTimeout(connect, 5000);
//         }
//       };
//     };
//     connect();
//     return () => {
//       if (ws) ws.close();
//       if (reconnectInterval) clearTimeout(reconnectInterval);
//     };
//   }, [token, id, location.state, currentUser]); // Added dependencies
//   // New: Auto-join for new conversations when id === 'new'
//   useEffect(() => {
//     if (
//       id === "new" &&
//       location.state?.createNew &&
//       location.state?.receiver &&
//       socket &&
//       isConnected
//     ) {
//       joinConversation(location.state.receiver.id);
//     }
//   }, [id, location.state, socket, isConnected]);
//   // Fetch full message history when selecting a conversation
//   useEffect(() => {
//     if (selectedConvoId && id !== "new" && selectedConvoId !== "new") {
//       // Skip for new
//       const fetchMessages = async () => {
//         try {
//           const res = await fetch(
//             `http://10.10.12.10:3000/api/chat/conversation/${selectedConvoId}/messages`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           if (res.ok) {
//             const data = await res.json();
//             setMessages((prev) => ({ ...prev, [selectedConvoId]: data }));
//             // Update last_message seen to true locally
//             setConversations((prev) =>
//               prev.map((c) =>
//                 c.id === selectedConvoId && c.last_message
//                   ? { ...c, last_message: { ...c.last_message, seen: true } }
//                   : c
//               )
//             );
//           } else {
//             console.error("Failed to fetch messages");
//           }
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };
//       fetchMessages();
//       // Join conversation if not already joined
//       if (socket && isConnected && !joinedConvos.has(selectedConvoId)) {
//         const convo = conversations.find((c) => c.id === selectedConvoId);
//         console.log(convo);
//         if (convo) {
//           const payload = {
//             type: "chat.join",
//             data: { conversation: selectedConvoId },
//             receiver: convo.chat_with.id,
//           };
//           socket.send(JSON.stringify(payload));
//           setJoinedConvos((prev) => new Set([...prev, selectedConvoId]));
//         }
//       }
//     }
//   }, [
//     selectedConvoId,
//     socket,
//     isConnected,
//     conversations,
//     joinedConvos,
//     token,
//     id, // Added id
//   ]);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages[selectedConvoId]]);
//   // Set selected conversation from URL param
//   useEffect(() => {
//     if (id && id !== "new" && conversations.length > 0) {
//       const selected = conversations.find(
//         (convo) => convo.conversation_id === id
//       );
//       if (selected) {
//         setSelectedConvoId(selected.id);
//       }
//     } else if (id === "new") {
//       setSelectedConvoId("new");
//     }
//   }, [id, conversations]);
//   // Initialize messages for new conversation
//   useEffect(() => {
//     if (id === "new") {
//       setMessages((prev) => ({ ...prev, new: [] }));
//     }
//   }, [id]);
//   // New: Join conversation function (for new or existing)
//   const joinConversation = (receiverId) => {
//     if (socket && isConnected) {
//       let generatedId = "";
//       if (id === "new") {
//         // Generate new UUID for new conversation
//         const uuid1 = crypto.randomUUID().replace(/-/g, "");
//         const uuid2 = crypto.randomUUID().replace(/-/g, "");
//         generatedId = uuid1 + uuid2;
//       }
//       const payload = {
//         type: "chat.join",
//         data: { conversation_id: generatedId }, // Empty or generated for new
//         receiver: receiverId,
//       };
//       console.log("Sending join:", payload);
//       socket.send(JSON.stringify(payload));
//     } else {
//       setErrorMessage("Not connected. Cannot join conversation.");
//     }
//   };
//   const sendMessage = () => {
//     if (selectedConvoId === "new") return; // Prevent sending in temp new state
//     if (message.trim() && socket && isConnected && selectedConvoId) {
//       const convo = conversations.find((c) => c.id === selectedConvoId);
//       if (!convo) return;
//       const payload = {
//         type: "chat.message",
//         text: message.trim(),
//         receiver: convo.chat_with.id,
//         message_type: "Text",
//         conversation: selectedConvoId,
//       };
//       socket.send(JSON.stringify(payload));
//       // Optimistic add with temp ID
//       const tempId = `temp-${Date.now()}`;
//       const newMsg = {
//         ...payload,
//         sender: currentUser
//           ? { id: currentUser.user_id, full_name: currentUser.full_name }
//           : { id: -1, full_name: "Me" },
//         receiver: convo.chat_with,
//         created_at: new Date().toISOString(),
//         id: tempId, // For dedupe
//       };
//       setMessages((prev) => ({
//         ...prev,
//         [selectedConvoId]: [...(prev[selectedConvoId] || []), newMsg],
//       }));
//       // Update preview
//       setConversations((prev) =>
//         prev
//           .map((c) =>
//             c.id === selectedConvoId
//               ? {
//                   ...c,
//                   last_message: newMsg,
//                   preview: message.trim(),
//                   time: newMsg.created_at,
//                 }
//               : c
//           )
//           .sort((a, b) => {
//             const timeA = a.last_message
//               ? new Date(a.last_message.created_at).getTime()
//               : 0;
//             const timeB = b.last_message
//               ? new Date(b.last_message.created_at).getTime()
//               : 0;
//             return timeB - timeA;
//           })
//       );
//       setMessage("");
//       setErrorMessage("");
//     }
//   };
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredConversations = conversations.filter((convo) => {
//     const matchesSearch = convo.chat_with.full_name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });
//   const handleDropdownAction = (action) => {
//     if (action === "archive") {
//       alert(`Archived chat with ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "mute") {
//       alert(`Muted notifications for ${currentConvo?.chat_with.full_name}`);
//     } else if (action === "delete") {
//       if (
//         window.confirm(
//           `Are you sure you want to delete the chat with ${currentConvo?.chat_with.full_name}?`
//         )
//       ) {
//         setConversations((prev) =>
//           prev.filter((convo) => convo.id !== selectedConvoId)
//         );
//         setMessages((prev) => {
//           const newMessages = { ...prev };
//           delete newMessages[selectedConvoId];
//           return newMessages;
//         });
//         setSelectedConvoId(null);
//         setShowSidebar(false);
//       }
//     }
//     setShowDropdown(false);
//   };
//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };
//   let currentConvo = conversations.find(
//     (convo) => convo.id === selectedConvoId
//   );
//   if (!currentConvo && id === "new" && location.state?.receiver) {
//     currentConvo = {
//       chat_with: {
//         ...location.state.receiver,
//         is_online: false,
//         last_login: null,
//       },
//     };
//   }
//   console.log(currentConvo, "-----------------------------");
//   return (
//     <div className="flex h-[91vh] overflow-hidden bg-white border-b border-gray-200">
//       {/* Connection Status */}
//       <div
//         className={`fixed top-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
//           isConnected
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }`}
//       >
//         {isConnected ? "Connected" : "Disconnected"}
//       </div>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full shadow-md hover:bg-[#B0A8E0] transition-colors"
//         onClick={toggleSidebar}
//       >
//         {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>
//       <div
//         className={`${
//           showSidebar ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto shadow-lg lg:shadow-none`}
//       >
//         <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
//           <div className="flex items-center justify-between mb-3 sm:mb-4">
//             <div className="relative flex-1 ml-2">
//               <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 placeholder="Search contacts..."
//                 className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {filteredConversations.length > 0 ? (
//             filteredConversations.map((convo) => (
//               <div
//                 key={convo.id}
//                 onClick={() => {
//                   setSelectedConvoId(convo.id);
//                   if(socket && isConnected){
//                     const payload = {
//                       type: "chat.join",
//                       receiver: convo.chat_with.id,
//                     };
//                     socket.send(JSON.stringify(payload));
//                   }
//                   navigate(`/conversation/${convo.conversation_id}`);
//                   setShowSidebar(false);
//                 }}
//                 className={`flex items-center p-3 sm:p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors ${
//                   selectedConvoId === convo.id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={convo.chat_with.photo}
//                     alt={convo.chat_with.full_name}
//                     className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex-shrink-0 shadow-sm"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://via.placeholder.com/40"; // Fallback
//                     }}
//                   />
//                   {convo.chat_with.is_online && (
//                     <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                   )}
//                 </div>
//                 <div className="ml-2 sm:ml-3 flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className={`text-xs sm:text-sm font-semibold text-gray-900 truncate ${convo.last_message && !convo.last_message.seen ? 'font-bold' : ''}`}>
//                       {convo.chat_with.full_name}
//                     </h3>
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-gray-500">
//                         {convo.last_message
//                           ? new Date(
//                               convo.last_message.created_at
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                   <p className={`text-xs sm:text-sm text-gray-500 truncate mt-1 ${convo.last_message && !convo.last_message.seen ? 'font-bold text-black' : ''}`}>
//                     {convo.last_message?.text || ""}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
//               No conversations found.
//             </p>
//           )}
//         </div>
//       </div>
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {currentConvo ? (
//           <>
//             <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <button
//                     className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                     onClick={toggleSidebar}
//                   >
//                     <Menu className="w-5 h-5" />
//                   </button>
//                   <div className="relative">
//                     <img
//                       src={currentConvo.chat_with.photo}
//                       alt={currentConvo.chat_with.full_name}
//                       className="w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-sm"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                     {currentConvo.chat_with.is_online && (
//                       <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-sm sm:text-base text-gray-900">
//                       {currentConvo.chat_with.full_name}
//                     </h2>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
//                       <span>
//                         {currentConvo.chat_with.is_online
//                           ? "Online"
//                           : currentConvo.chat_with.last_login
//                           ? `Last seen: ${new Date(
//                               currentConvo.chat_with.last_login
//                             ).toLocaleString()}`
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <MoreHorizontal className="w-5 h-5 text-gray-400" />
//                 </button>
//               </div>
//               {showDropdown && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute right-2 sm:right-4 top-10 sm:top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
//                 >
//                   <button
//                     onClick={() => handleDropdownAction("archive")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <Archive className="w-4 h-4" /> Archive Chat
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("mute")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <BellOff className="w-4 h-4" /> Mute Notifications
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("delete")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete Chat
//                   </button>
//                 </div>
//               )}
//             </div>
//             {/* Messages */}
//             <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 flex flex-col-reverse">
//               <div ref={messagesEndRef} /> {/* For scroll */}
//               {messages[selectedConvoId]?.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`mb-2 sm:mb-3 ${
//                     msg.sender.id === currentUser?.user_id
//                       ? "flex justify-end"
//                       : "flex justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] sm:max-w-[60%] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-md ${
//                       msg.sender.id === currentUser?.user_id
//                         ? "bg-[#C8C1F5] text-black rounded-br-none"
//                         : "bg-white text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-xs sm:text-sm break-words">{msg.text}</p>
//                     <div
//                       className={`text-xs mt-1 ${
//                         msg.sender.id === currentUser?.user_id
//                           ? "text-gray-700"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {new Date(msg.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Message Input */}
//             <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-sm">
//               {errorMessage && (
//                 <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
//               )}
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex-1 relative">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     placeholder={
//                       isConnected ? "Type a message..." : "Connecting..."
//                     }
//                     disabled={!isConnected || !selectedConvoId || selectedConvoId === "new"}
//                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm disabled:opacity-50 focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
//                   />
//                 </div>
//                 <button
//                   onClick={sendMessage}
//                   disabled={!message.trim() || !isConnected || !selectedConvoId || selectedConvoId === "new"}
//                   className="bg-[#C8C1F5] disabled:bg-gray-300 disabled:cursor-not-allowed text-black p-2 sm:p-3 rounded-full hover:bg-[#B0A8E0] transition-colors shadow-sm"
//                 >
//                   <Send className="w-4 sm:w-5 h-4 sm:h-5" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm bg-gray-50">
//             {id === "new" ? "Starting new conversation..." : "Select a conversation to start chatting"}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
