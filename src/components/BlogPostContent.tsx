'use client';

import { useMemo } from 'react';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const processedContent = useMemo(() => {
    // Simple markdown-like processing for demonstration
    // In a real implementation, you'd use a proper MDX parser
    
    const lines = content.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headings
      if (line.startsWith('# ')) {
        processedLines.push(`<h1 class="text-3xl font-bold mb-4 mt-8">${line.slice(2)}</h1>`);
      } else if (line.startsWith('## ')) {
        processedLines.push(`<h2 class="text-2xl font-bold mb-3 mt-6">${line.slice(3)}</h2>`);
      } else if (line.startsWith('### ')) {
        processedLines.push(`<h3 class="text-xl font-bold mb-2 mt-4">${line.slice(4)}</h3>`);
      } else if (line.startsWith('#### ')) {
        processedLines.push(`<h4 class="text-lg font-bold mb-2 mt-4">${line.slice(5)}</h4>`);
      }
      // Paragraphs
      else if (line.trim() === '') {
        processedLines.push('<br>');
      } else if (line.startsWith('- ')) {
        processedLines.push(`<li class="ml-4 mb-1">${line.slice(2)}</li>`);
      } else if (line.startsWith('```')) {
        // Handle code blocks
        let codeBlock = '';
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('```')) {
          codeBlock += lines[j] + '\n';
          j++;
        }
        i = j;
        
        const language = line.slice(3).trim();
        
        processedLines.push(`<div class="code-block" data-language="${language}">${codeBlock.trim()}</div>`);
      } else {
        processedLines.push(`<p class="mb-4 leading-relaxed">${line}</p>`);
      }
    }
    
    return processedLines.join('\n');
  }, [content]);

  const renderContent = () => {
    // Simple approach: just render the HTML content directly
    // Code blocks will be handled by the HTML rendering
    return (
      <div
        dangerouslySetInnerHTML={{ __html: processedContent }}
        className="[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-4 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mb-2 [&>h4]:mt-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>li]:ml-4 [&>li]:mb-1 [&>.code-block]:bg-neutral-800 [&>.code-block]:p-4 [&>.code-block]:rounded-lg [&>.code-block]:my-4 [&>.code-block]:font-mono [&>.code-block]:text-sm"
      />
    );
  };

  return (
    <div className="blog-content">
      {renderContent()}
    </div>
  );
}
