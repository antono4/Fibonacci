# OpenHands Clone

🚀 A powerful, web-based AI coding assistant interface inspired by OpenHands. Built with Next.js, React, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 💬 AI Chat Interface
- Real-time messaging with AI agent
- Message types: thoughts, actions, and text responses
- Agent status indicators (running/stopped)
- Auto-scroll to latest messages

### 🖥️ Terminal Emulator
- Multiple terminal sessions
- Command history (up/down arrows)
- Common commands: `ls`, `cat`, `python`, `echo`, `pwd`, `cd`, `clear`, `help`

### 📝 Code Editor
- Monaco Editor (VS Code engine)
- Syntax highlighting for 20+ languages
- File explorer sidebar
- Multiple file tabs
- Auto-save functionality

### 🌐 Browser Preview
- URL navigation bar
- Tab-based browsing
- Refresh, back, forward navigation

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send message |
| `Ctrl+1` | Switch to Terminal |
| `Ctrl+2` | Switch to Editor |
| `Ctrl+3` | Switch to Browser |
| `Ctrl+K` | Open Settings |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/antono4/Fibonacci.git
cd Fibonacci/openhands-clone

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
openhands-clone/
├── index.html              # Landing page
├── package.json            # Dependencies
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   │   ├── LeftPanel/      # Chat interface
│   │   ├── Workspace/       # Terminal, Editor, Browser
│   │   └── shared/          # Common components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anton** - [@antono4](https://github.com/antono4)

---

⭐ Star this repo if you find it helpful!
