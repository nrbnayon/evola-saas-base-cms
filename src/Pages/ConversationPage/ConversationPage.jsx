// import { useState, useRef, useEffect } from "react"
// import {
//   Send,
//   Camera,
//   X,
//   DollarSign,
//   Search,
//   MoreHorizontal,
//   MapPin,
//   Star,
//   Menu,
//   Archive,
//   BellOff,
//   Trash2,
// } from "lucide-react"
// import { io } from "socket.io-client"

// export default function ConversationPage() {
//   const contacts = [
//     {
//       id: 1,
//       name: "Sarah Johnson",
//       preview: "Hi...need wedding photographer for June",
//       time: "2m",
//       starred: false,
//       lastSeen: "Just now",
//       localTime: "Local time Sep 10, 9:08 AM",
//       avatar: "SJ",
//       business: {
//         name: "Wedding Photography",
//         location: "Overland Park, KS",
//         icon: <Camera className="w-4 h-4" />,
//         type: "Photography",
//       },
//       messages: [
//         {
//           id: 1,
//           type: "incoming",
//           text: "Hi, are you available for multiple project? I need brand identity for my new business as well as a logo and a website",
//           time: "9:05 AM",
//           showBusiness: true,
//         },
//         {
//           id: 2,
//           type: "outgoing",
//           text: "Hi Sarah! Yes, I'd love to help you with your wedding photography branding. I can definitely handle the complete brand identity, logo design, and website development.",
//           time: "9:06 AM",
//         },
//         {
//           id: 3,
//           type: "incoming",
//           text: "That sounds perfect! What's your timeline like? I'm hoping to launch everything by November for the wedding season.",
//           time: "9:07 AM",
//         },
//         {
//           id: 4,
//           type: "outgoing",
//           text: "November is definitely achievable. I can have the brand identity and logo completed within 2-3 weeks, and the website ready within 4-6 weeks. Would you like to discuss your vision and requirements?",
//           time: "9:08 AM",
//         },
//       ],
//     },
//   ]

//   const demoServices = [
//     {
//       id: 1,
//       name: "Wedding Photography - Basic Package",
//       description: "Full day wedding coverage with 200+ edited photos",
//       basePrice: 1500,
//       category: "Photography",
//     },
//     {
//       id: 2,
//       name: "Wedding Photography - Premium Package",
//       description: "Full day coverage, engagement session, 500+ photos, album",
//       basePrice: 2500,
//       category: "Photography",
//     },
//     {
//       id: 3,
//       name: "Brand Identity Design",
//       description: "Complete brand identity including logo, colors, typography",
//       basePrice: 800,
//       category: "Design",
//     },
//     {
//       id: 4,
//       name: "Website Development",
//       description: "Custom responsive website with CMS integration",
//       basePrice: 2000,
//       category: "Development",
//     },
//     {
//       id: 5,
//       name: "Logo Design",
//       description: "Professional logo design with 3 concepts and revisions",
//       basePrice: 500,
//       category: "Design",
//     },
//   ]

//   const [message, setMessage] = useState("")
//   const [selectedContact, setSelectedContact] = useState(1)
//   const [contactsData, setContactsData] = useState(contacts)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterType, setFilterType] = useState("All")
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [showSidebar, setShowSidebar] = useState(false)

//   const [showOfferModal, setShowOfferModal] = useState(false)
//   const [showServiceModal, setShowServiceModal] = useState(false)
//   const [selectedService, setSelectedService] = useState(null)
//   const [offerDescription, setOfferDescription] = useState("")
//   const [offerPrice, setOfferPrice] = useState("")

//   const [socket, setSocket] = useState(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const [currentUserId] = useState(() => Math.random().toString(36).substr(2, 9))

//   const dropdownRef = useRef(null)

//   const businessTypes = ["All", ...new Set(contacts.map((contact) => contact.business.type))]
//   const currentContact = contactsData.find((contact) => contact.id === selectedContact)

//   useEffect(() => {
//     const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
//       query: {
//         userId: currentUserId,
//       },
//     })

//     socketInstance.on("connect", () => {
//       setIsConnected(true)
//       console.log("Connected to socket server")
//     })

//     socketInstance.on("disconnect", () => {
//       setIsConnected(false)
//       console.log("Disconnected from socket server")
//     })

//     socketInstance.on("message", (data) => {
//       const newMessage = {
//         id: Date.now(),
//         type: data.senderId === currentUserId ? "outgoing" : "incoming",
//         text: data.message,
//         time: new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }

//       setContactsData((prevContacts) =>
//         prevContacts.map((contact) => ({
//           ...contact,
//           messages: [...contact.messages, newMessage],
//           preview: data.message.length > 30 ? data.message.substring(0, 30) + "..." : data.message,
//           time: "now",
//         })),
//       )
//     })

//     socketInstance.on("offer", (data) => {
//       const offerMessage = {
//         id: Date.now(),
//         type: data.senderId === currentUserId ? "outgoing" : "incoming",
//         time: new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         offer: data.offer,
//       }

//       setContactsData((prevContacts) =>
//         prevContacts.map((contact) => ({
//           ...contact,
//           messages: [...contact.messages, offerMessage],
//           preview: `Offer: ${data.offer.serviceName}`,
//           time: "now",
//         })),
//       )
//     })

//     socketInstance.on("offerResponse", (data) => {
//       setContactsData((prevContacts) =>
//         prevContacts.map((contact) => ({
//           ...contact,
//           messages: contact.messages.map((msg) =>
//             msg.id === data.messageId && msg.offer ? { ...msg, offer: { ...msg.offer, status: data.response } } : msg,
//           ),
//         })),
//       )
//     })

//     setSocket(socketInstance)

//     return () => {
//       socketInstance.disconnect()
//     }
//   }, [currentUserId])

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const toggleStar = (contactId, e) => {
//     e.stopPropagation()
//     setContactsData((prevContacts) =>
//       prevContacts.map((contact) => (contact.id === contactId ? { ...contact, starred: !contact.starred } : contact)),
//     )
//   }

//   const sendMessage = () => {
//     if (message.trim() && socket && isConnected) {
//       const messageData = {
//         senderId: currentUserId,
//         receiverId: currentContact?.id.toString() || "",
//         message: message.trim(),
//         timestamp: new Date().toISOString(),
//       }

//       socket.emit("sendMessage", messageData)

//       const newMessage = {
//         id: Date.now(),
//         type: "outgoing",
//         text: message,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }

//       setContactsData((prevContacts) =>
//         prevContacts.map((contact) =>
//           contact.id === selectedContact
//             ? {
//                 ...contact,
//                 messages: [...contact.messages, newMessage],
//                 preview: message.length > 30 ? message.substring(0, 30) + "..." : message,
//                 time: "now",
//               }
//             : contact,
//         ),
//       )
//       setMessage("")
//     }
//   }

//   const sendOffer = () => {
//     if (!selectedService || !offerPrice.trim() || !socket || !isConnected) return

//     const offerData = {
//       senderId: currentUserId,
//       receiverId: currentContact?.id.toString() || "",
//       offer: {
//         serviceName: selectedService.name,
//         description: offerDescription || selectedService.description,
//         price: Number.parseFloat(offerPrice),
//         status: "pending",
//       },
//       timestamp: new Date().toISOString(),
//     }

//     socket.emit("sendOffer", offerData)

//     const offerMessage = {
//       id: Date.now(),
//       type: "outgoing",
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       offer: offerData.offer,
//     }

//     setContactsData((prevContacts) =>
//       prevContacts.map((contact) =>
//         contact.id === selectedContact
//           ? {
//               ...contact,
//               messages: [...contact.messages, offerMessage],
//               preview: `Offer: ${selectedService.name}`,
//               time: "now",
//             }
//           : contact,
//       ),
//     )

//     // Reset offer creation state
//     setShowOfferModal(false)
//     setShowServiceModal(false)
//     setSelectedService(null)
//     setOfferDescription("")
//     setOfferPrice("")
//   }

//   const handleOfferResponse = (messageId, response) => {
//     if (!socket || !isConnected) return

//     socket.emit("respondToOffer", {
//       messageId,
//       response,
//       responderId: currentUserId,
//     })

//     setContactsData((prevContacts) =>
//       prevContacts.map((contact) => ({
//         ...contact,
//         messages: contact.messages.map((msg) =>
//           msg.id === messageId && msg.offer ? { ...msg, offer: { ...msg.offer, status: response } } : msg,
//         ),
//       })),
//     )
//   }

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value)
//   }

//   const handleFilterChange = (e) => {
//     setFilterType(e.target.value)
//   }

//   const filteredContacts = contactsData.filter((contact) => {
//     const matchesSearch =
//       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.business.name.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter =
//       filterType === "All" || contact.business.type === filterType || (filterType === "Starred" && contact.starred)
//     return matchesSearch && matchesFilter
//   })

//   const handleDropdownAction = (action) => {
//     if (action === "archive") {
//       alert(`Archived chat with ${currentContact.name}`)
//     } else if (action === "mute") {
//       alert(`Muted notifications for ${currentContact.name}`)
//     } else if (action === "delete") {
//       if (window.confirm(`Are you sure you want to delete the chat with ${currentContact.name}?`)) {
//         setContactsData((prevContacts) => prevContacts.filter((contact) => contact.id !== selectedContact))
//         setSelectedContact(contactsData[0]?.id || null)
//         setShowSidebar(false)
//       }
//     }
//     setShowDropdown(false)
//   }

//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar)
//   }

//   return (
//     <div className="flex h-[93vh] bg-white border-b border-gray-300">
//       {/* Connection Status */}
//       <div
//         className={`fixed top-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-medium ${
//           isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//         }`}
//       >
//         {isConnected ? "Connected" : "Disconnected"}
//       </div>

//       <button
//         className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full"
//         onClick={toggleSidebar}
//       >
//         {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       <div
//         className={`${
//           showSidebar ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto`}
//       >
//         <div className="p-3 sm:p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-3 sm:mb-4">
//             <select
//               value={filterType}
//               onChange={handleFilterChange}
//               className="text-xs sm:text-sm font-medium text-gray-700 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8C1F5]"
//             >
//               {businessTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//               <option value="Starred">Starred</option>
//             </select>
//             <div className="relative flex-1 ml-2">
//               <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 placeholder="Search contacts..."
//                 className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {filteredContacts.length > 0 ? (
//             filteredContacts.map((contact) => (
//               <div
//                 key={contact.id}
//                 onClick={() => {
//                   setSelectedContact(contact.id)
//                   setShowSidebar(false)
//                 }}
//                 className={`flex items-center p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${selectedContact === contact.id ? "bg-gray-50" : ""}`}
//               >
//                 <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
//                   {contact.avatar}
//                 </div>
//                 <div className="ml-2 sm:ml-3 flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{contact.name}</h3>
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-gray-500">{contact.time}</span>
//                       <button
//                         onClick={(e) => toggleStar(contact.id, e)}
//                         className="hover:scale-110 transition-transform"
//                       >
//                         <Star
//                           className={`w-4 h-4 transition-colors ${
//                             contact.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300"
//                           }`}
//                         />
//                       </button>
//                     </div>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">{contact.preview}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">No contacts found.</p>
//           )}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {currentContact ? (
//           <>
//             <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <button className="lg:hidden p-2 text-gray-600" onClick={toggleSidebar}>
//                     <Menu className="w-5 h-5" />
//                   </button>
//                   <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
//                     {currentContact.avatar}
//                   </div>
//                   <div>
//                     <h2 className="font-medium text-sm sm:text-base text-gray-900">{currentContact.name}</h2>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
//                       <span>Last seen: {currentContact.lastSeen}</span>
//                       <span>{currentContact.localTime}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button onClick={() => setShowDropdown(!showDropdown)}>
//                   <MoreHorizontal className="w-5 h-5 text-gray-400" />
//                 </button>
//               </div>
//               {showDropdown && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute right-2 sm:right-4 top-10 sm:top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
//                 >
//                   <button
//                     onClick={() => handleDropdownAction("archive")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     <Archive className="w-4 h-4" /> Archive Chat
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("mute")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     <BellOff className="w-4 h-4" /> Mute Notifications
//                   </button>
//                   <button
//                     onClick={() => handleDropdownAction("delete")}
//                     className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete Chat
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50">
//               {currentContact.messages.map((msg) => (
//                 <div key={msg.id} className={`mb-4 sm:mb-6 ${msg.type === "outgoing" ? "flex justify-end" : ""}`}>
//                   <div
//                     className={`max-w-[80%] sm:max-w-md ${msg.type === "outgoing" ? "bg-[#C8C1F5] text-black" : "bg-white text-gray-800"} rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm`}
//                   >
//                     {msg.offer ? (
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="w-4 h-4 text-green-600" />
//                           <span className="font-medium text-sm">Service Offer</span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-sm">{msg.offer.serviceName}</h4>
//                           <p className="text-xs text-gray-600 mt-1">{msg.offer.description}</p>
//                           <p className="text-lg font-bold text-green-600 mt-2">${msg.offer.price}</p>
//                         </div>
//                         {msg.type === "incoming" && msg.offer.status === "pending" && (
//                           <div className="flex gap-2 mt-3">
//                             <button
//                               onClick={() => handleOfferResponse(msg.id, "accepted")}
//                               className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
//                               disabled={!isConnected}
//                             >
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => handleOfferResponse(msg.id, "declined")}
//                               className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
//                               disabled={!isConnected}
//                             >
//                               Decline
//                             </button>
//                           </div>
//                         )}
//                         {msg.offer.status !== "pending" && (
//                           <div
//                             className={`text-center py-2 px-3 rounded-lg text-xs font-medium ${
//                               msg.offer.status === "accepted"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {msg.offer.status === "accepted" ? "Offer Accepted" : "Offer Declined"}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <>
//                         <p className="mb-2 text-xs sm:text-sm">{msg.text}</p>
//                         {msg.showBusiness && currentContact.business && (
//                           <>
//                             <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
//                               This message relates to:
//                             </div>
//                             <div className="bg-gray-50 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
//                               <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-black">
//                                 {currentContact.business.icon}
//                               </div>
//                               <div>
//                                 <h4 className="font-medium text-xs sm:text-sm text-gray-900">
//                                   {currentContact.business.name}
//                                 </h4>
//                                 <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
//                                   <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
//                                   <span>{currentContact.business.location}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </>
//                     )}
//                     <div className={`text-xs mt-2 ${msg.type === "outgoing" ? "text-black" : "text-gray-600"}`}>
//                       {msg.time}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex-1 relative">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     placeholder={isConnected ? "Type new messages..." : "Connecting..."}
//                     disabled={!isConnected}
//                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm disabled:opacity-50"
//                   />
//                 </div>
//                 <button
//                   onClick={sendMessage}
//                   disabled={!message.trim() || !isConnected}
//                   className="bg-[#C8C1F5] disabled:bg-gray-100 disabled:cursor-not-allowed text-black p-2 sm:p-3 rounded-full"
//                 >
//                   <Send className="w-4 sm:w-5 h-4 sm:h-5" />
//                 </button>
//                 <button
//                   onClick={() => setShowServiceModal(true)}
//                   disabled={!isConnected}
//                   className="bg-white hover:bg-gray-50 text-[#C8C1F5] border border-[#C8C1F5] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-colors disabled:opacity-50"
//                 >
//                   Create an offer
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No contact selected</div>
//         )}
//       </div>

//       {/* Service Selection Modal */}
//       {showServiceModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">Select Services</h3>
//                 <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-4 max-h-96 overflow-y-auto">
//               <div className="space-y-3">
//                 {demoServices.map((service) => (
//                   <div
//                     key={service.id}
//                     onClick={() => {
//                       setSelectedService(service)
//                       setOfferPrice(service.basePrice.toString())
//                       setOfferDescription(service.description)
//                       setShowServiceModal(false)
//                       setShowOfferModal(true)
//                     }}
//                     className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
//                   >
//                     <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
//                       <Camera className="w-6 h-6 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-medium text-sm">{service.name}</h4>
//                       <p className="text-xs text-gray-600 mt-1">{service.description}</p>
//                       <p className="text-sm font-semibold text-green-600 mt-1">${service.basePrice}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Offer Creation Modal */}
//       {showOfferModal && selectedService && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full">
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">{selectedService.name}</h3>
//                 <button
//                   onClick={() => {
//                     setShowOfferModal(false)
//                     setSelectedService(null)
//                     setOfferDescription("")
//                     setOfferPrice("")
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-4 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
//                 <input
//                   type="text"
//                   value={selectedService.name}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                 <textarea
//                   value={offerDescription}
//                   onChange={(e) => setOfferDescription(e.target.value)}
//                   placeholder="Add custom description..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
//                 <input
//                   type="number"
//                   value={offerPrice}
//                   onChange={(e) => setOfferPrice(e.target.value)}
//                   placeholder="Enter price..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                 />
//               </div>
//               <button
//                 onClick={sendOffer}
//                 disabled={!offerPrice.trim() || !isConnected}
//                 className="w-full bg-[#C8C1F5] text-black py-3 rounded-lg font-medium hover:bg-[#B8B0F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Send Offer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Send,
  MapPin,
  Star,
  Camera,
  Laptop,
  Menu,
  X,
  Check,
} from "lucide-react";

const demoServices = [
  {
    id: 1,
    name: "Wedding Photography - Basic Package",
    description: "Wedding Photography/Wedding Photography/Wedding Photography",
    basePrice: 1200,
    category: "Photography",
  },
  {
    id: 2,
    name: "Wedding Photography - Premium Package",
    description: "Full day coverage with engagement session",
    basePrice: 2500,
    category: "Photography",
  },
  {
    id: 3,
    name: "Wedding Photography - Deluxe Package",
    description: "Complete wedding documentation with albums",
    basePrice: 3800,
    category: "Photography",
  },
  {
    id: 4,
    name: "Brand Identity Design",
    description: "Logo design and brand guidelines",
    basePrice: 800,
    category: "Design",
  },
  {
    id: 5,
    name: "Website Development",
    description: "Custom website with responsive design",
    basePrice: 2200,
    category: "Development",
  },
];

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    preview: "Hi...need wedding photographer for June",
    time: "2m",
    starred: false,
    lastSeen: "Just now",
    localTime: "Local time Sep 10, 9:08 AM",
    avatar: "SJ",
    business: {
      name: "Wedding Photography",
      location: "Overland Park, KS",
      icon: <Camera className="w-4 h-4" />,
      type: "Photography",
    },
    messages: [
      {
        id: 1,
        type: "incoming",
        text: "Hi, are you available for multiple project? I need brand identity for my new business as well as a logo and a website",
        time: "9:05 AM",
        showBusiness: true,
      },
      {
        id: 2,
        type: "outgoing",
        text: "Hi Sarah! Yes, I'd love to help you with your wedding photography branding. I can definitely handle the complete brand identity, logo design, and website development.",
        time: "9:06 AM",
      },
      {
        id: 3,
        type: "incoming",
        text: "That sounds perfect! What's your timeline like? I'm hoping to launch everything by November for the wedding season.",
        time: "9:07 AM",
      },
      {
        id: 4,
        type: "outgoing",
        text: "November is definitely achievable. I can have the brand identity and logo completed within 2-3 weeks, and the website ready within 4-6 weeks. Would you like to discuss your vision and requirements?",
        time: "9:08 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Mike Chen",
    preview: "The logo concepts look amazing! Can we...",
    time: "1h",
    starred: true,
    lastSeen: "45 minutes ago",
    localTime: "Local time Sep 10, 8:23 AM",
    avatar: "MC",
    business: {
      name: "Tech Startup",
      location: "San Francisco, CA",
      icon: <Laptop className="w-4 h-4" />,
      type: "Technology",
    },
    messages: [
      {
        id: 1,
        type: "outgoing",
        text: "Hi Mike! I've finished the initial logo concepts for your tech startup. Would you like to review them?",
        time: "8:15 AM",
      },
      {
        id: 2,
        type: "incoming",
        text: "The logo concepts look amazing! Can we schedule a call to discuss the final touches?",
        time: "8:20 AM",
      },
      {
        id: 3,
        type: "outgoing",
        text: "I'm free this afternoon or tomorrow morning. What works better for you?",
        time: "8:22 AM",
      },
      {
        id: 4,
        type: "incoming",
        text: "Tomorrow morning would be perfect. How about 10 AM PST?",
        time: "8:23 AM",
      },
    ],
  },
];

export default function ConversationPage() {
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(1);
  const [contactsData, setContactsData] = useState(contacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [offerDescription, setOfferDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const businessTypes = [
    "All",
    ...new Set(contacts.map((contact) => contact.business.type)),
  ];
  const currentContact = contactsData.find(
    (contact) => contact.id === selectedContact
  );

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        type: "outgoing",
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setContactsData((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact
            ? {
                ...contact,
                messages: [...contact.messages, newMessage],
                preview:
                  message.length > 30
                    ? message.substring(0, 30) + "..."
                    : message,
                time: "now",
              }
            : contact
        )
      );
      setMessage("");
    }
  };

  const sendOffer = () => {
    if (!selectedService || !offerPrice.trim()) return;

    const offerMessage = {
      id: Date.now(),
      type: "outgoing",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      offer: {
        serviceName: selectedService.name,
        description: offerDescription || selectedService.description,
        price: parseFloat(offerPrice),
        status: "pending",
      },
    };

    setContactsData((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContact
          ? {
              ...contact,
              messages: [...contact.messages, offerMessage],
              preview: `Sent offer: ${selectedService.name}`,
              time: "now",
            }
          : contact
      )
    );

    setSelectedService(null);
    setOfferDescription("");
    setOfferPrice("");
    setShowOfferModal(false);
    setShowServiceModal(false);
  };

  const handleOfferResponse = (messageId, response) => {
    setContactsData((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContact
          ? {
              ...contact,
              messages: contact.messages.map((msg) =>
                msg.id === messageId && msg.offer
                  ? { ...msg, offer: { ...msg.offer, status: response } }
                  : msg
              ),
            }
          : contact
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-[93vh] bg-white  mt-30 md:mt-15">
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-[#C8C1F5] text-black rounded-full"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static w-64 sm:w-72 lg:w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-10 lg:z-auto`}
      >
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs sm:text-sm font-medium text-gray-700 px-2 py-1 bg-white border border-gray-300 rounded-md "
            >
              {businessTypes.map((type) => (
                <option key={type} value={type} >
                  {type}
                </option>
              ))}
              <option value="Starred">Starred</option>
            </select>
            <div className="relative flex-1 ml-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contactsData.length > 0 ? (
            contactsData.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact.id);
                  setShowSidebar(false);
                }}
                className={`flex items-center p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedContact === contact.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                  {contact.avatar}
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">
                        {contact.time}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContactsData((prevContacts) =>
                            prevContacts.map((c) =>
                              c.id === contact.id
                                ? { ...c, starred: !c.starred }
                                : c
                            )
                          );
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            contact.starred
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                    {contact.preview}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
              No contacts found.
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {currentContact ? (
          <>
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    className="lg:hidden p-2 text-gray-600"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                    {currentContact.avatar}
                  </div>
                  <div>
                    <h2 className="font-medium text-sm sm:text-base text-gray-900">
                      {currentContact.name}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span>Last seen: {currentContact.lastSeen}</span>
                      <span>{currentContact.localTime}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50">
              {currentContact.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 sm:mb-6 ${
                    msg.type === "outgoing" ? "flex justify-end" : ""
                  }`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-md ${
                      msg.type === "outgoing"
                        ? "bg-[#C8C1F5]/30 text-black"
                        : "bg-white text-gray-800"
                    } rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm`}
                  >
                    {msg.offer ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">Offer Details</p>
                          <div
                            className={`text-xs px-2 py-1 rounded ${
                              msg.offer.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : msg.offer.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {msg.offer.status}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {msg.offer.serviceName}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {msg.offer.description}
                          </p>
                          <p className="text-lgmt-2">
                            ${msg.offer.price.toFixed(2)}
                          </p>
                          <button className="text-center p-2 w-full bg-red-200 text-red-600 rounded-lg  mt-3">Withdraw</button>
                        </div>
                        {msg.offer.status === "pending" &&
                          msg.type === "incoming" && (
                            <div className="flex gap-2">
                              <button
                                size="sm"
                                onClick={() =>
                                  handleOfferResponse(msg.id, "accepted")
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </button>
                              <button
                                size="sm"
                                onClick={() =>
                                  handleOfferResponse(msg.id, "declined")
                                }
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </button>
                            </div>
                          )}
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-xs sm:text-sm">{msg.text}</p>
                        {msg.showBusiness && currentContact.business && (
                          <>
                            <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                              This message relates to:
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                              <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-black">
                                {currentContact.business.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-xs sm:text-sm text-gray-900">
                                  {currentContact.business.name}
                                </h4>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
                                  <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                                  <span>
                                    {currentContact.business.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div
                      className={`text-xs mt-2 ${
                        msg.type === "outgoing" ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type new messages..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-full outline-none border border-gray-300 text-xs sm:text-sm"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="bg-[#C8C1F5] disabled:bg-gray-100 disabled:cursor-not-allowed text-black p-2 sm:p-3 rounded-full"
                >
                  <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="bg-[#dad6f5] hover:bg-[#b1a6fd] text-black border border-[#9385e9] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-colors"
                >
                  Create an offer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            No contact selected
          </div>
        )}
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Services</h3>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {demoServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setOfferPrice(service.basePrice.toString());
                    setShowServiceModal(false);
                    setShowOfferModal(true);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{service.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {service.description}
                    </p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      ${service.basePrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showOfferModal && selectedService && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedService.name}
                </h3>
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setSelectedService(null);
                    setOfferDescription("");
                    setOfferPrice("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send an personal Offer
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Service name
                    </label>
                    <input
                      type="text"
                      value={selectedService.name}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      placeholder={selectedService.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={sendOffer}
                  disabled={!offerPrice.trim()}
                  className="flex-1 bg-[#C8C1F5] hover:bg-[#B8B0F0] text-black p-2 rounded-lg"
                >
                  Send Offer
                </button>
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setSelectedService(null);
                    setOfferDescription("");
                    setOfferPrice("");
                  }}
                  className="flex-1 border border-[#B8B0F0] text-gray-600 p-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
