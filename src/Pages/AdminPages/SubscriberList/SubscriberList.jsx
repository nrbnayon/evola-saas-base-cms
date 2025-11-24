import useSubscriberList from '../../../dashboardHook/useSubscriberList';
import { Calendar, Mail, Users } from 'lucide-react';

const SubscriberList = () => {
    const {subscriberList, loading} = useSubscriberList()
    console.log(subscriberList);
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-300 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Subscribers</h1>
              <p className="text-slate-600">Manage your email subscribers</p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Subscribers</p>
                <p className="text-4xl font-bold text-slate-900">{subscriberList?.length || 0}</p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscriber List */}
        {subscriberList && subscriberList.length > 0 ? (
          <div className="space-y-3">
            {subscriberList.map((subscriber, index) => (
              <div
                key={subscriber.email_address}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 hover:border-purple-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md group-hover:scale-110 transition-transform">
                    {getInitials(subscriber.email_address)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <p className="text-slate-900 font-medium truncate">
                        {subscriber.email_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <p className="text-sm text-slate-500">
                        Joined {formatDate(subscriber.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No subscribers yet</h3>
            <p className="text-slate-600">Your subscriber list will appear here once people sign up.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default SubscriberList;