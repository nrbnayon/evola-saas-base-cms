const notifications = [
  {
    id: 1,
    type: "Wedding Photography",
    location: "Overland Park, KS",
    fullLocation: "Overland Park, KS Overland Park, KS",
    time: "5m",
    avatar: "WP",
    isOnline: true,
  },
  {
    id: 2,
    type: "Wedding Photography",
    location: "Overland Park, KS",
    fullLocation: "Overland Park, KS Overland Park, KS",
    time: "5m",
    avatar: "WP",
    isOnline: true,
  },
  {
    id: 3,
    type: "Wedding Photography",
    location: "Overland Park, KS",
    fullLocation: "Overland Park, KS Overland Park, KS",
    time: "5m",
    avatar: "WP",
    isOnline: true,
  },
  {
    id: 4,
    type: "Wedding Photography",
    location: "Overland Park, KS",
    fullLocation: "Overland Park, KS Overland Park, KS",
    time: "5m",
    avatar: "WP",
    isOnline: true,
  },
  {
    id: 5,
    type: "Wedding Photography",
    location: "Overland Park, KS",
    fullLocation: "Overland Park, KS Overland Park, KS",
    time: "5m",
    avatar: "WP",
    isOnline: true,
  },
];

const Notification = () => {
  return (
    <div>
      <div className=" bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">
            Notification ({notifications.length})
          </h3>
        </div>

        <div className="py-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {notification.avatar}
                  </div>
                  {notification.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {notification.type}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {notification.fullLocation}
                  </p>
                  <span className="text-xs text-gray-400 mt-1 inline-block">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100 text-center">
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
