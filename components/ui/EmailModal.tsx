'use client';

import React, { useState } from 'react';
import { X, Send, Users, Mail } from 'lucide-react';
import { Subscriber } from '@/lib/types/newspaper.types';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: Subscriber[];
  totalSubscribers: number;
  selectedIds: string[];
  onSend: (subject: string, content: string, isAll: boolean) => Promise<void>;
  isLoading: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  totalSubscribers,
  selectedIds,
  onSend,
  isLoading
}) => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [sendToAll, setSendToAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      return;
    }

    try {
      await onSend(subject, content, sendToAll);
      // Reset form after successful send
      setSubject('');
      setContent('');
      setSendToAll(false);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleClose = () => {
    setSubject('');
    setContent('');
    setSendToAll(false);
    onClose();
  };

  const recipientCount = sendToAll ? totalSubscribers : selectedIds.length;
  const canSend = subject.trim() && content.trim() && recipientCount > 0;

  return (
<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white text-black-600 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 bg-opacity-20 p-2 rounded-lg">
                <Send className="text-white bg-gradient w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-orange-600 sm:text-xl font-bold">Send Newsletter</h2>
                <p className="text-sm opacity-90">Compose and send your newsletter campaign</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="bg-orange bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Recipient Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recipients</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="recipients"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    Send to Selected ({selectedIds.length} subscriber{selectedIds.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="recipients"
                  checked={sendToAll}
                  onChange={() => setSendToAll(true)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    Send to All Subscribers ({totalSubscribers} subscriber{totalSubscribers !== 1 ? 's' : ''})
                  </span>
                </div>
              </label>
            </div>

            {/* Recipient Count Display */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Newsletter will be sent to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your newsletter subject..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Newsletter Content
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your newsletter content here..."
              className="border-2 border-gray-200 focus-within:border-orange-500 transition-colors duration-200"
              minHeight="300px"
            />
          </div>

          {/* Preview Section */}
          {(subject || content) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {subject && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600 font-medium">Subject: </span>
                    <span className="text-gray-800 font-semibold">{subject}</span>
                  </div>
                )}
                {content && (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 shrink-0">
              <Mail className="w-4 h-4" />
              <span>
                Ready to send to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend || isLoading}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Newsletter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;