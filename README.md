# NotesAI - Smart Note Taking App

NotesAI is a modern note-taking application that combines the power of AI with intuitive organization tools. Create, edit, and manage your notes while leveraging AI-powered summarization to extract key insights from your content.

## Features

- **User Authentication**
  - Email and password sign-up/login
  - Google authentication
  - Secure session management

- **Note Management**
  - Create and edit notes with a rich text editor
  - Organize notes with favorites
  - Search functionality
  - Grid and list view options
  - Real-time updates

- **AI Integration**
  - Automatic note summarization
  - Smart content analysis
  - Quick insights generation

- **Modern UI/UX**
  - Responsive design for all devices
  - Light and dark mode support
  - Clean, intuitive interface
  - Smooth animations and transitions

## Tech Stack

- **Frontend**
  - Next.js 13 with App Router
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - React Query for state management
  - Lucide React icons

- **Backend**
  - Supabase for authentication and database
  - PostgreSQL with Row Level Security
  - DeepSeek API for AI summarization

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuvrajsingh833/Mini-AI-Powered-Notes-App
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_DEEPSEEK_API_KEY=your-deepseek-api-key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations from `supabase/migrations`
   - Enable Google authentication in the Supabase dashboard (optional)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── notes/          # Notes pages
│   └── auth/           # Authentication pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── notes/          # Note-related components
│   └── ui/             # UI components
├── lib/                 # Utility functions and types
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── supabase/           # Supabase configuration and migrations
```

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
