import { ContactDataFetch } from "@/lib/types/contact.types";
import { Clock, MessageCircle, MessageSquare, User, X } from "lucide-react";

export const MessageModal = ({ 
  isOpen, 
  onClose, 
  contact 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  contact: ContactDataFetch | null; 
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Message Details</h2>
                <p className="text-gray-500 text-sm">Customer inquiry information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-medium text-gray-800">Contact Information</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900 font-medium">
                    {contact.name} {contact.familyName || ''}
                  </p>
                  <p className="text-blue-600 font-medium text-sm">{contact.Email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>Message Sent</span>
                  </label>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-medium">
                      {new Date(contact.messageSentAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-500 rounded-full shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white font-medium text-sm">
                        {new Date(contact.messageSentAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {contact.phone && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-gray-900 font-medium">{contact.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Content Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-medium text-gray-800">Message Content</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message || 'No message content available.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};