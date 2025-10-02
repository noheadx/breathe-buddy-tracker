# Peak Flow Tracker

A modern web application for tracking and monitoring respiratory health through daily peak flow measurements. Built with React, TypeScript, and Tailwind CSS.

## Overview

Peak Flow Tracker helps users monitor their respiratory health by logging peak flow readings and analyzing trends over time. The app provides visual feedback, threshold alerts, and statistical averages to help users better understand their breathing capacity.

## Features

- 📊 **Daily Readings Tracking** - Log peak flow measurements throughout the day
- 📈 **Multi-Period Averages** - View averages for Today, 5, 7, 10, 30, and 90 days
- 🔔 **Threshold Alerts** - Get notified when readings fall below your personal threshold
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 👤 **User Authentication** - Secure login and personal data management
- 🎯 **Smart Insights** - Track progress and identify patterns in your respiratory health
- ⚡ **Real-time Updates** - Instant feedback on new readings
- 🌙 **Dark Mode Support** - Comfortable viewing in any lighting condition

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn-ui components
- **Backend**: Lovable Cloud (Supabase)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Usage

### First Time Setup

1. **Create an Account**: Sign up with your email and password
2. **Set Your Threshold**: Configure your personal peak flow threshold in Settings
3. **Start Logging**: Begin recording your daily peak flow readings

### Logging Readings

1. Enter your peak flow value in the input field
2. Click "Add Reading" to save
3. The reading is automatically timestamped and saved to your account

### Viewing Statistics

- **Today's Readings**: See all measurements taken today
- **Recent Readings**: View your latest entries with date and time
- **Average Tiles**: Monitor trends across different time periods
  - Averages only appear once sufficient data is collected
  - Each tile shows remaining days needed for calculation

### Managing Settings

Click the Settings icon to:
- Adjust your threshold value
- Configure alert preferences

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── PeakFlowEntry.tsx
│   ├── RecentReadings.tsx
│   ├── AverageDisplay.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   └── usePeakFlowData.ts
├── pages/              # Page components
│   ├── Index.tsx       # Main dashboard
│   ├── Auth.tsx        # Authentication page
│   └── NotFound.tsx
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── integrations/       # Third-party integrations
    └── supabase/       # Supabase client configuration
```

## Database Schema

The app uses three main tables:

- **peak_flow_entries**: Stores individual readings with timestamp and value
- **user_settings**: Manages user preferences and threshold values
- **profiles**: Contains user profile information

All tables are protected with Row-Level Security (RLS) policies to ensure data privacy.

## Contributing

This project was built with [Lovable](https://lovable.dev), an AI-powered development platform. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Running as a Mobile App (iOS/Android)

This app is configured to run as a native mobile application using Capacitor.

### Prerequisites for Mobile Development

- **For iOS**: macOS with Xcode installed
- **For Android**: Android Studio installed
- Git access to the repository

### Mobile Setup Instructions

1. **Export and Clone the Repository**
   - Click "Export to Github" in Lovable to transfer the project
   - Clone the repository to your local machine:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Native Platforms**
   
   For iOS:
   ```bash
   npx cap add ios
   ```
   
   For Android:
   ```bash
   npx cap add android
   ```

4. **Update Native Platform Dependencies**
   
   For iOS:
   ```bash
   npx cap update ios
   ```
   
   For Android:
   ```bash
   npx cap update android
   ```

5. **Build the Project**
   ```bash
   npm run build
   ```

6. **Sync with Native Platforms**
   ```bash
   npx cap sync
   ```
   
   ⚠️ **Important**: Run `npx cap sync` after every `git pull` to keep native platforms in sync

7. **Run on Device/Emulator**
   
   For iOS:
   ```bash
   npx cap run ios
   ```
   
   For Android:
   ```bash
   npx cap run android
   ```

### Hot Reload During Development

The app is configured for hot reload from the Lovable sandbox. You can develop in Lovable and test changes instantly on your mobile device without rebuilding.

### Learn More

For detailed guidance on mobile development, running on physical devices, and native capabilities, read our comprehensive guide:
[Mobile Development with Lovable](https://lovable.dev/blogs/TODO)

## Web Deployment

The easiest way to deploy this application as a web app is through Lovable:

1. Visit your [Lovable project](https://lovable.dev/projects/5bdd19a6-2450-429e-9258-8b968c43ad4d)
2. Click "Share" → "Publish"
3. Your app will be deployed automatically

Alternatively, you can deploy to any platform that supports static sites (Vercel, Netlify, etc.).

## Support

For questions or issues, please open an issue in the GitHub repository.

## License

This project is built for personal health tracking. Please consult with healthcare professionals for medical advice.

---

**Note**: Peak flow measurements should be used as part of a comprehensive asthma or respiratory health management plan under medical supervision. This app is a tracking tool and does not provide medical advice.