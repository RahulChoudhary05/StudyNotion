StudyNotion - EdTech Platform
🚀 Check out our website

Overview
StudyNotion is a comprehensive EdTech platform built with the MERN stack (ReactJS, NodeJS, MongoDB, ExpressJS). It allows users to create, consume, and rate educational content.

Table of Contents
Introduction
System Architecture
Front-end
Back-end
Database
Architecture Diagram
API Design
Installation
Configuration
Usage
Introduction
StudyNotion offers an interactive learning experience for students and a platform for instructors to share their knowledge globally. We'll cover the platform's architecture, API design, installation, usage, and future enhancements.

System Architecture
StudyNotion has three main components: the front-end, back-end, and database. It follows a client-server architecture, with the front-end acting as the client and the back-end and database as the server.

Front-end
The front-end, built with ReactJS, provides dynamic and responsive user interfaces. It communicates with the back-end via RESTful API calls.

Front-end Pages
For Students:
Homepage: Introduction with links to course lists and user details.
Course List: Browse available courses with descriptions and ratings.
Wishlist: View courses added to the wishlist.
Cart Checkout: Complete course purchases.
Course Content: Access course materials, including videos.
User Details: View account details like name and email.
User Edit Details: Edit account information.
For Instructors:
Dashboard: Overview of courses, ratings, and feedback.
Insights: Detailed metrics on course performance.
Course Management Pages: Create, update, and delete courses.
Profile Details: View and edit account information.
Tools and Libraries
ReactJS: For building user interfaces.
CSS & Tailwind: For styling.
Redux: For state management.
Back-end
The back-end, built with NodeJS and ExpressJS, provides APIs for user authentication, course management, and media handling.

Features
User Authentication: Sign up, log in, OTP verification, and password reset.
Course Management: Create, read, update, and delete courses.
Payment Integration: Razorpay for handling payments.
Cloud-based Media: Cloudinary for storing media content.
Markdown Formatting: For easy content rendering.
Frameworks and Tools
Node.js: Main back-end framework.
Express.js: Web application framework.
MongoDB: NoSQL database.
JWT: For secure authentication.
Bcrypt: For password hashing.
Mongoose: ODM library for MongoDB.
Database
StudyNotion uses MongoDB to store course content and user data, providing flexibility and scalability.

Data Models
Student Schema: Includes fields for name, email, password, and courses.
Instructor Schema: Includes fields for name, email, password, and courses.
Course Schema: Includes fields for course name, description, instructor details, and media.
Architecture Diagram
[Architecture Diagram Placeholder]

API Design
StudyNotion's API follows REST principles, using JSON for data exchange and standard HTTP methods (GET, POST, PUT, DELETE). Refer to the API Documentation for detailed endpoints.