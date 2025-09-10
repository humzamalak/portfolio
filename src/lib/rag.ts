import { supabase, Project, ProjectVersion, QueryLog } from './supabase';
import { generateEmbedding, generateChatResponse } from './openai';

export interface RetrievalResult {
  projects: Project[];
  confidence: number;
  context: string;
}

export interface ChatResponse {
  message: string;
  media?: string;
  projects?: Project[];
  suggestions?: string[];
}

// Retrieve top projects based on query similarity
export async function retrieveProjects(
  query: string,
  limit: number = 3
): Promise<RetrievalResult> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Perform vector similarity search
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, description, demo_url, image_url, embedding')
      .not('embedding', 'is', null)
      .order('embedding <-> :query_embedding', { ascending: true })
      .limit(limit)
      .set('query_embedding', `[${queryEmbedding.join(',')}]`);

    if (error) {
      console.error('Supabase retrieval error:', error);
      throw new Error('Failed to retrieve projects');
    }

    if (!projects || projects.length === 0) {
      return {
        projects: [],
        confidence: 0,
        context: ''
      };
    }

    // Calculate confidence based on similarity (cosine distance)
    // Lower distance = higher similarity = higher confidence
    const topProject = projects[0];
    const confidence = topProject.embedding ? 
      calculateCosineSimilarity(queryEmbedding, topProject.embedding) : 0;

    // Create context string from retrieved projects
    const context = projects
      .map(project => `${project.title}: ${project.description}`)
      .join('\n\n');

    return {
      projects: projects as Project[],
      confidence,
      context
    };
  } catch (error) {
    console.error('Error in retrieveProjects:', error);
    return {
      projects: [],
      confidence: 0,
      context: ''
    };
  }
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get proactive suggestions based on retrieved projects
export async function getSuggestions(projectIds: string[], query: string): Promise<string[]> {
  try {
    if (projectIds.length === 0) {
      return [];
    }

    // Generate embedding for the query to find similar projects
    const queryEmbedding = await generateEmbedding(query);

    // Get suggestions excluding already retrieved projects
    const { data: suggestions, error } = await supabase
      .from('projects')
      .select('title, demo_url')
      .not('id', 'in', `(${projectIds.join(',')})`)
      .not('embedding', 'is', null)
      .order('embedding <-> :query_embedding', { ascending: true })
      .limit(2)
      .set('query_embedding', `[${queryEmbedding.join(',')}]`);

    if (error) {
      console.error('Supabase suggestions error:', error);
      return [];
    }

    if (!suggestions || suggestions.length === 0) {
      return [];
    }

    // Format suggestions with clickable links
    return suggestions.map(s => {
      if (s.demo_url) {
        return `You might also like [${s.title}](${s.demo_url})`;
      }
      return `You might also like ${s.title}`;
    });
  } catch (error) {
    console.error('Error in getSuggestions:', error);
    return [];
  }
}

// Generate chat response with RAG
export async function generateRAGResponse(
  query: string,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  sessionId?: string
): Promise<ChatResponse> {
  try {
    // Retrieve relevant projects
    const retrieval = await retrieveProjects(query);
    
    // Note: Query logging is now handled in the API endpoints

    // Get proactive suggestions
    const projectIds = retrieval.projects.map(p => p.id);
    const suggestions = await getSuggestions(projectIds, query);

    // Handle ambiguous queries (low confidence)
    if (retrieval.confidence < 0.8) {
      let message = "Hey there! I couldn't find an exact match for your query, but here are some related projects that showcase Humza's full-stack problem-solving skills. You can also browse his full portfolio: [Portfolio](/projects)";
      
      // Append suggestions if available
      if (suggestions.length > 0) {
        message += "\n\n" + suggestions.join("\n");
      }

      return {
        message,
        media: retrieval.projects[0]?.image_url || retrieval.projects[0]?.demo_url,
        projects: retrieval.projects,
        suggestions
      };
    }

    // Generate response with context
    const response = await generateChatResponse(messages, retrieval.context);

    // Determine best media to show
    const media = retrieval.projects[0]?.image_url || retrieval.projects[0]?.demo_url;

    // Append suggestions to the response
    let finalMessage = response;
    if (suggestions.length > 0) {
      finalMessage += "\n\n" + suggestions.join("\n");
    }

    return {
      message: finalMessage,
      media,
      projects: retrieval.projects,
      suggestions
    };
  } catch (error) {
    console.error('Error in generateRAGResponse:', error);
    return {
      message: "Hey there! I'm having a bit of trouble processing your request right now. Please try again or feel free to browse Humza's portfolio directly - he's got some amazing full-stack projects to show off!",
      projects: []
    };
  }
}

// Note: Query logging moved to analytics.ts module

// Store project with embedding
export async function storeProjectWithEmbedding(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  try {
    // Generate embedding for the project description
    const embedding = await generateEmbedding(project.description);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        embedding,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing project:', error);
      throw new Error('Failed to store project');
    }

    return data as Project;
  } catch (error) {
    console.error('Error in storeProjectWithEmbedding:', error);
    throw error;
  }
}

// Update project and create version
export async function updateProjectWithVersioning(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>,
  versionId: string
): Promise<Project> {
  try {
    // Get current project
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !currentProject) {
      throw new Error('Project not found');
    }

    // Store current version before updating
    if (currentProject.embedding) {
      await supabase
        .from('versions')
        .insert({
          project_id: projectId,
          version_id: versionId,
          embedding: currentProject.embedding,
          created_at: new Date().toISOString()
        });
    }

    // Generate new embedding if description changed
    let embedding = currentProject.embedding;
    if (updates.description && updates.description !== currentProject.description) {
      embedding = await generateEmbedding(updates.description);
    }

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        embedding,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }

    return data as Project;
  } catch (error) {
    console.error('Error in updateProjectWithVersioning:', error);
    throw error;
  }
}

// Rollback to previous version
export async function rollbackProjectVersion(
  projectId: string,
  versionId: string
): Promise<Project> {
  try {
    // Get the version to rollback to
    const { data: version, error: versionError } = await supabase
      .from('versions')
      .select('embedding')
      .eq('project_id', projectId)
      .eq('version_id', versionId)
      .single();

    if (versionError || !version) {
      throw new Error('Version not found');
    }

    // Update project with the old embedding
    const { data, error } = await supabase
      .from('projects')
      .update({
        embedding: version.embedding,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error rolling back project:', error);
      throw new Error('Failed to rollback project');
    }

    return data as Project;
  } catch (error) {
    console.error('Error in rollbackProjectVersion:', error);
    throw error;
  }
}
