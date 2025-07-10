import ContactRow from '../components/ContactRow';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  date: string;
  status: 'new' | 'replied' | 'pending';
}

export default function ContactsSection() {
  const contacts: Contact[] = [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", subject: "Bali Package Inquiry", date: "2024-07-08", status: "new" },
    { id: 2, name: "Michael Chen", email: "mike@email.com", subject: "Group Booking Request", date: "2024-07-07", status: "replied" },
    { id: 3, name: "Emma Davis", email: "emma@email.com", subject: "Custom Tour Question", date: "2024-07-06", status: "pending" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Customer Contacts</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}