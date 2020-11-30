# TinyApp
TinyApp is a URL shortening service similar to TinyURL, Bitly, or Goo.gl.  
This app is a full stack web application using:
- Web Server: Node.js
- Middleware: Express
- Template Engine: EJS  

Please note this app is a project assignment from Lighthouse Labs for The Web Developer Bootcamp and only base HTML templates with bootstrap styling code were given. Creation of the server with routing, helper functions, autorization, and HTML/CSS customization were performed by this developer.
 
---
## App Highlights
- Users can Register, Login, and Logout.
- Authenticated users (via cookie session) can Add, Edit, and Delete thier shortened URLs.
- User passwords are hashed and cookies are encrypted and have an expiry time.
- Non-users can view and use shortened URLS only.

---
## Dependencies
- Node.js
- Express
- EJS
- bcrypt
- cookie-session
- method-override

---
## Getting Started
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node server.js` command.
- Open your preferred browser and go to "localhost:3000"
- Seed user data: Login Email = "email@email.com" and Password = "password".

---
## Screen Shots
!["Screenshot of Login page"](https://github.com/jmelnikel/tinyApp/blob/master/docs/login-page.png?raw=true)
!["Screenshot of URLs page"](https://github.com/jmelnikel/tinyApp/blob/master/docs/URLs%20page.png?raw=true)