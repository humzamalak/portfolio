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
  const [highContrastMode, setHighContrastMode] = useState(false);

  const sampleQueries = [
    "What's Humza's best backend project?",
    "Show me a React app",
    "What skills does Humza have?",
  ];

  // Initialize high-contrast mode from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrastMode');
    if (savedHighContrast === 'true') {
      setHighContrastMode(true);
    }
  }, []);

  // Toggle high-contrast mode
  const toggleHighContrast = () => {
    const newMode = !highContrastMode;
    setHighContrastMode(newMode);
    localStorage.setItem('highContrastMode', newMode.toString());
  };

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
    <div 
      className={`flex flex-col gap-4 max-w-2xl mx-auto p-4 h-[600px] ${
        highContrastMode ? 'bg-black text-white' : ''
      }`}
      role="region" 
      aria-label="Chat with Humza's AI assistant"
      aria-live="polite"
    >
      {/* High-Contrast Toggle */}
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleHighContrast}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            highContrastMode 
              ? 'bg-white text-black border border-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label={`${highContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
          title={`${highContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
        >
          {highContrastMode ? '🌞 Normal' : '🌙 High Contrast'}
        </button>
      </div>

      {/* Welcome Message */}
      {showWelcome && (
        <div className={`p-4 rounded-lg ${
          highContrastMode 
            ? 'bg-white text-black border-2 border-white' 
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <p className={`mb-2 ${
            highContrastMode 
              ? 'text-black' 
              : 'text-gray-800 dark:text-gray-200'
          }`}>
            Hi, I&apos;m Humza&apos;s AI assistant! Ask about his projects or type &apos;overview&apos; for a tour.
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(query)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  highContrastMode
                    ? 'bg-black text-white border border-white hover:bg-gray-800'
                    : 'bg-primary text-white hover:bg-primary-700'
                }`}
                aria-label={`Ask: ${query}`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            role="article"
            aria-label={`${message.role === 'user' ? 'Your message' : 'Assistant response'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                highContrastMode
                  ? message.role === 'user'
                    ? 'bg-white text-black border-2 border-white'
                    : 'bg-black text-white border-2 border-white'
                  : message.role === 'user'
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
                      alt="Project screenshot showing the application interface" 
                      className={`mt-2 max-w-full rounded border ${
                        highContrastMode ? 'border-white' : ''
                      }`}
                      loading="lazy"
                    />
                  )}
                  {(message as { media?: { type: string; url: string } }).media?.type === 'link' && (
                    <a 
                      href={(message as { media?: { type: string; url: string } }).media?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`mt-2 inline-block px-2 py-1 rounded text-sm transition-colors ${
                        highContrastMode
                          ? 'bg-white text-black border border-white hover:bg-gray-200'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                      }`}
                      aria-label="View project demo in new tab"
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
            <div className={`max-w-[80%] p-3 rounded-lg ${
              highContrastMode
                ? 'bg-black text-white border-2 border-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}>
              <p className={`mb-3 font-medium ${
                highContrastMode ? 'text-white' : ''
              }`}>{overviewData.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overviewData.projects.map((project) => (
                  <div key={project.id} className={`border p-3 rounded-lg ${
                    highContrastMode
                      ? 'border-white bg-white text-black'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      highContrastMode ? 'text-black' : 'text-gray-900 dark:text-gray-100'
                    }`}>{project.title}</h3>
                    <p className={`text-sm mb-2 ${
                      highContrastMode ? 'text-black' : 'text-gray-600 dark:text-gray-400'
                    }`}>{project.description}</p>
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm font-medium ${
                          highContrastMode
                            ? 'text-black underline hover:text-gray-600'
                            : 'text-primary hover:text-primary-700'
                        }`}
                        aria-label={`View demo for ${project.title}`}
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
            <div className={`max-w-[80%] p-3 rounded-lg ${
              highContrastMode
                ? 'bg-white text-black border-2 border-red-500'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
            role="alert"
            aria-live="assertive"
            >
              <p className={`font-medium ${
                highContrastMode ? 'text-black' : ''
              }`}>⚠️ Error</p>
              <p className={`text-sm mt-1 ${
                highContrastMode ? 'text-black' : ''
              }`}>{error?.message || apiError}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-lg ${
              highContrastMode
                ? 'bg-black text-white border-2 border-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
            role="status"
            aria-live="polite"
            aria-label="Loading response"
            >
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  highContrastMode ? 'bg-white' : 'bg-gray-400'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  highContrastMode ? 'bg-white' : 'bg-gray-400'
                }`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  highContrastMode ? 'bg-white' : 'bg-gray-400'
                }`} style={{ animationDelay: '0.2s' }}></div>
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
      }} className="flex gap-2" role="form" aria-label="Chat input form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about Humza's projects..."
          className={`flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            highContrastMode
              ? 'border-white bg-black text-white placeholder-gray-300'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
          }`}
          disabled={isLoading}
          aria-label="Ask about Humza's projects"
          aria-describedby="input-help"
          autoComplete="off"
          tabIndex={0}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed ${
            highContrastMode
              ? 'bg-white text-black border border-white hover:bg-gray-200 disabled:opacity-50'
              : 'bg-primary text-white hover:bg-primary-700 disabled:opacity-50'
          }`}
          aria-label="Send message"
          tabIndex={0}
        >
          Send
        </button>
      </form>
      <div id="input-help" className="sr-only">
        Type your question about Humza's projects and press Enter or click Send to submit.
      </div>
    </div>
  );
}