import { useEffect, useState } from "react";
import {
  Edit2,
  DollarSign,
  Clock,
  Star,
  Save,
  X,
  ToggleRight,
} from "lucide-react";
import apiClient from "../../../lib/api-client";

const BoostingManage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
    priority_score: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await apiClient.get("/administration/boosting/plan/list");
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      title: plan.title,
      price: plan.price,
      duration: plan.duration,
      description: plan.description,
      priority_score: plan.priority_score,
      active: plan.active,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(
        `/administration/boosting/plan/update/${selectedPlan.id}`,
        formData
      );
      await fetchPlans();
      setShowEditModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Failed to update plan:", error);
      alert("Failed to update plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  const getPlanColor = (index) => {
    const colors = [
      "from-purple-500 to-purple-600",
      "from-blue-500 to-blue-600",
      "from-amber-500 to-amber-600",
      "from-green-500 to-green-600",
      "from-pink-500 to-pink-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-fullmx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold pb-1">Boosting Plans</h1>
              <p className="text-slate-600">
                Manage your service boosting plans and pricing
              </p>
            </div>
            {/* <button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Plan</span>
            </button> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Total Plans</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {plans.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Active Plans</p>
                  <p className="text-3xl font-bold text-green-600">
                    {plans.filter((p) => p.active).length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <ToggleRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Avg. Price</p>
                  <p className="text-3xl font-bold text-purple-600">
                    $
                    {(
                      plans.reduce((acc, p) => acc + parseFloat(p.price), 0) /
                      plans.length
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Avg. Duration</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {Math.round(
                      plans.reduce((acc, p) => acc + p.duration, 0) /
                        plans.length
                    )}
                    d
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div
                className={`bg-linear-to-r ${getPlanColor(
                  index
                )} p-6 text-white`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{plan.title}</h3>
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{plan.duration} days</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.active ? "bg-white/20" : "bg-red-500/50"
                    }`}
                  >
                    {plan.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="text-4xl font-extrabold">
                  ${parseFloat(plan.price).toFixed(2)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Plan ID</span>
                    <span className="font-semibold text-slate-800">
                      #{plan.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Priority Score</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-slate-800">
                        {plan.priority_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span
                      className={`font-semibold ${
                        plan.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(plan)}
                    className={`flex-1 bg-linear-to-r ${getPlanColor(
                      index
                    )} text-white py-2 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg`}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Plan</span>
                  </button>
                  {/* <button
                    className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-all"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}

              <div className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Edit Plan</h2>
                </div>
                <button onClick={closeModal} className="cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Modal Body */}
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Plan Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-all"
                      placeholder="e.g., Weekly Plan"
                    />
                  </div>

                  {/* Price and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-all"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Duration (Days)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-all"
                          placeholder="7"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-all resize-none"
                      placeholder="Describe this plan..."
                    />
                  </div>

                  {/* Priority Score */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Priority Score
                    </label>
                    <div className="relative">
                      <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        name="priority_score"
                        value={formData.priority_score}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-all"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">
                          Plan Status
                        </h4>
                        <p className="text-sm text-slate-600">
                          Make this plan available to customers
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="active"
                          checked={formData.active}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-5">
                  <button
                    onClick={closeModal}
                    className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-linear-to-r from-slate-900 to-slate-800 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoostingManage;
