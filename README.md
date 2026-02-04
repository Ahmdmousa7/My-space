# Ahmed Mo Space 🚀

A modern, AI-powered personal workspace for organizing your tasks, links, sheets, and notes. Built with React, TypeScript, and Vite.

## ✨ Features

### 📋 Task Management
- Create, edit, and delete tasks
- Priority levels (Low, Medium, High)
- Due dates and recurring tasks (daily, weekly, monthly)
- Color coding for better organization
- Advanced filtering and sorting
- Search functionality

### 🤖 Smart Capture (AI-Powered)
- Paste unstructured text and let AI organize it
- Automatically categorizes into tasks, links, sheets, and notes
- Powered by Google Gemini AI
- Intelligent URL detection and categorization

### 🔗 Link Library
- Save and organize important links
- Category-based organization
- Quick search and filtering
- One-click access to saved resources

### 📊 Google Sheets Integration
- Quick access to your spreadsheets
- Recent sheets dashboard
- Direct links to your documents

### 📝 Sticky Notes
- Create colorful sticky notes
- 5 color themes (Yellow, Blue, Green, Red, Purple)
- Drag and position notes (coming soon)
- Perfect for quick thoughts and reminders

### 💾 Data Persistence
- All data saved locally using localStorage
- Works offline
- No account required
- Privacy-focused (your data stays on your device)

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmdmousa7/My-space.git
   cd My-space
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build locally:
```bash
npm run preview
```

## 🌐 Live Demo

Visit the live app: [https://ahmdmousa7.github.io/My-space/](https://ahmdmousa7.github.io/My-space/)

## 📖 Usage

### Smart Capture

1. Click on "Smart Capture" in the sidebar
2. Paste or type unstructured text, for example:
   ```
   Call John tomorrow at 5pm
   https://github.com/awesome-project
   https://docs.google.com/spreadsheets/d/abc123
   Remember to buy milk
   Great idea: a dog walker uber app
   ```
3. Click "Organize"
4. The AI will automatically:
   - Create tasks from actionable items
   - Save URLs as links
   - Detect Google Sheets
   - Create sticky notes for ideas

### Task Management

- **Add Task**: Type in the input field and press Enter or click "Add"
- **Set Priority**: Choose Low, Medium, or High
- **Add Due Date**: Click the date picker
- **Make Recurring**: Select daily, weekly, or monthly
- **Color Code**: Choose a color to categorize tasks
- **Edit Task**: Click the pencil icon
- **Complete Task**: Click the checkbox
- **Delete Task**: Click the trash icon

### Organizing Links

- **Add Link**: Click "Add Link" and enter URL, title, and category
- **Search**: Use the search bar to find links quickly
- **Open Link**: Click "Open" to visit the link in a new tab
- **Delete Link**: Click the trash icon

## 🔒 Privacy & Data

- **All data is stored locally** in your browser using localStorage
- **No server-side storage** - your data never leaves your device
- **API Key Security**: Your Gemini API key is only used for Smart Capture feature
- **Offline Capable**: Works without internet (except Smart Capture)

### Data Backup

Since data is stored locally, it's recommended to:
1. Regularly export your data (feature coming soon)
2. Avoid clearing browser cache if you want to keep your data
3. Use the same browser and device for consistency

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ahmed Mo**

- GitHub: [@Ahmdmousa7](https://github.com/Ahmdmousa7)

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Lucide for beautiful icons
- Tailwind CSS for styling utilities
- The React and Vite teams

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Made with ❤️ by Ahmed Mo
