import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// OpenAI model configurations for AI Assistant
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = 'gpt-4o';

// TODO: Implement embedding generation function
export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Call OpenAI embeddings API
  // const response = await openai.embeddings.create({
  //   model: EMBEDDING_MODEL,
  //   input: text,
  // });
  // return response.data[0].embedding;
  throw new Error('Not implemented');
}

// TODO: Implement chat completion function
export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context?: string
): Promise<string> {
  // TODO: Call OpenAI chat completions API with context
  // const response = await openai.chat.completions.create({
  //   model: CHAT_MODEL,
  //   messages: [
  //     ...(context ? [{ role: 'system' as const, content: `Context: ${context}` }] : []),
  //     ...messages,
  //   ],
  // });
  // return response.choices[0].message.content || '';
  throw new Error('Not implemented');
}