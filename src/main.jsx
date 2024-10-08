import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routers/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-poppins">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
