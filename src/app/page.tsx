'use client';

import { useState } from 'react';
import { KeywordForm } from '@/components/KeywordForm';
import { KeywordResults } from '@/components/KeywordResults';
import { ActionButtons } from '@/components/ActionButtons';

interface KeywordResult {
  primaryKeyword: string;
  keywords: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
  }>;
  error?: string;
}

export default function Home() {
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleGenerateKeywords = async (primaryKeywords: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primaryKeywords }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error generating keywords:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setResults([]);
    setInputValue('');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          TailFinder
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Generate high-quality long-tail keywords using AI
        </p>
        
        <ActionButtons onRestart={handleRestart} keywords={results.flatMap(r => r.keywords)} />
        <KeywordForm 
          onSubmit={handleGenerateKeywords} 
          isLoading={isLoading}
          value={inputValue}
          onChange={setInputValue}
        />
        <KeywordResults results={results} isLoading={isLoading} />
      </div>
    </main>
  );
}
