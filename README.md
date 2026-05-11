# Online Bookstore  https://v0-online-bookstore-eight-indol.vercel.app/

A simple full-stack online bookstore built with Spring Boot (Java) and Vanilla HTML/CSS/JS.

## Features
- **Homepage:** Browse a curated list of books.
- **Search:** Find books by title or author.
- **Details:** View book descriptions and add them to your cart.
- **Cart:** Manage your cart items and see the total price.
- **Checkout:** Complete your order with a simple confirmation.
- **Modern UI:** Responsive, aesthetically pleasing design using raw CSS.

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Java 17, Spring Boot, Spring Web MVC
- **Database:** H2 In-Memory Database (JDBC)

## Setup and Run Locally

1. **Prerequisites:**
   - Java Development Kit (JDK) 17 or higher installed.
   - Maven installed (optional, you can use the included wrapper).

2. **Run the Application:**
   Navigate to the project root directory in your terminal and run:
   ```bash
   mvnw spring-boot:run
   ```
   *If you are on Windows and the wrapper isn't working, try: `mvn spring-boot:run`*

3. **Access the App:**
   Open your web browser and go to:
   ```
   http://localhost:8080
   ```

## API Endpoints
- `GET /books` - Fetch all available books.
- `GET /books/:id` - Fetch details for a specific book.
- `GET /cart` - View items currently in the cart.
- `POST /cart` - Add a book to the cart.
- `DELETE /cart/:id` - Remove a specific item from the cart.
- `POST /checkout` - Place the order and clear the cart.

## Uploading to GitHub

1. Initialize a git repository in the root folder:
   ```bash
   git init
   ```
2. Add all files to staging:
   ```bash
   git add .
   ```
3. Commit the changes:
   ```bash
   git commit -m "Initial commit: Online Bookstore project"
   ```
4. Create a new empty repository on your GitHub account.
5. Link your local repository to the GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   ```
6. Push your code:
   ```bash
   git branch -M main
   git push -u origin main
   ```
