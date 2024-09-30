import React, { useEffect, useState } from 'react';
import '../styles/conversations.css'; // CSS file for styling
import { ACCESS_TOKEN } from '../config';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showDetails, setShowDetails] = useState({}); // Track visibility of conversation details

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/conversations?fields=id,messages{message,to,from,created_time}',
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (data && data.data) {
          setConversations(data.data);
        } else {
          console.error('No data found in response');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();

    // Set up an interval to fetch the feed data every 5 seconds
    const intervalId = setInterval(fetchConversations, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleDropdownToggle = (id) => {
    if (selectedConversationId === id) {
      setSelectedConversationId(null);
    } else {
      setSelectedConversationId(id);
    }
  };

  const handleAction = () => {
    setShowDetails(prev => ({
      ...prev,
      [selectedConversationId]: !prev[selectedConversationId]
    }));
  };

  return (
    <div className='conversations'>
      <h1>Conversations</h1>
      <div className='conversation-list'>
        {conversations.map((conversation) => (
          <div key={conversation.id} className='conversation-item'>
            <div className='conversation-header'>
              <h2>Conversation ID: {conversation.id}</h2>
              <div className='dropdown'>
                <button 
                  className='dropdown-toggle' 
                  onClick={() => handleDropdownToggle(conversation.id)}
                >
                  Actions
                </button>
                {selectedConversationId === conversation.id && (
                  <div className='dropdown-menu'>
                    <button onClick={handleAction}>
                      {showDetails[conversation.id] ? 'Hide' : 'Show'} Details
                    </button>
                  </div>
                )}
              </div>
            </div>
            {showDetails[conversation.id] && (
              <div className='conversation-details'>
                {conversation.messages.data.map((message) => (
                  <div key={message.id} className='message'>
                    <p><strong>From:</strong> {message.from.name} ({message.from.email})</p>
                    <p><strong>To:</strong> {message.to.data[0].name} ({message.to.data[0].email})</p>
                    <p><strong>Message:</strong> {message.message}</p>
                    <p><strong>Created Time:</strong> {new Date(message.created_time).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
