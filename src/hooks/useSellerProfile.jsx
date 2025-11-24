import { useState, useEffect } from "react";
import apiClient from "../lib/api-client";

const useSellerProfile = (id) => {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (!id) {
        setError("No seller ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get(`/site/seller/profile/${id}`);
        console.log("API Response:", response); // Debug: Log full response
        console.log("Seller Data:", response.data); // Debug: Log data
        setSeller(response.data.seller || response.data); // Adjust based on API structure
        setIsLoading(false);
      } catch (err) {
        console.error("API Error:", err.response || err); // Debug: Log error details
        setError(err.response?.data?.message || "Failed to fetch seller profile");
        setIsLoading(false);
      }
    };
    fetchSellerProfile();
  }, [id]);

  return { seller, isLoading, error };
};

export default useSellerProfile;