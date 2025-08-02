# 🤖 AI Blog Generator

A powerful AI-powered blog generator that creates high-quality, SEO-optimized content using DeepSeek AI through OpenRouter. Features Google OAuth authentication, multiple content versions, and built-in quality control.

## ✨ Features

- 🧠 **AI-Powered Content Generation**: Uses DeepSeek AI model for high-quality blog posts
- 🔐 **Google OAuth Authentication**: Secure user authentication with Google
- 📊 **Multiple Content Versions**: Generates 3 different versions of each blog post
- ✅ **Quality Control System**: Automatic keyword validation and content quality checks
- 🎨 **Modern UI**: Clean, responsive interface with real-time generation status
- 🚀 **Fast & Reliable**: Built with Express.js for optimal performance

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI Integration**: OpenRouter API (DeepSeek model)
- **Authentication**: Passport.js with Google OAuth 2.0
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Session Management**: Express Session

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Google OAuth credentials
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoderOtakuX/AI-BLOG-GENERATOR-.git
   cd AI-BLOG-GENERATOR-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   DEEPSEEK_API_KEY=your_openrouter_api_key
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

### OpenRouter API Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add credits to your account or use free tier models

## 📖 Usage

1. **Login**: Click "Login with Google" to authenticate
2. **Enter Topic**: Provide a blog topic in the input field
3. **Add Keywords**: Enter comma-separated keywords
4. **Generate**: Click "Generate Article" to create content
5. **Review**: Check the generated versions with quality control flags

## 🏗️ Project Structure

```
AI-BLOG-GENERATOR/
├── public/
│   ├── index.html      # Main HTML file
│   ├── main.js         # Frontend JavaScript
│   └── style.css       # Styling
├── server.js           # Main server file
├── llm-service.js      # AI service integration
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not in repo)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔒 Security Features

- Environment variables for sensitive data
- Secure session management
- OAuth 2.0 authentication
- Input validation and sanitization
- Rate limiting protection

## 🚀 Deployment

This application can be deployed to various platforms:

- **Heroku**: Easy deployment with automatic builds
- **Vercel**: Serverless deployment with GitHub integration
- **Railway**: Simple deployment with environment variable support
- **Render**: Free tier available with automatic deployments

## 📊 Quality Control

The system includes automatic quality checks:

- ✅ Keyword inclusion validation
- ✅ Content length verification
- ✅ Structure analysis (headings, paragraphs)
- ✅ Readability assessment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DeepSeek AI for powerful language models
- OpenRouter for AI model access
- Google for OAuth services
- The open-source community

## 📞 Support

If you encounter any issues or have questions:

1. Check existing [GitHub Issues](https://github.com/CoderOtakuX/AI-BLOG-GENERATOR-/issues)
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Made with ❤️ by [CoderOtakuX](https://github.com/CoderOtakuX)**
