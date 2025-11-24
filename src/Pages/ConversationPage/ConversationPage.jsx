import { useState, useRef, useEffect } from "react";
import { getCookie } from "../../lib/cookie-utils";
import {
  Send,
  X,
  Search,
  Menu,
  ImagePlus,
  Plus,
  LocationEditIcon,
  LocateIcon,
  Calendar,
  TimerIcon,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  CheckCheck,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import useSellerServices from "../../hooks/useSellerServices";
import useMe from "../../hooks/useMe";
import { Link } from "react-router-dom";
// Polyfill for crypto.randomUUID if not supported
if (!crypto.randomUUID) {
  crypto.randomUUID = function randomUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };
}
export default function ConversationPage() {
  const { user, loading } = useMe();

  const { service } = useSellerServices([]);
  console.log(service);
  const activeServices = service?.filter((s) => s.status === "Approved");

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedConvos, setJoinedConvos] = useState(new Set());
  const token = getCookie("access_token");
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null); // For auto-scroll
  const navigate = useNavigate();
  const location = useLocation(); // To access state for new conversations
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [offerDescription, setOfferDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [price, setPrice] = useState("");

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const textareaRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  // Send image
  const sendImage = async () => {
    if (!imageFile || !selectedConvoId || selectedConvoId === "new") return;
    const convo = conversations.find((c) => c.id === selectedConvoId);
    if (!convo) return;
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("media", imageFile);
      formData.append("conversation", selectedConvoId.toString());
      formData.append("receiver", convo.chat_with.id.toString());
      formData.append("message_type", "Media");
      if (message.trim()) {
        formData.append("text", message.trim());
      }
      const response = await axios.post(
        "http://10.10.12.10:3000/api/chat/send-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setMessages((prev) => {
        const prevMsgs = prev[selectedConvoId] || [];
        return { ...prev, [selectedConvoId]: [...prevMsgs, data] };
      });
      // Update conversation preview and last_message
      setConversations((prev) => {
        return prev
          .map((c) =>
            c.id === selectedConvoId
              ? {
                  ...c,
                  last_message: data,
                  preview: data.text ? data.text + " [Image]" : "[Image]",
                  time: data.created_at,
                }
              : c
          )
          .sort((a, b) => {
            const timeA = a.last_message
              ? new Date(a.last_message.created_at).getTime()
              : 0;
            const timeB = b.last_message
              ? new Date(b.last_message.created_at).getTime()
              : 0;
            return timeB - timeA;
          });
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Error sending image: " +
          (err.response ? JSON.stringify(err.response.data) : err.message)
      );
    }
  };

  // Handle create offer
  const handleCreateOffer = () => {
    setShowServiceModal(true);
  };

  // Send offer
  const sendOffer = async () => {
    if (!selectedConvoId || selectedConvoId === "new" || !selectedService)
      return;
    const convo = conversations.find((c) => c.id === selectedConvoId);
    if (!convo) return;
    setErrorMessage("");
    try {
      const offerData = {
        description: offerDescription,
        location: eventLocation,
        event_time: eventTime,
        event_date: eventDate,
        price,
      };
      const payload = {
        type: "chat.message",
        receiver: convo.chat_with.id,
        service: selectedService.id,
        conversation: selectedConvoId,
        message_type: "Offer",
        offer_data: offerData,
      };
      socket.send(JSON.stringify(payload));
      // Optimistic add with temp ID
      const tempId = `temp-${Date.now()}`;
      const newMsg = {
        ...payload,
        sender: currentUser
          ? { id: currentUser.user_id, full_name: currentUser.full_name }
          : { id: -1, full_name: "Me" },
        receiver: convo.chat_with,
        created_at: new Date().toISOString(),
        id: tempId, // For dedupe
      };
      setMessages((prev) => ({
        ...prev,
        [selectedConvoId]: [...(prev[selectedConvoId] || []), newMsg],
      }));
      // Update preview
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === selectedConvoId
              ? {
                  ...c,
                  last_message: newMsg,
                  preview: "[Offer]",
                  time: newMsg.created_at,
                }
              : c
          )
          .sort((a, b) => {
            const timeA = a.last_message
              ? new Date(a.last_message.created_at).getTime()
              : 0;
            const timeB = b.last_message
              ? new Date(b.last_message.created_at).getTime()
              : 0;
            return timeB - timeA;
          })
      );
      setShowOfferModal(false);
      // Reset form
      setOfferDescription("");
      setEventLocation("");
      setEventDate("");
      setEventTime("");
      setPrice("");
      setSelectedService(null);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Error sending offer: " +
          (err.response ? JSON.stringify(err.response.data) : err.message)
      );
    }
  };

  // Handle send (text or image)
  const handleSend = async () => {
    if (!isConnected || !selectedConvoId || selectedConvoId === "new") return;
    if (imageFile) {
      await sendImage();
      removeImage();
      setMessage("");
    } else if (message.trim()) {
      sendMessage();
    }
  };
  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://10.10.12.10:3000/api/user/retrieve", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, [token]);
  // Fetch conversations (made into a reusable function)
  const fetchConvos = async () => {
    try {
      const res = await fetch(
        "http://10.10.12.10:3000/api/chat/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        // Sort by last message time descending
        data.sort((a, b) => {
          const timeA = a.last_message
            ? new Date(a.last_message.created_at).getTime()
            : 0;
          const timeB = b.last_message
            ? new Date(b.last_message.created_at).getTime()
            : 0;
          return timeB - timeA;
        });
        setConversations(data.map((convo) => ({ ...convo, starred: false }))); // Add starred locally
        // Initialize messages with last_message if present
        const initialMessages = {};
        data.forEach((convo) => {
          initialMessages[convo.id] = convo.last_message
            ? [convo.last_message]
            : [];
        });
        setMessages(initialMessages);
      } else {
        console.error("Failed to fetch conversations");
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };
  // Fetch conversations on mount and when id changes (to refresh after new creation)
  useEffect(() => {
    fetchConvos();
  }, [token, id]); // Added id to dependencies to re-fetch on navigation (e.g., after creating new)
  // WebSocket connection
  useEffect(() => {
    if (!token) return;
    let ws;
    let reconnectInterval;
    const connect = () => {
      const url = `ws://10.10.12.10:3000/ws/chat?token=${token}`;
      ws = new WebSocket(url);
      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        setErrorMessage("");
      };
      ws.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data);
          const data = result.data;
          if (
            result.type === "message.field_error" ||
            result.type === "chat.error" ||
            result.type === "message_field_error"
          ) {
            const errors = Object.entries(result)
              .filter(([key]) => key !== "type")
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            setErrorMessage(
              errors || result.text || result.message || JSON.stringify(result)
            );
          } else if (result.type === "chat.join") {
            // Handle join if needed, e.g., update inbox users
            if (data.conversation) {
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === data.conversation
                    ? {
                        ...c,
                        currently_in_inbox:
                          data.users_ids_who_are_currently_inbox || [],
                      }
                    : c
                )
              );
            }
            // New: For new conversations, add the new convo locally and navigate
            if (data.conversation_id && id === "new") {
              const receiver = location.state?.receiver;
              if (receiver) {
                const newConvo = {
                  id: data.conversation, // PK
                  conversation_id: data.conversation_id, // UUID
                  currently_in_inbox:
                    data.users_ids_who_are_currently_inbox || [],
                  chat_with: {
                    id: receiver.id,
                    full_name: receiver.full_name,
                    photo: receiver.photo || "https://via.placeholder.com/40",
                    is_online: false, // Default, update if needed
                    last_login: null,
                  },
                  last_message: null, // No message yet
                };
                setConversations((prev) =>
                  [...prev, newConvo].sort((a, b) => {
                    const timeA = a.last_message
                      ? new Date(a.last_message.created_at).getTime()
                      : 0;
                    const timeB = b.last_message
                      ? new Date(b.last_message.created_at).getTime()
                      : 0;
                    return timeB - timeA;
                  })
                );
                setSelectedConvoId(data.conversation); // Select the new one
                setJoinedConvos(
                  (prev) => new Set([...prev, data.conversation])
                );
                navigate(`/conversation/${data.conversation_id}`);
              }
            }
          } else if (result.type === "chat.message") {
            const convoId = data.conversation;
            if (convoId) {
              setMessages((prev) => {
                const prevMsgs = prev[convoId] || [];
                const optimisticIndex = prevMsgs.findIndex((msg) => {
                  const isTemp =
                    typeof msg.id === "string" && msg.id.startsWith("temp-");
                  const textMatch = msg.text === data.text;
                  const senderMatch = msg.sender.id === data.sender.id;
                  const timeMatch =
                    Math.abs(
                      new Date(msg.created_at).getTime() -
                        new Date(data.created_at).getTime()
                    ) < 5000; // Within 5s
                  return (
                    (isTemp && textMatch && senderMatch) ||
                    (textMatch && senderMatch && timeMatch)
                  );
                });
                if (optimisticIndex !== -1) {
                  // Replace optimistic with server version
                  const updatedMsgs = [...prevMsgs];
                  updatedMsgs[optimisticIndex] = {
                    ...data,
                    id: data.id || updatedMsgs[optimisticIndex].id,
                  }; // Keep ID if server doesn't provide
                  return { ...prev, [convoId]: updatedMsgs };
                } else {
                  // Add as new
                  return { ...prev, [convoId]: [...prevMsgs, data] };
                }
              });
              // Update conversation preview and last_message
              setConversations((prev) => {
                const existing = prev.find((c) => c.id === convoId);
                if (existing) {
                  return prev
                    .map((c) =>
                      c.id === convoId
                        ? {
                            ...c,
                            last_message: data,
                            preview: data.text
                              ? data.text + (data.media ? " [Image]" : "")
                              : data.media
                              ? "[Image]"
                              : "",
                            time: data.created_at,
                          }
                        : c
                    )
                    .sort((a, b) => {
                      const timeA = a.last_message
                        ? new Date(a.last_message.created_at).getTime()
                        : 0;
                      const timeB = b.last_message
                        ? new Date(b.last_message.created_at).getTime()
                        : 0;
                      return timeB - timeA;
                    });
                } else {
                  // For new convos
                  const isOutgoing = data.sender.id === currentUser?.user_id;
                  const chatWith = isOutgoing ? data.receiver : data.sender;
                  const newConvo = {
                    id: convoId,
                    conversation_id: data.conversation_id || `temp-${convoId}`,
                    currently_in_inbox:
                      data.users_ids_who_are_currently_inbox || [],
                    chat_with: {
                      id: chatWith.id,
                      full_name: chatWith.full_name,
                      photo: chatWith.photo || "https://via.placeholder.com/40",
                      is_online: chatWith.is_online || false,
                      last_login: chatWith.last_login || null,
                    },
                    last_message: data,
                  };
                  return [...prev, newConvo].sort((a, b) => {
                    const timeA = a.last_message
                      ? new Date(a.last_message.created_at).getTime()
                      : 0;
                    const timeB = b.last_message
                      ? new Date(b.last_message.created_at).getTime()
                      : 0;
                    return timeB - timeA;
                  });
                }
              });
            } else {
              console.error("No conversation ID in message data:", data);
            }
          } else if (result.type === "chat.update_offer") {
            const { message_id, status } = result;
            setMessages((prev) => {
              const newMessages = { ...prev };
              Object.keys(newMessages).forEach((convoId) => {
                newMessages[convoId] = newMessages[convoId].map((msg) =>
                  msg.id === message_id
                    ? { ...msg, offer: { ...msg.offer, status } }
                    : msg
                );
              });
              return newMessages;
            });
          }
        } catch (err) {
          console.error("Invalid JSON received:", err);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setErrorMessage("Connection error occurred.");
        console.log(error);
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
        if (!event.wasClean) {
          reconnectInterval = setTimeout(connect, 5000);
        }
      };
    };
    connect();
    return () => {
      if (ws) ws.close();
      if (reconnectInterval) clearTimeout(reconnectInterval);
    };
  }, [token, id, location.state, currentUser]); // Added dependencies
  // New: Auto-join for new conversations when id === 'new'
  useEffect(() => {
    if (
      id === "new" &&
      location.state?.createNew &&
      location.state?.receiver &&
      socket &&
      isConnected
    ) {
      joinConversation(location.state.receiver.id);
    }
  }, [id, location.state, socket, isConnected]);
  // Fetch full message history when selecting a conversation
  useEffect(() => {
    if (selectedConvoId && id !== "new" && selectedConvoId !== "new") {
      // Skip for new
      const fetchMessages = async () => {
        try {
          const res = await fetch(
            `http://10.10.12.10:3000/api/chat/conversation/${selectedConvoId}/messages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(res);
          if (res.ok) {
            const data = await res.json();
            setMessages((prev) => ({ ...prev, [selectedConvoId]: data }));
          } else {
            console.error("Failed to fetch messages");
          }
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
      // Join conversation if not already joined
      if (socket && isConnected && !joinedConvos.has(selectedConvoId)) {
        const convo = conversations.find((c) => c.id === selectedConvoId);
        console.log(convo, "--------------------Convo");
        if (convo) {
          const payload = {
            type: "chat.join",
            data: { conversation: selectedConvoId },
            receiver: convo.chat_with.id,
          };
          socket.send(JSON.stringify(payload));
          setJoinedConvos((prev) => new Set([...prev, selectedConvoId]));
        }
      }
    }
  }, [
    selectedConvoId,
    socket,
    isConnected,
    conversations,
    joinedConvos,
    token,
    id, // Added id
  ]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedConvoId]]);
  // Set selected conversation from URL param
  useEffect(() => {
    if (id && id !== "new" && conversations.length > 0) {
      const selected = conversations.find(
        (convo) => convo.conversation_id === id
      );
      if (selected) {
        setSelectedConvoId(selected.id);
      }
    } else if (id === "new") {
      setSelectedConvoId("new");
    }
  }, [id, conversations]);
  // Initialize messages for new conversation
  useEffect(() => {
    if (id === "new") {
      setMessages((prev) => ({ ...prev, new: [] }));
    }
  }, [id]);
  // New: Join conversation function (for new or existing)
  const joinConversation = (receiverId) => {
    if (socket && isConnected) {
      let generatedId = "";
      if (id === "new") {
        // Generate new UUID for new conversation
        const uuid1 = crypto.randomUUID().replace(/-/g, "");
        const uuid2 = crypto.randomUUID().replace(/-/g, "");
        generatedId = uuid1 + uuid2;
      }
      const payload = {
        type: "chat.join",
        data: { conversation_id: generatedId },
        receiver: receiverId,
      };
      socket.send(JSON.stringify(payload));
    } else {
      setErrorMessage("Not connected. Cannot join conversation.");
    }
  };
  const sendMessage = () => {
    if (selectedConvoId === "new") return; // Prevent sending in temp new state
    if (message.trim() && socket && isConnected && selectedConvoId) {
      const convo = conversations.find((c) => c.id === selectedConvoId);
      if (!convo) return;
      const payload = {
        type: "chat.message",
        text: message.trim(),
        receiver: convo.chat_with.id,
        message_type: "Text",
        conversation: selectedConvoId,
      };
      socket.send(JSON.stringify(payload));
      // Optimistic add with temp ID
      const tempId = `temp-${Date.now()}`;
      const newMsg = {
        ...payload,
        sender: currentUser
          ? { id: currentUser.user_id, full_name: currentUser.full_name }
          : { id: -1, full_name: "Me" },
        receiver: convo.chat_with,
        created_at: new Date().toISOString(),
        id: tempId, // For dedupe
      };
      setMessages((prev) => ({
        ...prev,
        [selectedConvoId]: [...(prev[selectedConvoId] || []), newMsg],
      }));
      // Update preview
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === selectedConvoId
              ? {
                  ...c,
                  last_message: newMsg,
                  preview: message.trim(),
                  time: newMsg.created_at,
                }
              : c
          )
          .sort((a, b) => {
            const timeA = a.last_message
              ? new Date(a.last_message.created_at).getTime()
              : 0;
            const timeB = b.last_message
              ? new Date(b.last_message.created_at).getTime()
              : 0;
            return timeB - timeA;
          })
      );
      setMessage("");
      setErrorMessage("");
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  console.log(messages, "messages ----------------------------710");

  const filteredConversations = conversations.filter((convo) => {
    const matchesSearch = convo.chat_with.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  let currentConvo = conversations.find(
    (convo) => convo.id === selectedConvoId
  );
  if (!currentConvo && id === "new" && location.state?.receiver) {
    currentConvo = {
      chat_with: {
        ...location.state.receiver,
        is_online: false,
        last_login: null,
      },
    };
  }

  // Handle accept offer
  const handleAcceptOffer = (messageId) => {
    if (!socket || !isConnected) return;
    // Optimistic update
    setMessages((prev) => {
      const updatedMsgs = prev[selectedConvoId].map((msg) =>
        msg.id === messageId
          ? { ...msg, offer: { ...msg.offer, status: "Accepted" } }
          : msg
      );
      console.log(updatedMsgs, "Update Message____");
      return { ...prev, [selectedConvoId]: updatedMsgs };
    });
    // Send via socket
    const payload = {
      type: "chat.update_offer",
      message_id: messageId,
      status: "Accepted",
    };
    socket.send(JSON.stringify(payload));
  };

  // Handle decline offer
  const handleDeclineOffer = (messageId) => {
    if (!socket || !isConnected) return;
    // Optimistic update
    setMessages((prev) => {
      const updatedMsgs = prev[selectedConvoId].map((msg) =>
        msg.id === messageId
          ? { ...msg, offer: { ...msg.offer, status: "Declined" } }
          : msg
      );
      return { ...prev, [selectedConvoId]: updatedMsgs };
    });
    // Send via socket
    const payload = {
      type: "chat.update_offer",
      message_id: messageId,
      status: "Declined",
    };
    socket.send(JSON.stringify(payload));
  };

  // Handle withdraw offer
  const handleWithdrawOffer = (messageId) => {
    if (!socket || !isConnected) return;
    // Optimistic update
    setMessages((prev) => {
      const updatedMsgs = prev[selectedConvoId].map((msg) =>
        msg.id === messageId
          ? { ...msg, offer: { ...msg.offer, status: "Withdrawn" } }
          : msg
      );
      console.log(updatedMsgs, "------------Update message");
      return { ...prev, [selectedConvoId]: updatedMsgs };
    });
    // Send via socket
    const payload = {
      type: "chat.update_offer",
      message_id: messageId,
      status: "Withdrawn",
    };
    console.log(payload, "Payload --------- 790");
    socket.send(JSON.stringify(payload));
  };
  console.log(
    selectedConvoId,
    " selectedConvoId ---------------------------------- 793"
  );

  // Open image modal
  const openImageModal = (imageUrl) => {
    setSelectedModalImage(imageUrl);
    setIsImageModalOpen(true);
    setZoomLevel(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Handle mouse down
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX - translateX);
    setStartY(e.clientY - translateY);
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - startX);
    setTranslateY(e.clientY - startY);
  };

  // Handle mouse up/leave
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set sidebar visibility based on selection and screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(!selectedConvoId);
      } else {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedConvoId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        100
      )}px`; // Max 5 lines approx (20px per line)
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex md:h-[91vh] h-[84vh] overflow-hidden bg-white border-b border-gray-200">
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full shadow-md hover:bg-[#B0A8E0] transition-colors"
        onClick={toggleSidebar}
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto shadow-lg lg:shadow-none`}
      >
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="relative flex-1 ml-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search contacts..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#C8C1F5] shadow-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((convo) => (
              <div
                key={convo.id}
                onClick={() => {
                  setSelectedConvoId(convo.id);
                  if (socket && isConnected) {
                    const payload = {
                      type: "chat.join",
                      receiver: convo.chat_with.id,
                    };
                    socket.send(JSON.stringify(payload));
                  }
                  navigate(`/conversation/${convo.conversation_id}`);
                  setShowSidebar(false);
                }}
                className={`flex items-center p-3 sm:p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedConvoId === convo.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={convo.chat_with.photo}
                    alt={convo.chat_with.full_name}
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex-shrink-0 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40"; // Fallback
                    }}
                  />
                  {convo.chat_with.is_online && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                  )}
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {convo.chat_with.full_name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">
                        {convo.last_message
                          ? new Date(
                              convo.last_message.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                    {convo.last_message?.text
                      ? convo.last_message.text +
                        (convo.last_message?.media ? " [Image]" : "")
                      : convo.last_message?.media
                      ? "Image"
                      : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
              No conversations found.
            </p>
          )}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConvo ? (
          <>
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={toggleSidebar}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={currentConvo.chat_with.photo}
                      alt={currentConvo.chat_with.full_name}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    {currentConvo.chat_with.is_online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base text-gray-900">
                      {currentConvo.chat_with.full_name}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span>
                        {currentConvo.chat_with.is_online
                          ? "Online"
                          : currentConvo.chat_with.last_login
                          ? `Last seen: ${new Date(
                              currentConvo.chat_with.last_login
                            ).toLocaleString()}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 flex flex-col-reverse">
              <div ref={messagesEndRef} /> {/* For scroll */}
              {messages[selectedConvoId]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 sm:mb-3 ${
                    msg.sender.id === currentUser?.user_id
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] xs:max-w-[80%] sm:max-w-[70%] md:max-w-[60%] rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md
    ${
      msg.sender.id === currentUser?.user_id
        ? msg.message_type === "Offer" || msg.media
          ? "bg-white text-gray-800 rounded-br-none"
          : "bg-[#C8C1F5] text-black rounded-br-none"
        : "bg-white text-gray-800 rounded-bl-none"
    }`}
                  >
                    {msg.media && (
                      <img
                        src={msg.media}
                        alt="message media"
                        className="md:max-w-96 rounded-lg cursor-pointer"
                        onClick={() => openImageModal(msg.media)}
                      />
                    )}
                    {msg.text && (
                      <p
                        className={`text-xs sm:text-sm ${
                          msg.media ? "mt-2" : ""
                        }`}
                      >
                        {msg.text}
                      </p>
                    )}
                    {msg.message_type === "Offer" && (
                      <div className="p-3 bg-gray-100 rounded-lg max-w-96">
                        <h4 className="font-bold pb-2">Custom Offer Details</h4>
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {msg?.offer?.description}
                        </p>
                        <div className="text-gray-500 py-2 text-xs">
                          <p className="flex gap-1 items-center">
                            <LocateIcon className="w-4" /> Location:{" "}
                            {msg?.offer?.location}
                          </p>
                          <p className="flex gap-1 items-center">
                            <Calendar className="w-4" /> Date:{" "}
                            {msg?.offer?.event_date}
                          </p>
                          <p className="flex gap-1 items-center">
                            <TimerIcon className="w-4" /> Time:{" "}
                            {msg?.offer?.event_time}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded mt-2 flex items-center gap-2">
                          <img
                            src={msg?.offer?.service?.cover_photo}
                            alt={msg?.offer?.service?.title}
                            className="w-14 h-14 object-cover rounded"
                          />
                          <div>
                            <h5 className="font-semibold">
                              {msg?.offer?.service?.title}
                            </h5>
                            <p className="text-base font-medium">
                              Offer Price:{" "}
                              <span className="text-green-600 font-semibold">
                                ${msg?.offer?.price}
                              </span>{" "}
                              <span className="text-gray-400 line-through text-sm ml-1">
                                ${msg?.offer?.service?.price}
                              </span>
                            </p>
                          </div>
                        </div>
                        {(() => {
                          const isSeller =
                            msg?.sender?.id === currentUser?.user_id;

                          if (msg?.offer?.status === "Pending") {
                            if (isSeller) {
                              return (
                                <button
                                  onClick={() => handleWithdrawOffer(msg?.id)}
                                  className="mt-2 bg-red-100 text-red-600 px-4 py-2 rounded text-sm w-full"
                                >
                                  Withdraw offer
                                </button>
                              );
                            } else {
                              return (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleDeclineOffer(msg?.id)}
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm flex-1"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptOffer(msg?.id)}
                                    className="bg-purple-100 text-purple-600 px-4 py-2 rounded text-sm flex-1"
                                  >
                                    Accept
                                  </button>
                                </div>
                              );
                            }
                          } else if (msg?.offer?.status === "Accepted") {
                            if (isSeller) {
                              return (
                                <p className="mt-2 text-green-600 text-xs text-center font-semibold">
                                  Order Accepted
                                </p>
                              );
                            } else {
                              return (
                                <div className="w-full mt-3">
                                  <Link
                                    to="/orders"
                                    state={{ activeTab: "Accepted" }}
                                    className="mt-2 bg-green-100 flex items-center justify-center text-green-600 px-4 py-2 rounded text-sm w-full"
                                  >
                                    View Order Details
                                  </Link>
                                </div>
                              );
                            }
                          } else if (msg?.offer?.status === "Declined") {
                            if (isSeller) {
                              return (
                                <p className="mt-2 text-red-500 text-xs text-center font-semibold">
                                  User Declined the offer
                                </p>
                              );
                            } else {
                              return (
                                <p className="mt-2 text-red-500 text-xs text-center font-semibold">
                                  You Declined the offer
                                </p>
                              );
                            }
                          } else if (msg?.offer?.status === "Withdrawn") {
                            if (isSeller) {
                              return (
                                <p className="mt-2 text-red-500 text-xs text-center font-semibold">
                                  You withdrew the offer
                                </p>
                              );
                            } else {
                              return (
                                <p className="mt-2 text-red-500 text-xs text-center font-semibold">
                                  Seller withdrew the offer
                                </p>
                              );
                            }
                          }
                        })()}
                      </div>
                    )}
                    <div
                      className={`text-xs mt-1 flex gap-3 items-center ${
                        msg?.sender?.id === currentUser?.user_id
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg?.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg?.sender?.id === currentUser?.user_id
                          ? <CheckCheck className="w-3"/>
                          : null
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-sm">
              {errorMessage && (
                <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
              )}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  {/* Image preview */}
                  {selectedImage && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isConnected ? "Type a message..." : "Connecting..."
                    }
                    disabled={
                      !isConnected ||
                      !selectedConvoId ||
                      selectedConvoId === "new"
                    }
                    className="w-full pl-3 sm:pl-4 pr-20 sm:pr-24 py-3 bg-gray-100 rounded-lg outline-none border border-gray-300 text-xs sm:text-sm disabled:opacity-50 shadow-sm overflow-hidden resize-none"
                    rows={1}
                    style={{ maxHeight: "100px" }} // Approx 5 lines
                  />

                  {/* Image upload and Create Offer buttons inside input */}
                  <div className="absolute right-1 bottom-3 flex items-center gap-1">
                    {/* Image Upload Button */}
                    <label
                      className={`cursor-pointer p-1.5 sm:p-2transition-colors ${
                        !selectedConvoId || selectedConvoId === "new"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <ImagePlus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={!selectedConvoId || selectedConvoId === "new"}
                        className="hidden"
                      />
                    </label>

                    {/* Create Offer Button */}
                    {user && user.role === "Seller" && (
                      <button
                        onClick={handleCreateOffer}
                        disabled={
                          !isConnected ||
                          !selectedConvoId ||
                          selectedConvoId === "new"
                        }
                        className="md:p-1.5 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gray-200"
                        title="Create Offer"
                      >
                        <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />{" "}
                        Create Offer
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={
                    !(message.trim() || imageFile) ||
                    !isConnected ||
                    !selectedConvoId ||
                    selectedConvoId === "new"
                  }
                  className="bg-[#C8C1F5] disabled:bg-gray-300 disabled:cursor-not-allowed text-black p-3 -mt-1.5 rounded-lg hover:bg-[#B0A8E0] transition-colors shadow-sm"
                >
                  <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm bg-gray-50">
            {id === "new"
              ? "Starting new conversation..."
              : "Select a conversation to start chatting"}
          </div>
        )}
      </div>
      {/* Service Selection Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Services</h2>
              <button onClick={() => setShowServiceModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {activeServices.map((service) => {
                const truncatedDesc =
                  service.description.split(" ").slice(0, 10).join(" ") +
                  (service.description.split(" ").length > 10 ? "..." : "");
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setPrice(service.price);
                      setShowServiceModal(false);
                      setShowOfferModal(true);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg border border-gray-200"
                  >
                    <img
                      src={service.cover_photo}
                      alt={service.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-gray-600">{truncatedDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Offer Creation Modal */}
      {showOfferModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selectedService.title}</h2>
              <button onClick={() => setShowOfferModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedService.cover_photo}
                  alt={selectedService.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <textarea
                  value={offerDescription}
                  placeholder="Write description"
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-5 p-4 border border-gray-100 rounded-xl shadow-lg">
                <div>
                  <h3 className="text-md font-semibold">
                    Set up payment offer
                  </h3>
                  <label className="block text-sm font-medium mb-5">
                    Define the terms of your offer and what it includes.
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Select location"
                      className="w-full p-2 pr-10 border border-gray-300 rounded"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <LocationEditIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <button
                onClick={sendOffer}
                className="w-full bg-[#C8C1F5] text-black py-2 rounded-full hover:bg-[#B0A8E0] transition-colors"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative bg-neutral-900 rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-3 right-3 bg-black/20 backdrop-blur-lg  text-white p-1 rounded-full z-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className="flex-1 flex items-center justify-center p-4 overflow-hidden cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <img
                src={selectedModalImage}
                alt="Full view"
                className="max-w-full max-h-full object-contain select-none pointer-events-none transition-transform duration-200"
                style={{
                  transform: `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`,
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <div className="p-4 border-t flex justify-center gap-4">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 3))}
                className="p-2 bg-white/10 text-white rounded-full cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
                }
                className="p-2 bg-white/10 text-white rounded-full cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setTranslateX(0);
                  setTranslateY(0);
                }}
                className="p-2 bg-white/10 text-white rounded-full cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}