const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        displayName: req.user.displayName,
        email: req.user.emails ? req.user.emails[0].value : null
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Mock content generation function for testing
function generateMockContent(topic, keywords, version) {
  const styles = [
    {
      title: "Comprehensive Guide",
      intro: `In today's rapidly evolving world, understanding ${topic} has become more crucial than ever. This comprehensive guide will explore the key aspects of ${topic}, incorporating essential concepts like ${keywords.slice(0, 2).join(' and ')}.`,
      sections: [
        `## Understanding ${topic}\n\n${topic} represents a fundamental concept that impacts various aspects of our daily lives. When we examine ${keywords[0] || 'key elements'}, we discover the interconnected nature of these systems.`,
        `## Key Benefits and Applications\n\n${keywords[1] || 'Implementation'} strategies have proven effective across multiple industries. The integration of ${keywords[2] || 'modern approaches'} with traditional methods creates powerful synergies.`,
        `## Best Practices and Implementation\n\nSuccessful ${topic} initiatives require careful planning and consideration of ${keywords.join(', ')}. Industry leaders recommend a systematic approach that addresses both technical and strategic considerations.`
      ]
    },
    {
      title: "Practical Insights",
      intro: `As professionals and enthusiasts explore ${topic}, the importance of ${keywords[0] || 'core principles'} becomes increasingly apparent. This article provides actionable insights for effective implementation.`,
      sections: [
        `## Getting Started with ${topic}\n\nBeginners should focus on understanding the fundamental principles of ${keywords[0] || 'basic concepts'}. This foundation enables more advanced exploration of ${keywords[1] || 'specialized areas'}.`,
        `## Advanced Strategies\n\nExperienced practitioners can leverage ${keywords[2] || 'advanced techniques'} to achieve superior results. The combination of ${keywords.join(' and ')} creates opportunities for innovation.`,
        `## Common Challenges and Solutions\n\nWhile implementing ${topic} strategies, teams often encounter challenges related to ${keywords.slice(-2).join(' and ')}. Addressing these issues requires both technical expertise and strategic thinking.`
      ]
    },
    {
      title: "SEO-Optimized Content",
      intro: `Discover everything you need to know about ${topic}. Our expert analysis covers ${keywords.join(', ')} and provides valuable insights for both beginners and professionals.`,
      sections: [
        `## What is ${topic}?\n\n${topic} encompasses various elements including ${keywords[0] || 'fundamental concepts'}. Understanding these components is essential for successful implementation of ${keywords[1] || 'strategic initiatives'}.`,
        `## Top ${keywords.length} Benefits of ${topic}\n\n1. Enhanced ${keywords[0] || 'efficiency'}\n2. Improved ${keywords[1] || 'performance'}\n3. Better ${keywords[2] || 'outcomes'}\n\nThese benefits make ${topic} an essential consideration for modern organizations.`,
        `## Future Trends and Predictions\n\nThe future of ${topic} will be shaped by developments in ${keywords.slice(0, 2).join(' and ')}. Staying ahead of these trends requires continuous learning and adaptation.`
      ]
    }
  ];

  const style = styles[(version - 1) % styles.length];
  return `# ${style.title}: ${topic}\n\n${style.intro}\n\n${style.sections.join('\n\n')}\n\n## Conclusion\n\nIn conclusion, ${topic} offers tremendous opportunities for those who understand its key components: ${keywords.join(', ')}. By implementing the strategies outlined in this ${style.title.toLowerCase()}, you can achieve significant improvements in your ${keywords[0] || 'objectives'}.\n\nRemember that success with ${topic} requires patience, dedication, and continuous learning. The integration of ${keywords.slice(-1)[0] || 'best practices'} with innovative approaches will position you for long-term success.`;
}

// Quality check function
function performQualityCheck(content, keywords) {
  const flags = [];
  const lowerContent = content.toLowerCase();
  
  // Check if keywords are present
  const missingKeywords = keywords.filter(keyword => 
    !lowerContent.includes(keyword.toLowerCase())
  );
  
  if (missingKeywords.length > 0) {
    flags.push(`Missing keywords: ${missingKeywords.join(', ')}`);
  }
  
  // Check minimum length
  if (content.length < 500) {
    flags.push('Content too short (less than 500 characters)');
  }
  
  // Check for basic structure
  if (!content.includes('\n') && content.length > 200) {
    flags.push('No paragraph breaks detected');
  }
  
  return {
    passedQC: flags.length === 0,
    flags: flags
  };
}

app.post("/generate", async (req, res) => {
  const { topic, keywords } = req.body;
  
  if (!topic || !keywords || keywords.length === 0) {
    return res.status(400).json({ error: "Topic and keywords are required" });
  }
  
  const versions = [];
  
  // Generate 3 different versions
  for (let i = 0; i < 3; i++) {
    const prompts = [
      `You are a professional blog writer. Write a comprehensive, well-structured blog post on the topic: "${topic}". Include these keywords naturally: ${keywords.join(", ")}. Use an engaging, informative tone with clear headings and paragraphs. Make it at least 800 words.`,
      `Create an in-depth article about "${topic}". Focus on practical insights and include these important keywords: ${keywords.join(", ")}. Write in a conversational yet professional style with actionable advice. Structure it with an introduction, main points, and conclusion.`,
      `Write a detailed, SEO-optimized blog post on "${topic}". Seamlessly incorporate these keywords: ${keywords.join(", ")}. Use compelling headlines, bullet points where appropriate, and provide valuable information to readers. Aim for comprehensive coverage of the topic.`
    ];
    
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [{ role: "user", content: prompts[i] }],
          temperature: 0.7 + (i * 0.1), // Vary temperature for different versions
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Blog Generator"
          },
        }
      );
      
      const content = response.data.choices[0].message.content;
      const qcResults = performQualityCheck(content, keywords);
      
      versions.push({
        content: content,
        passedQC: qcResults.passedQC,
        flags: qcResults.flags
      });
      
    } catch (error) {
      console.error(`API Error for version ${i + 1}:`, error?.response?.data || error.message);
      
      // Fallback: Generate mock content for testing
      const mockContent = generateMockContent(topic, keywords, i + 1);
      const qcResults = performQualityCheck(mockContent, keywords);
      
      versions.push({
        content: mockContent,
        passedQC: qcResults.passedQC,
        flags: qcResults.flags.concat(['Using mock content due to API failure'])
      });
    }
  }
  
  res.json({ versions });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
