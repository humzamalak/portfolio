'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/chat' 
  });
  const [showWelcome, setShowWelcome] = useState(true);

  const sampleQueries = [
    "What's Humza's best backend project?",
    "Show me his frontend skills",
    "Tell me about his experience with AI",
    "What technologies does he use?",
  ];

  const handleSampleQuery = (query: string) => {
    // TODO: Implement sample query handling
    console.log('Sample query:', query);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4 h-[600px]">
      {/* Welcome Message */}
      {showWelcome && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Hi, I'm Humza's AI assistant! Ask about his projects or type 'overview' for a tour.
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(query)}
                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {/* TODO: Add media display for images/demo links */}
              {message.role === 'assistant' && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {/* Placeholder for media attachments */}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about Humza's projects..."
          className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}