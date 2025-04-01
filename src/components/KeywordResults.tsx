'use client';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
}

interface KeywordResult {
  primaryKeyword: string;
  keywords: KeywordData[];
  error?: string;
}

interface KeywordResultsProps {
  results: KeywordResult[];
  isLoading: boolean;
}

export function KeywordResults({ results, isLoading }: KeywordResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Long-tail keywords for: <span className="text-blue-600">{result.primaryKeyword}</span>
          </h2>
          
          {result.error ? (
            <div className="text-red-500 mb-4">
              Error: {result.error}
            </div>
          ) : result.keywords.length === 0 ? (
            <div className="text-gray-500">
              No keywords generated for this term.
            </div>
          ) : (
            <div className="space-y-4">
              {result.keywords.map((keywordData, keywordIndex) => (
                <div
                  key={keywordIndex}
                  className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-800 font-medium">{keywordData.keyword}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(keywordData.keyword);
                        // TODO: Add toast notification for copy success
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search Volume: {keywordData.searchVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Difficulty: {keywordData.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 