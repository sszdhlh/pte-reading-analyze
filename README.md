# PTE Reading Analysis Tool

A comprehensive web application designed to help students prepare for the PTE Academic Reading section. This tool provides detailed analysis of reading questions, strategies for different question types, and AI-powered answer analysis.

Live Demo: [PTE Reading Analysis Tool](https://nimble-hummingbird-c633b5.netlify.app)

## Features

- 📚 Comprehensive coverage of PTE Reading question types:
  - Reading & Writing: Fill in the Blanks
  - Multiple Choice (Multiple Answers)
  - Re-order Paragraphs
  - Reading: Fill in the Blanks
  - Multiple Choice (Single Answer)

- 🤖 AI-powered answer analysis
- 📊 Detailed feedback and improvement suggestions
- ⏱️ Time management guidelines
- 🎯 Question-specific strategies
- ⚠️ Common pitfalls and how to avoid them
- 📝 Sample questions with solutions

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase Edge Functions
- Lucide React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sszdhlh/pte-reading-analyze.git
   cd pte-reading-analyze
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Supabase Edge Functions Setup

The project uses Supabase Edge Functions for AI-powered answer analysis. To set up the Edge Functions:

1. Install Supabase CLI (if not already installed)
2. Set up your Supabase project and get the necessary credentials
3. Add the following secrets to your Supabase project:
   - `OPENAI_API_KEY`: Your OpenAI API key for the answer analysis feature

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

The project is configured for easy deployment to Netlify. You can deploy your own instance by:

1. Fork the repository
2. Connect your fork to Netlify
3. Set up the environment variables in Netlify:
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_URL`

## Project Structure

```
pte-reading-analyze/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── supabase/
│   └── functions/       # Supabase Edge Functions
│       └── analyze/     # Answer analysis function
├── public/              # Static assets
└── package.json        # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/sszdhlh/pte-reading-analyze/issues) page
2. Create a new issue if your problem isn't already listed

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the PTE Academic community for their valuable feedback