import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// OpenAI model configurations for AI Assistant
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = 'gpt-4o';

// Generate embedding for text using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Generate chat response with context
export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context?: string
): Promise<string> {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: `You are Humza's AI assistant. You help recruiters and visitors learn about Humza's skills, projects, and experience. Be helpful, professional, and concise. Use the provided context to answer questions accurately.${
        context ? `\n\nContext about Humza's projects: ${context}` : ''
      }`
    };

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate chat response');
  }
}

// Generate embeddings for multiple texts (batch processing)
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}