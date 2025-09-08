RAJA GIFTS — Local developer bundle
Files included:
  - server.js (Express backend)
  - products.json (data file)
  - public/index.html (frontend adapted from your blueprint)
  - public/admin.html (simple admin UI to add/edit/delete products)
  - package.json

Recommended steps (PowerShell) — run as normal user (not necessarily admin):

# 1) Put files where you like, e.g. C:\Users\ankit\Documents\raja-gifts
# If you downloaded the ZIP and extracted, open PowerShell and run:

Set-Location "C:\Users\ankit\Documents\raja-gifts"

# 2) Check Node.js is installed:
node -v
npm -v

# If Node is NOT installed, install Node LTS with winget (requires Windows 10/11 + winget):
# Run PowerShell as Administrator for installation:
winget install --id OpenJS.NodeJS.LTS -e

# Alternative with Chocolatey (if you have it):
# choco install nodejs-lts -y

# 3) Install dependencies (in project root)
npm install

# 4) Start server
npm start

# 5) Open site in browser:
# Frontend: http://localhost:3000/
# Admin UI: http://localhost:3000/admin.html

# OPTIONAL: during development use nodemon:
npm run dev

# If you prefer to create files from scratch using PowerShell here-strings, you can copy the server.js and HTML contents from the project files; but downloading the ready ZIP is much simpler.

Security note:
- Admin UI is not protected. For production, add authentication or don't expose the server to the public internet.
- The products are stored in products.json — a simple, portable approach so you can edit the file manually or via the admin UI.

If you want, I can:
- Add simple password protection for /admin.html,
- Switch storage to SQLite,
- Deploy to a free host (Render/Heroku/Vercel) and show commands.

