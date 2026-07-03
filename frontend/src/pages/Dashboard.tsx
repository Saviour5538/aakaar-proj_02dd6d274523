import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDocuments as getDocuments, listConversations as getConversations } from '../api/client';
import { Document, Conversation } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDocuments(true);
      setLoadingConversations(true);
      setError(null);

      try {
        const docsResponse = await getDocuments();
        setDocuments(docsResponse);

        const convosResponse = await getConversations();
        setConversations(convosResponse);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        toast.error('Error fetching data.');
      } finally {
        setLoadingDocuments(false);
        setLoadingConversations(false);
      }
    };

    fetchData();
  }, []);

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Documents</h2>
          {loadingDocuments ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{documents.length}</p>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          {loadingConversations ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{conversations.length}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
        {loadingDocuments ? (
          <p>Loading...</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {documents.slice(0, 5).map((doc) => (
              <li key={doc.id} className="p-4">
                {doc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
        {loadingConversations ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p>No conversations found.</p>
        ) : (
          <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {conversations.slice(0, 5).map((convo) => (
              <li key={convo.id} className="p-4">
                {convo.title || 'Untitled Conversation'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleUploadClick}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-600"
        >
          Upload Document
        </button>
        <button
          onClick={handleChatClick}
          className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default Dashboard;