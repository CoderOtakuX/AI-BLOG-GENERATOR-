document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('generate-form');
  const resultsDiv = document.getElementById('results');
  const loginButton = document.getElementById('google-login');
  const themeToggleButton = document.getElementById('theme-toggle');

  // Initialize theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleButton.textContent = '☀️ Light Mode';
  } else {
    themeToggleButton.textContent = '🌙 Dark Mode';
  }

  // Handle theme toggle
  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Update button text
    themeToggleButton.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });

  // Check authentication status on page load
  checkAuthStatus();

  // Handle Google login button
  loginButton.addEventListener('click', function() {
    window.location.href = '/auth/google';
  });

  // Check if user is authenticated
  async function checkAuthStatus() {
    try {
      const response = await fetch('/auth/status');
      const data = await response.json();
      
      if (data.authenticated) {
        loginButton.textContent = `Logged in as ${data.user.displayName || 'User'}`;
        loginButton.onclick = () => window.location.href = '/auth/logout';
        loginButton.style.background = '#34a853'; // Green for logged in
      } else {
        loginButton.textContent = 'Login with Google';
        loginButton.onclick = () => window.location.href = '/auth/google';
        loginButton.style.background = '#4285f4'; // Blue for login
        loginButton.disabled = false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      loginButton.disabled = false;
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    resultsDiv.innerHTML = '<em>Generating...</em>';
    const topic = document.getElementById('topic').value;
    const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim()).filter(Boolean);
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords })
      });
      const data = await res.json();
      if (data.versions) {
        resultsDiv.innerHTML = data.versions.map((v, i) => `
          <div class="version">
            <h3>Version ${i+1} ${v.passedQC ? '✅' : '❌'}</h3>
            <pre>${v.content}</pre>
            <div>QC Flags: ${v.flags && v.flags.length ? v.flags.join(', ') : 'None'}</div>
          </div>
        `).join('');
      } else {
        resultsDiv.innerHTML = '<span style="color:red">No versions returned.</span>';
      }
    } catch (err) {
      resultsDiv.innerHTML = '<span style="color:red">Error generating article.</span>';
    }
  });
});