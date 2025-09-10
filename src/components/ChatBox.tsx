'use client';

import { useChat } from 'ai/react';

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ 
    api: '/api/chat' 
  });

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-800 dark:text-gray-200">
          Hi, I'm Humza's AI assistant! Ask about his projects or type 'overview' for a tour.
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
          <button 
            className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
            onClick={() => handleSubmit({ preventDefault: () => {}, target: { value: "What's Humza's best backend project?" } } as any)}
          >
            What's Humza's best backend project?
          </button>
          <button 
            className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
            onClick={() => handleSubmit({ preventDefault: () => {}, target: { value: "Show me Humza's frontend skills" } } as any)}
          >
            Show me Humza's frontend skills
          </button>
          <button 
            className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
            onClick={() => handleSubmit({ preventDefault: () => {}, target: { value: "overview" } } as any)}
          >
            Overview
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-96 space-y-2">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900 ml-8' 
                : 'bg-gray-100 dark:bg-gray-800 mr-8'
            }`}
          >
            <div className="text-sm text-gray-800 dark:text-gray-200">
              {message.content}
              {/* TODO: Add media display for images/demo links */}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ask about Humza's projects..."
        />
        <button 
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
