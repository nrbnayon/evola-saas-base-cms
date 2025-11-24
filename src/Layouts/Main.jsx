import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Pages/Shared/Navbar";
import Footer from "../Pages/Shared/Footer";
import ScrollToTop from "../components/ScrollToTop";

const Main = () => {
  const location = useLocation();
  const hideFooter = /^\/conversation(\/|$)/.test(location.pathname);

  return (
    <div className="">
      <Navbar />
      <ScrollToTop/>
      <div>
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Main;