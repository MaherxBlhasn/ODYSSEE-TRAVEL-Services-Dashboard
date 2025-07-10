interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  date: string;
  status: 'new' | 'replied' | 'pending';
}

export default function ContactRow({ contact }: { contact: Contact }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
          <div className="text-sm text-gray-500">{contact.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.subject}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {contact.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            contact.status === 'new'
              ? 'bg-green-100 text-green-800'
              : contact.status === 'replied'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {contact.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-orange-600 hover:text-orange-900 mr-3">
          Reply
        </button>
        <button className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );
}