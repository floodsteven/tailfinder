import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
}

async function generateKeywordsForPrimary(primaryKeyword: string, maxRetries = 3): Promise<KeywordData[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const prompt = `Generate 10 creative and data-driven long-tail keywords based on the primary keyword: "${primaryKeyword}".

      Requirements:
      1. Be creative but realistic - use actual search patterns and user intent
      2. Include a mix of:
         - Question-based keywords (how to, what is, why, etc.)
         - Comparison keywords (best, top, vs, etc.)
         - Location-specific keywords (near me, in [city], etc.)
         - Problem-solving keywords (fix, solution, guide, etc.)
      3. Consider user intent:
         - Informational (learning, understanding)
         - Transactional (buying, purchasing)
         - Navigational (finding specific brands/products)
         - Commercial (researching before buying)
      4. Use realistic search volumes based on:
         - Keyword length (longer phrases typically have lower volume)
         - Commercial intent (transactional keywords often have higher volume)
         - Seasonal trends (if applicable)
      5. Set difficulty scores based on:
         - Competition level
         - Domain authority needed
         - Content quality requirements

      Return a JSON array of objects with keyword, searchVolume (0-100000), and difficulty (0-100).
      Example: [{"keyword":"best running shoes for beginners","searchVolume":1200,"difficulty":45}]`;

      console.log('Attempt', attempt, 'with prompt:', prompt);

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (!response || !response.text) {
        throw new Error('Invalid API response structure');
      }
      
      const text = response.text();
      console.log('Raw API response:', text);
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from API');
      }

      // Clean and parse the response
      const cleanedText = text.trim()
        .replace(/```json\n?|\n?```/g, '')
        .replace(/^[^{]*(\[.*\])[^}]*$/, '$1')
        .trim();
      
      console.log('Cleaned text:', cleanedText);
      
      if (!cleanedText || cleanedText.length === 0) {
        throw new Error('No valid JSON found in response');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse JSON response');
      }
      
      // Validate response is an array
      if (!Array.isArray(parsedResponse)) {
        throw new Error('Response is not an array');
      }

      // Validate each keyword
      const validKeywords = parsedResponse.filter((k: KeywordData) => 
        k.keyword && 
        typeof k.searchVolume === 'number' && 
        k.searchVolume >= 0 && 
        k.searchVolume <= 100000 &&
        typeof k.difficulty === 'number' && 
        k.difficulty >= 0 && 
        k.difficulty <= 100
      );

      if (validKeywords.length > 0) {
        return validKeywords;
      }

      throw new Error('No valid keywords found in response');
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('Failed to generate valid keywords after all retries');
}

export async function POST(request: Request) {
  try {
    const { primaryKeywords } = await request.json();

    if (!primaryKeywords || !Array.isArray(primaryKeywords) || primaryKeywords.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one primary keyword' },
        { status: 400 }
      );
    }

    // Generate keywords for each primary keyword
    const results = await Promise.all(
      primaryKeywords.map(async (primaryKeyword) => {
        try {
          const keywords = await generateKeywordsForPrimary(primaryKeyword);
          return {
            primaryKeyword,
            keywords
          };
        } catch (error) {
          console.error(`Error generating keywords for "${primaryKeyword}":`, error);
          return {
            primaryKeyword,
            keywords: [],
            error: error instanceof Error ? error.message : 'Failed to generate keywords'
          };
        }
      })
    );
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate keywords', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 