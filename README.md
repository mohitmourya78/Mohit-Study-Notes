LIVE PREVIEW:-

https://mohit-study-notes-1.onrender.com/

This web application is built using Node.js with Express and is designed for managing user registrations, logins, and services through a clean interface. It employs JWT (JSON Web Tokens) for user authentication and utilizes Handlebars as the templating engine for rendering views.

Key Features:

Service Fetching
The application fetches services from a MongoDB database using Mongoose. The / and /home routes display these services.

Handlebars Templating:
Handlebars is used as the view engine to render dynamic HTML pages

A contact form allows users to submit their inquiries. Input is validated, and upon successful submission, the data is stored in the database.

Custom error pages are displayed for unhandled routes or server errors, improving user experience.
Registration: User inputs their name, email, and password. The application validates this data and checks for duplicate emailsand validates input using express-validator.. If valid, the user is saved to the database and redirected to the login page.

Login: Upon entering valid credentials, the user is authenticated. A JWT is generated and stored in a cookie. The user is then redirected to the home page where services are displayed. Passwords are hashed using bcrypt for security.

Logout: Users can log out, which clears the JWT cookie and redirects them to the home page.

JWT Authentication:
JWT is used to securely authenticate users. Upon logging in, a token is generated and sent as a cookie. This token is validated for protected routes, ensuring only authenticated users can access certain pages.
If no token is found, the user is redirected to the login page with an alert parameter, indicating that authentication is required.
If the token is expired, it clears the expired token cookie and redirects the user to the home page with an alert parameter.

yes thats all about my project hope you like it appriciate it.
Thanks!!

