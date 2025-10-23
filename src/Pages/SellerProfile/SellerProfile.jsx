import { FaStar } from "react-icons/fa";
import image1 from "../../assets/images/cardImage1.png";
import image2 from "../../assets/images/cardImage2.png";
import image3 from "../../assets/images/cardImage3.png";
import { FiMessageCircle } from "react-icons/fi";
import backgroundImage from "../../assets/images/cover.jpg";
import profileImage from "../../assets/images/cardImage2.png";
import badge from "../../assets/icons/badge.png";
import { RiHeartFill, RiStarFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const SellerProfile = () => {
  const profile = {
    name: "Danial Smith",
    avatar: profileImage,
    rating: 4.5,
    reviews: 500,
    verified: true,
  };

  const reviews = [
    {
      id: 1,
      reviewer: "Sophia L.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
      comment:
        "Absolutely wonderful! The decorations were breathtaking and the team was incredibly professional. They handled every detail flawlessly.",
      time: "2 days ago",
    },
    {
      id: 2,
      reviewer: "Michael R.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      comment:
        "Great experience overall. A few minor hiccups with the schedule, but the end result exceeded our expectations.",
      time: "1 week ago",
    },
    {
      id: 3,
      reviewer: "Emma W.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment:
        "The team went above and beyond. They truly listened to our vision and made it a reality. I couldn’t have asked for a better wedding planner.",
      time: "3 weeks ago",
    },
    {
      id: 4,
      reviewer: "James T.",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 3,
      comment:
        "Service was okay, but I feel like communication could have been better. The final setup was nice though.",
      time: "1 month ago",
    },
    {
      id: 5,
      reviewer: "Olivia M.",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      rating: 5,
      comment:
        "Everything was perfect! They made our day stress-free and magical. Highly recommend them to anyone planning a big event.",
      time: "1 month ago",
    },
    {
      id: 6,
      reviewer: "Daniel K.",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      rating: 4,
      comment:
        "Very professional team and beautiful decorations. We received so many compliments from our guests.",
      time: "2 months ago",
    },
  ];

  const services = [
    {
      id: 1,
      thumbnail: image1,
      title: "Wedding Photography",
      rating: 4.8,
      image: image1,
      name: "Robart Carlose",
      price: 19.99,
      distance: "4 km",
    },
    {
      id: 2,
      thumbnail: image2,
      title: "Event Decoration",
      rating: 4.6,
      image: image2,
      name: "Samantha Ray",
      price: 25.0,
      distance: "2.5 km",
    },
    {
      id: 3,
      thumbnail: image3,
      title: "DJ Party Setup",
      rating: 4.7,
      image: image3,
      name: "John Mixwell",
      price: 30.0,
      distance: "3 km",
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 container mx-auto mt-30 md:mt-15">
      <div className="border border-gray-200 p-4 sm:p-8 rounded-4xl">
        <div
          className="rounded-xl p-6 flex items-center justify-between h-40 sm:h-52"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="flex flex-col sm:flex-row justify-between gap-5 items-center sm:items-end mt-4 sm:mt-0">
          <div className="flex flex-col justify-center items-center ml-0 md:ml-10 -mt-20 sm:-mt-28">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white"
            />
            <h2 className="text-xl sm:text-2xl font-semibold break-words text-center">
              {profile.name}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 items-center">
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
              <div className="text-center px-4 sm:px-10">
                <p className="text-2xl sm:text-3xl font-semibold text-yellow-600">
                  {profile.rating}
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
                  {profile.reviews}+
                </p>
                <p>Reviews</p>
              </div>
            </div>

            <button className="text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors flex gap-2 bg-gray-100 text-sm sm:text-base">
              <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Message
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-4xl my-10">
        <h1 className="text-xl font-semibold pb-4">Buyer Bio</h1>
        <p>
          Amazing service! The team made our wedding day stress-free and truly
          magical. Everything was perfectly organized from the décor to the
          timeline. Highly recommend them.
          <br />
          <br />
          We provided an exceptional level of service that completely removed
          the stress from our wedding day. From the moment planning began, every
          detail was handled with precision and care — the décor was beautifully
          arranged, the timeline ran smoothly, and nothing was left to chance.
          Their professionalism and attention to detail made the entire day feel
          magical, allowing us to simply enjoy each moment. I would confidently
          recommend them to anyone planning a wedding.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          {profile.name} Reviews
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:scale-105 duration-500"
            >
              <div className="flex items-center mb-3">
                <img
                  src={review.avatar}
                  alt={review.reviewer}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {review.reviewer}
                  </p>
                  <p className="text-xs text-gray-500">{review.time}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-black" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 break-words">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          {profile.name} Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              to={`/serviceDetails/${service.id}`}
              key={service.id}
              className="relative border border-gray-200 rounded-xl p-3 hover:shadow-2xl duration-500"
            >
              <div className="absolute top-3 left-3 bg-white/40 text-black text-sm font-semibold px-3 py-2 rounded-br-xl flex items-center gap-1">
                <RiStarFill className="inline text-yellow-500" />{" "}
                {service.rating}
              </div>
              <img
                src={service.thumbnail}
                alt={service.title}
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              <div className="flex items-center justify-between mt-2 border-b pb-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <img
                    src={image1}
                    className="w-5 h-5 rounded-full object-cover"
                    alt=""
                  />
                  <p className="text-sm sm:text-base">{service.name}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-sm sm:text-base">{service.title}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-baseline">
                  <p className="font-semibold text-sm sm:text-base">
                    ${service.price}
                  </p>
                  <span className="text-gray-400 text-xs font-light">/hr</span>
                </span>
                <span className="bg-gray-100 p-2 rounded-full hover:shadow transition-shadow duration-300">
                  <RiHeartFill className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-pointer transition-colors duration-300" />
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
