import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY!;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

export const openai = new OpenAI({
  apiKey,
});

// TODO: Implement embedding function
// export async function createEmbedding(text: string): Promise<number[]> {
//   const response = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: text,
//   });
//   return response.data[0].embedding;
// }

// TODO: Implement chat completion function
// export async function createChatCompletion(messages: any[]): Promise<string> {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o',
//     messages,
//     temperature: 0.7,
//     max_tokens: 1000,
//   });
//   return response.choices[0].message.content || '';
// }
