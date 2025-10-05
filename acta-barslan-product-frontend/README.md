# ActaBarslan - Brand Analytics Frontend

A modern, professional SaaS application for brand sentiment analysis powered by Reddit data and AI. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

-  **Brand Management**: Add, edit, and monitor brands with custom keywords
-  **Sentiment Analysis**: Real-time analysis of Reddit posts using Gemini AI
-  **Report Generation**: Comprehensive reports with charts and insights
-  **Dark Theme**: Beautiful dark mode with custom color scheme
-  **Responsive Design**: Optimized for desktop and mobile devices
-  **Real-time Updates**: Live progress tracking for analyses
-  **Professional UI**: Clean, modern interface with shadcn/ui components

## 🛠️ Tech Stack

-  **Framework**: Next.js 14 with App Router
-  **Language**: TypeScript
-  **Styling**: Tailwind CSS
-  **UI Components**: shadcn/ui
-  **State Management**: React Context API
-  **Icons**: Lucide React
-  **Font**: Montserrat

## 📁 Project Structure

```
acta-barslan-product-frontend/
├── app/                    # Next.js app router
│   ├── (pages)/           # Route pages
│   │   └── dashboard/     # Dashboard routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── modals/           # Modal components
│   └── dashboard/        # Dashboard-specific components
├── contexts/             # React contexts
├── data/                 # Mock data
├── pages/                # Page components
├── services/             # API services
├── types/                # TypeScript types
└── lib/                  # Utility functions
```

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+
-  npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd acta-barslan-product-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 UI Components

The project uses a comprehensive set of UI components:

-  **Layout**: Sidebar, Page Header, Cards
-  **Forms**: Input, Button, Select, Checkbox
-  **Feedback**: Toast, Loading, Error Boundary
-  **Data Display**: Table, Badge, Progress
-  **Navigation**: Sidebar, Breadcrumbs
-  **Overlays**: Modal, Dialog, Popover

## 🔧 Development

### Available Scripts

-  `npm run dev` - Start development server
-  `npm run build` - Build for production
-  `npm run start` - Start production server
-  `npm run lint` - Run ESLint
-  `npm run type-check` - Run TypeScript checks

### Code Style

-  ESLint configuration for code quality
-  Prettier for code formatting
-  TypeScript for type safety
-  Tailwind CSS for styling

## 🌐 API Integration

The frontend integrates with the ActaBarslan backend API:

-  **Authentication**: JWT-based auth
-  **Brands**: CRUD operations for brand management
-  **Analysis**: Sentiment analysis workflows
-  **Reports**: Report generation and management

## 🎯 Key Features

### Dashboard

-  Overview of all analytics data
-  Quick actions for common tasks
-  Recent activity feed
-  Statistics and metrics

### Brand Management

-  Add brands with custom keywords
-  Monitor brand status and sentiment
-  Edit brand settings and keywords
-  Search and filter brands

### Analysis Center

-  Start new sentiment analyses
-  Monitor analysis progress
-  View completed results
-  Manage analysis history

### Reports

-  Generate comprehensive reports
-  Download PDF reports
-  Share reports with stakeholders
-  View report history

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

-  Netlify
-  AWS Amplify
-  Railway
-  DigitalOcean App Platform

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.
