import { FiMessageCircle } from "react-icons/fi";
import backgroundImage from "../../../assets/images/cover.jpg";
import profileImage from "../../../assets/images/cardImage2.png";

const ProfilePage = () => {
  const profile = {
    name: "Danial Smith",
    avatar: profileImage,
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 container mx-auto mt-30 md:mt-15">
      <div className="border border-gray-200 p-4 rounded-4xl">
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
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm"></div>

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
    </div>
  );
};

export default ProfilePage;
