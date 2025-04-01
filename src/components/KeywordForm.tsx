'use client';

import { useState } from 'react';

interface KeywordFormProps {
  onSubmit: (keywords: string[]) => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function KeywordForm({ onSubmit, isLoading, value, onChange }: KeywordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    onSubmit(keywords);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Enter primary keywords (comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., running shoes, hiking boots, sneakers"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Keywords'}
        </button>
      </div>
    </form>
  );
} 