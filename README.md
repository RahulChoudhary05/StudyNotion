***StudyNotion - EdTech Platform 🚀***
**Check out our website**
StudyNotion is a comprehensive EdTech platform built with the MERN stack (ReactJS, NodeJS, MongoDB, ExpressJS). It allows users to create, consume, and rate educational content.

**Table of Contents**
1. Introduction
2. System Architecture
   a. Front-end
   b. Back-end
   c. Database
3. Architecture Diagram
4. API Design
5. Installation
6. Configuration
7. Usage

**Introduction**
StudyNotion offers an interactive learning experience for students and a platform for instructors to share their knowledge globally. We'll cover the platform's architecture, API design, installation, usage, and future enhancements.

**System Architecture**
StudyNotion has three main components: the front-end, back-end, and database. It follows a client-server architecture, with the front-end acting as the client and the back-end and database as the server.

**Front-end**
The front-end, built with ReactJS, provides dynamic and responsive user interfaces. It communicates with the back-end via RESTful API calls.

**Front-end Pages**

For Students:
a. Homepage
b. Course List
c. Wishlist
d. Cart Checkout
e. Course Content
f. User Details
g. User Edit Details

For Instructors:
a. Dashboard
b. Insights
c. Course Management Pages
d. Profile Details

**Back-end**
The back-end, built with NodeJS and ExpressJS, provides APIs for user authentication, course management, and media handling.

Features:
a. User Authentication
b. Course Management
c. Payment Integration
d. Cloud-based Media
e. Markdown Formatting

**Database**
StudyNotion uses MongoDB to store course content and user data, providing flexibility and scalability.

**API Design**
StudyNotion's API follows REST principles, using JSON for data exchange and standard HTTP methods (GET, POST, PUT, DELETE). Refer to the API Documentation for detailed endpoints.

**Installation**
a. Clone the repository.
b. Navigate to the frontend folder and run `npm install`.
c. Start the frontend server on port `3000`: `npm start`.
d. Navigate to the backend folder and run `npm install`.
e. Start the backend server on port `4000`: `npm start`.
