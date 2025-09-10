import { Metadata } from 'next';
import ChatBox from '@/components/ChatBox';

export const metadata: Metadata = {
  title: 'AI Assistant | Humza Malak',
  description: 'Chat with Humza\'s AI assistant to learn about his projects, skills, and experience.',
};

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Assistant
          </h1>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Chat with my AI assistant to learn about my projects, skills, and experience. 
            Ask questions or type 'overview' for a complete tour of my work.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ChatBox />
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">🚀 Powered by AI</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This AI assistant uses OpenAI GPT-4o and advanced RAG technology to provide 
              intelligent responses about my work and experience.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>• Real-time streaming responses</p>
              <p>• Context-aware project recommendations</p>
              <p>• Interactive project exploration</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
