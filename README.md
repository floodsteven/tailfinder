# TailFinder

TailFinder is a powerful tool that generates high-quality long-tail keywords using AI. It helps content creators and SEO professionals discover valuable keyword opportunities based on primary keywords.

## Features

- Generate 10 long-tail keywords for each primary keyword
- Realistic search volume estimates
- Keyword difficulty scoring
- CSV export functionality
- Clean, modern UI
- Built with Next.js and Google's Gemini AI

## Prerequisites

- Node.js 18.0 or later
- A Google Gemini API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tailfinder.git
cd tailfinder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter one or more primary keywords (comma-separated)
2. Click "Generate Keywords"
3. View the generated long-tail keywords with search volumes and difficulty scores
4. Copy individual keywords or export all results to CSV

## Deployment

This project is optimized for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` to Vercel's environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
