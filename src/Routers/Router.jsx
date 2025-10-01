import { createBrowserRouter } from "react-router";
import Signup from "../Pages/Authentication/Signup";
import SignIn from "../Pages/Authentication/SignIn";
import Main from "../Layouts/Main";
import Homepage from "../Pages/HomePage/Homepage";
import ServiceDetailPage from "../Pages/Services/ServiceDetailPage";
import ConversationPage from "../Pages/ConversationPage/ConversationPage";
import Notification from "../Pages/Notification/Notification";
import SaveItems from "../Pages/SaveItems/SaveItems";
import SellerProfile from "../Pages/SellerProfile/SellerProfile";
import ManageOrder from "../Pages/ManageOrder/ManageOrder";
import AllServices from "../Pages/AllServices/AllServices";
import OrderPreview from "../Pages/OrderPage/OrderPreview";
import PaymentSuccess from "../Pages/OrderPage/PaymentSuccess";
import ServiceTimeline from "../Pages/OrderPage/ServiceTimeline";
import AccountSettings from "../Pages/AccountSettings/AccountSettings";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import AdminOverview from "../Pages/AdminPages/AdminOverview";
import BuyerOverview from "../Pages/BuyerPages/BuyerOverview";
import MyServices from "../Pages/BuyerPages/MyServices";
import AddServices from "../Pages/BuyerPages/AddServices";
import Dashboard from "../Layouts/Dashboard";
import AllUser from "../Pages/AdminPages/AllUser/AllUsers";
import UserDetail from "../Pages/AdminPages/AllUser/UserDetail";
import OrderList from "../Pages/AdminPages/OrderPage/OrderList";
import OrderDetailPage from "../Pages/AdminPages/OrderPage/OrderDetailPage";
import AllService from "../Pages/AdminPages/Services/AllService";
import SellerRequest from "../Pages/AdminPages/SellerRequest/SellerRequest";
import PrivacyPolicyUpload from "../Pages/AdminPages/PrivacyPolicy/PrivacyPolicyUpload";
import RequestDetails from "../Pages/AdminPages/SellerRequest/RequestDetails";
import ContentPage from "../Pages/AdminPages/ContentPage/ContentPage";
import ProfilePage from "../Pages/Authentication/Profile/ProfilePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/serviceDetails/:id",
        element: <ServiceDetailPage />,
      },
      {
        path: "/order-preview",
        element: <OrderPreview />,
      },
      {
        path: "/services",
        element: <AllServices />,
      },
      {
        path: "/conversation",
        element: <ConversationPage />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/saved",
        element: <SaveItems />,
      },

      {
        path: "/buyer-profile",
        element: <ProfilePage />,
      },
      {
        path: "/seller-profile",
        element: <SellerProfile />,
      },

      {
        path: "/order",
        element: <ManageOrder />,
      },
      {
        path: "/timeline/:id",
        element: <ServiceTimeline />,
      },
      {
        path: "/settings",
        element: <AccountSettings />,
      },
      {
        path: "/successful",
        element: <PaymentSuccess />,
      },
      {
        path: "/seller-overview",
        element: <BuyerOverview />,
      },
      {
        path: "/my-services",
        element: <MyServices />,
      },
      {
        path: "/add-services",
        element: <AddServices />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      {
        path: "dashboard",
        element: <AdminOverview/>
      },
      {
        path: "user",
        element: <AllUser/>
      },
      {
        path: "userDetail/:id",
        element: <UserDetail/>
      },
      {
        path: "order",
        element: <OrderList/>
      },
      {
        path: "order-details/:id",
        element: <OrderDetailPage/>
      },
      {
        path: "service",
        element: <AllService/>
      },
      {
        path: "request",
        element: <SellerRequest/>
      },
      {
        path: "request-details/:id",
        element: <RequestDetails/>
      },
      {
        path: "content",
        element: <ContentPage/>
      },
      {
        path: "add-privacy",
        element: <PrivacyPolicyUpload/>
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/otp",
    element: <OtpVerification />,
  },
]);

export default router;
