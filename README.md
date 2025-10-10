# 🇩🇪 DeutschSprint - Offline German Learning PWA

A lightweight, mobile-first Progressive Web App for learning German (A1–A2 level) with flashcards, spaced-repetition quizzes, pronunciation (TTS), and bite-size grammar lessons.

## ✨ Features

- **📱 PWA (Progressive Web App)**: Install on your device and use offline
- **🎴 Flashcards**: German ⇄ English with flip animation
- **🎯 Spaced Repetition**: Leitner system (5 boxes) for optimal learning
- **📝 Quiz Modes**: Multiple choice and type-in with fuzzy matching
- **🔊 Pronunciation**: Web Speech API for German text-to-speech
- **📚 Content Packs**: Greetings, numbers, days, verbs, A1 basics, travel phrases
- **📖 Grammar Lessons**: Essential German grammar with examples
- **📊 Progress Tracking**: Streak counter, words learned, review statistics
- **🌙 Dark Mode**: Toggle between light and dark themes
- **♿ Accessibility**: Keyboard navigation, ARIA labels, dyslexic-friendly font option
- **💾 Local Storage**: All data stored on your device, no sign-in required

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/namitzz/geramanfication.git
cd geramanfication

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Building for Production

```bash
npm run build
npm run preview
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with localStorage persistence
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **PWA**: vite-plugin-pwa with Workbox
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## 🎯 Learning System

The app uses the **Leitner System** for spaced repetition:

- **Box 1**: Review tomorrow (new/failed cards)
- **Box 2**: Review in 3 days
- **Box 3**: Review in 1 week
- **Box 4**: Review in 2 weeks
- **Box 5**: Review in 1 month (mastered)

Correct answers move cards to higher boxes; incorrect answers reset to Box 1.

## 📚 Content

### Available Decks

1. **Greetings & Basics** - Essential German greetings and phrases
2. **Numbers 1-20** - Basic German numbers
3. **Days & Time** - Days of the week and time-related words
4. **Common Verbs** - Essential German verbs (sein, haben, gehen, etc.)
5. **A1 Basics** - Basic nouns for A1 level
6. **Travel Phrasebook** - Useful phrases for traveling in Germany

### Grammar Topics

- German Articles (der, die, das)
- Verb Conjugations (sein, haben, regular verbs)
- Basic Word Order
- Question Words

## 🔧 Configuration

### Settings

- **Dark Mode**: Toggle dark theme
- **Text-to-Speech**: Enable/disable pronunciation
- **Font Size**: Small, medium, or large
- **Dyslexic Font**: Toggle OpenDyslexic font
- **Daily Goal**: Set your daily review target (5-100 cards)

## 🚢 Deployment

The app automatically deploys to GitHub Pages when pushing to the `main` branch.

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 📱 PWA Installation

### Desktop

1. Visit the deployed app
2. Look for the install icon in the address bar
3. Click "Install"

### Mobile

1. Visit the deployed app
2. Open browser menu
3. Select "Add to Home Screen"

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- German vocabulary and grammar resources
- Web Speech API for text-to-speech
- Leitner System for spaced repetition

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for German learners**

