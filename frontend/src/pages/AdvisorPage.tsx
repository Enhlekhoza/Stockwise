import React, { useState, useEffect } from 'react';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const AdvisorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am your AI Business Advisor. How can I help you increase your profits today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      try {
        const response = await fetch('http://localhost:3001/api/advisor/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });
        const aiMessage: Message = await response.json();
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("Failed to get response from advisor:", error);
        const errorMessage: Message = { sender: 'ai', text: 'Sorry, I am having trouble connecting to my brain right now.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Generative Business Advisor</h2>
      <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: '70vh' }}>
        {/* Message Window */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCpu size={20} />
                  </div>
                )}
                <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <FiUser size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about your business..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={!input.trim()}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvisorPage;
