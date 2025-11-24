import { FaStar } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import badge from "../../assets/icons/badge.png";
import { RiStarFill } from "react-icons/ri";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../lib/api-client";
import useMe from "../../hooks/useMe";

const SellerProfile = () => {
  const { user } = useMe();
  const [seller, setSeller] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(conversations, "conversations ------");
  console.log(seller, "seller ------");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch seller details and conversations when component mounts
  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/user/view-seller/${id}`);
        setSeller(response.data);
        console.log(response.data, "Seller details-------------------");
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };

    const fetchConvos = async () => {
      try {
        const res = await apiClient.get("/chat/conversations");
        setConversations(res.data || []);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchSellerDetails();
    fetchConvos();
    setLoading(false);
  }, [id]);

  const handleMessage = () => {
    if (!seller) return;

    const existing = conversations.find(
      (convo) => convo.chat_with.id === seller.user_id
    );

    if (existing) {
      navigate(`/conversation/${existing.conversation_id}`);
    } else {
      // New: Navigate to chatting route and pass state to create new conversation
      navigate("/conversation/new", { 
        state: { receiver: { id: seller.user_id, full_name: seller.full_name, photo: seller.photo }, createNew: true } 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center h-40">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 container mx-auto">
      <div className="border border-gray-200 p-4 sm:p-8 rounded-4xl">
        <div
          className="rounded-xl p-6 flex items-center justify-between h-40 sm:h-52"
          style={{
            backgroundImage: `url(${seller?.cover_photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="flex flex-col sm:flex-row justify-between gap-5 items-center sm:items-end mt-4 sm:mt-0">
          <div className="flex flex-col justify-center items-center ml-0 md:ml-10 -mt-20 sm:-mt-28">
            <img
              src={seller?.photo}
              alt={seller?.full_name}
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white"
            />
            <h2 className="text-xl sm:text-2xl font-semibold break-words text-center">
              {seller?.full_name}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 items-center">
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
              <div className="text-center px-4 sm:px-10">
                <p className="text-2xl sm:text-3xl font-semibold text-yellow-600">
                  {seller?.average_rating || "0"}
                </p>
                <p className="whitespace-nowrap">Avg. Rating</p>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-l px-4 sm:px-10 border-gray-300">
                <div className="w-8 h-8 mb-1.5">
                  <img src={badge} alt="verified badge" />
                </div>
                <p className="flex items-center">Verified</p>
              </div>

              <div className="px-4 sm:px-10">
                <p className="text-2xl sm:text-3xl font-semibold text-purple-400">
                  {seller?.reviews_count}+
                </p>
                <p>Reviews</p>
              </div>
            </div>
            {user?.role !== "Seller" && (
              <button
                onClick={handleMessage}
                className="text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors flex gap-2 bg-gray-100 text-sm sm:text-base"
              >
                <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Message
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-4xl my-10">
        <h1 className="text-xl font-semibold pb-4">Buyer Bio</h1>
        <p>{seller?.occupation?.description}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          {seller?.full_name}'s Reviews
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seller?.reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:scale-105 duration-500"
            >
              <div className="flex items-center mb-3">
                <img
                  src={
                    review?.user?.photo ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s"
                  }
                  alt={review?.user?.full_name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {review?.user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.time || "12 jun 2025"}
                  </p>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: review.rating }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-black" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 break-words">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          {seller?.full_name}'s Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(seller?.services.slice(0, 4) || []).map((service) => (
            <Link
              to={`/serviceDetails/${service.id}`}
              key={service.id}
              className="relative border border-gray-200 rounded-xl p-3 hover:shadow-2xl duration-500"
            >
              <div className="absolute top-3 left-3 bg-white/40 text-black text-sm font-semibold px-3 py-2 rounded-br-xl flex items-center gap-1">
                <RiStarFill className="inline text-yellow-500" />{" "}
                {service.average_rating}
              </div>
              <img
                src={service.cover_photo}
                alt={service.title}
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              <div className="flex items-center justify-between mt-2 border-b pb-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <img
                    src={service.seller?.photo}
                    className="w-5 h-5 rounded-full object-cover"
                    alt=""
                  />
                  <p className="text-sm sm:text-base">
                    {service?.seller?.full_name}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-sm sm:text-base">
                  {service.title}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-baseline">
                  <p className="font-semibold text-sm sm:text-base">
                    ${service.price}
                  </p>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;