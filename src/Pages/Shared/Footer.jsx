import { useState } from "react";
import logo from '../../assets/logo/logo.png';
import { Link } from "react-router-dom";


const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-white md:py-16 py-7 container mx-auto">
      <div className="px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className='h-8 w-32'>
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
            <p className="text-gray-600 max-w-xs">
              Trusted local services at your fingertips.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex items-center justify-center"
          >
            <input
              type="email"
              className="md:w-[300px] w-full h-12 px-4 border-2 border-gray-200 rounded-l-full text-gray-600 placeholder-gray-500 focus:outline-none"
              placeholder="Enter email"
            />
            <button className="h-12 px-6 bg-[#c8c1f5] font-semibold text-gray-600 rounded-r-full hover:bg-[#b0a8e2] transition-colors duration-300">
              Subscribe
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Providers</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-700 transition-colors"
                >
                  Join Now
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Payments
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#8272ED] transition-colors"
                >
                  You Tube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                alt="PayPal"
                className="h-6"
              />
              <div className="text-gray-600 font-semibold text-sm">Klarna</div>
            </div>

            <div className="text-gray-500 text-sm">
              © 2025 <span className="text-[#8272ED]">Evola</span>. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
