'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

export default function ChatBox() {
  // Generate session ID once per component mount
  const sessionId = useMemo(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, error } = useChat({ 
    api: '/api/chat',
    body: {
      sessionId
    }
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [overviewData, setOverviewData] = useState<{
    message: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      demo_url?: string;
    }>;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const sampleQueries = [
    "What's Humza's best backend project?",
    "Show me a React app",
    "What skills does Humza have?",
  ];

  const handleSampleQuery = (query: string) => {
    setInput(query);
    setShowWelcome(false);
    // Trigger form submission
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  const handleOverviewCommand = async () => {
    try {
      setApiError(null);
      const response = await fetch('/api/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch overview data');
      }
      const data = await response.json();
      setOverviewData(data);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error fetching overview:', error);
      setApiError('Sorry, something went wrong. Try again or check the portfolio index.');
    }
  };

  // Handle overview command when user types "overview"
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content?.toLowerCase().trim() === 'overview') {
      handleOverviewCommand();
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4 h-[600px]">
      {/* Welcome Message */}
      {showWelcome && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Hi, I&apos;m Humza&apos;s AI assistant! Ask about his projects or type &apos;overview&apos; for a tour.
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
              <div className="whitespace-pre-wrap">
                {message.role === 'assistant' && (message as { suggestions?: string[] }).suggestions ? (
                  <div>
                    <p 
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(message.content.split('\n\n')[0]) 
                      }} 
                    />
                    {(message as { suggestions?: string[] }).suggestions?.map((suggestion: string, index: number) => (
                      <div key={index} className="mt-2">
                        <p 
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(suggestion) 
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(message.content) 
                    }} 
                  />
                )}
              </div>
              {/* Media display for images/demo links */}
              {message.role === 'assistant' && (message as { media?: { type: string; url: string } }).media && (
                <div className="mt-2">
                  {(message as { media?: { type: string; url: string } }).media?.type === 'image' && (
                    <img 
                      src={(message as { media?: { type: string; url: string } }).media?.url} 
                      alt="Project screenshot" 
                      className="mt-2 max-w-full rounded border"
                    />
                  )}
                  {(message as { media?: { type: string; url: string } }).media?.type === 'link' && (
                    <a 
                      href={(message as { media?: { type: string; url: string } }).media?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      🔗 View Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Overview Display */}
        {overviewData && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <p className="mb-3 font-medium">{overviewData.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overviewData.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-900">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-700 text-sm font-medium"
                      >
                        View Demo →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {(error || apiError) && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
              <p className="font-medium">⚠️ Error</p>
              <p className="text-sm mt-1">{error?.message || apiError}</p>
            </div>
          </div>
        )}

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
      <form onSubmit={(e) => {
        setShowWelcome(false);
        setApiError(null);
        // Pass last 3 messages for short-term memory context
        const formData = new FormData(e.currentTarget);
        const lastMessages = messages.slice(-3);
        handleSubmit(e, {
          body: {
            sessionId,
            lastMessages
          }
        });
      }} className="flex gap-2">
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