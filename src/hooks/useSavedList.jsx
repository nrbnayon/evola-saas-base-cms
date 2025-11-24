// hooks/useSavedList.js
// import { useState, useEffect, useCallback } from "react";
// import apiClient from "../lib/api-client";
// import useMe from "./useMe";

// const useSavedList = () => {
//   const [savedServices, setSavedServices] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { user } = useMe();

//   // Fetch saved services
//   const fetchSavedServices = useCallback(async () => {
//     if (!user?.user_id) return;
//     try {
//       setLoading(true);
//       const response = await apiClient.get("/user/saved-list");
//       setSavedServices(response.data || []);
//     } catch (err) {
//       console.error("Fetch saved services error:", err);
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.user_id]);

//   // Fetch folders
//   const fetchFolders = useCallback(async () => {
//     if (!user?.user_id) return;
//     try {
//       const response = await apiClient.get("/user/favourite-listings");
//       setFolders(response.data || []);
//     } catch (err) {
//       console.error("Fetch folders error:", err);
//       setError(err.response?.data?.message || err.message);
//     }
//   }, [user?.user_id]);

//   // Create new folder
//   const createFolder = async (title) => {
//     if (!title.trim()) return false;
//     try {
//       const response = await apiClient.post("/user/create-favourite-listing", { title });
//       await fetchFolders();
//       return response.data;
//     } catch (err) {
//       console.error("Create folder error:", err);
//       setError(err.response?.data?.message || "Failed to create folder");
//       return false;
//     }
//   };

//   // Save service to a specific folder
//   const saveServiceToFolder = async (serviceId, folderId) => {
//     if (!user?.user_id) {
//       setError("User must be logged in");
//       return false;
//     }

//     try {
//       setLoading(true);
//       await apiClient.post(`/user/save-service/${serviceId}`, { folder_id: folderId });
//       await fetchSavedServices();
//       return true;
//     } catch (err) {
//       console.error("Save service error:", err);
//       setError(err.response?.data?.message || "Failed to save service");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove saved service
//   const removeSavedService = async (serviceId) => {
//     try {
//       setLoading(true);
//       await apiClient.delete(`/user/remove-saved-service/${serviceId}`);
//       await fetchSavedServices();
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to remove");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.user_id) {
//       fetchSavedServices();
//       fetchFolders();
//     }
//   }, [user?.user_id, fetchSavedServices, fetchFolders]);

//   return {
//     savedServices,
//     folders,
//     loading,
//     error,
//     saveServiceToFolder,
//     createFolder,
//     removeSavedService,
//     refetch: () => {
//       fetchSavedServices();
//       fetchFolders();
//     },
//   };
// };

// export default useSavedList;


import { useState, useEffect, useCallback } from "react";
import apiClient from "../lib/api-client";
import useMe from "./useMe";

const useSavedList = () => {
  const [savedServices, setSavedServices] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useMe();

  // Fetch saved services
  const fetchSavedServices = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      setLoading(true);
      const response = await apiClient.get("/user/saved-list");
      setSavedServices(response.data || []);
    } catch (err) {
      console.error("Fetch saved services error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const response = await apiClient.get("/user/favourite-listings");
      setFolders(response.data || []);
    } catch (err) {
      console.error("Fetch folders error:", err);
      setError(err.response?.data?.message || err.message);
    }
  }, [user?.user_id]);

  // Create new folder
  const createFolder = async (title) => {
    if (!title.trim()) return false;
    try {
      const response = await apiClient.post("/user/create-favourite-listing", { title });
      await fetchFolders();
      return response.data;
    } catch (err) {
      console.error("Create folder error:", err);
      setError(err.response?.data?.message || "Failed to create folder");
      return false;
    }
  };

  // Save service to a specific folder (using list_title string, not ID)
  const saveServiceToFolder = async (serviceId, listTitle) => {
    if (!user?.user_id) {
      setError("User must be logged in");
      return false;
    }

    try {
      setLoading(true);
      await apiClient.post("/user/save-service", { list_title: listTitle, service_id: serviceId });
      await fetchSavedServices();
      return true;
    } catch (err) {
      console.error("Save service error:", err);
      setError(err.response?.data?.message || "Failed to save service");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove saved service
  const removeSavedService = async (serviceId) => {
    try {
      setLoading(true);
      await apiClient.delete(`/user/remove-saved-service/${serviceId}`);
      await fetchSavedServices();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchSavedServices();
      fetchFolders();
    }
  }, [user?.user_id, fetchSavedServices, fetchFolders]);

  return {
    savedServices,
    folders,
    loading,
    error,
    saveServiceToFolder,
    createFolder,
    removeSavedService,
    refetch: () => {
      fetchSavedServices();
      fetchFolders();
    },
  };
};

export default useSavedList;