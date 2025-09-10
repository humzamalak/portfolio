import { Metadata } from 'next';
import ChatBox from '@/components/ChatBox';

export const metadata: Metadata = {
  title: 'AI Assistant | Humza Malak',
  description: 'Chat with Humza\'s AI assistant to learn about his projects and experience.',
};

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chat with my AI assistant to learn about my projects, skills, and experience.
          </p>
        </div>
        
        <ChatBox />
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This AI assistant is powered by OpenAI GPT-4o and uses Supabase for data retrieval.
            {/* TODO: Add more information about the assistant's capabilities */}
          </p>
        </div>
      </div>
    </div>
  );
}
