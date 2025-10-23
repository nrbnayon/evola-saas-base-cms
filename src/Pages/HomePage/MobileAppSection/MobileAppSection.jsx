import image from "../../../assets/images/image.png";
import bg from "../../../assets/images/bg.png";

const MobileAppSection = () => {
  return (
    <div
      className="py-7 lg:py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8C1F5]/70 via-[#D8B4FE]/70 to-[#C8C1F5]/70 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[400px]">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Evola event services
                <br />
                for your phone.
              </h2>
              <p className="text-gray-700 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                Download the app for instant notifications and easy event management.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start space-x-4">
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-12 sm:h-14"
                />
              </a>
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-12 sm:h-14"
                />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 relative md:flex flex-col hidden items-center justify-center">
            <div className="relative w-64 sm:w-72 lg:w-80 h-[500px] sm:h-[550px] lg:h-[600px] bg-black rounded-[3rem] p-1 shadow-2xl">
              <div className="w-full h-full bg-gray-50 rounded-[2.8rem] overflow-hidden relative">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black h-6 w-36 rounded-full"></div>
                <div className="bg-white h-full mt-10 mx-2 rounded-[2.5rem] shadow-inner"></div>
              </div>
            </div>

            <div className="lg:hidden mt-8 w-full max-w-sm">
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image}
                  alt="Event decoration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="hidden lg:block absolute right-0 top-1/2 hover:scale-110 transform duration-500 -translate-y-1/2 translate-x-4 z-10">
              <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-6">
                <img
                  src={image}
                  alt="Event decoration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppSection;
