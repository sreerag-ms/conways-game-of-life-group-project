# Implementing and Extending Conway's Game of Life as a Web Application


## Project Features

- Web-based implementation of Conway's Game of Life with modern UI
- Multiple rule sets beyond the standard Conway rules
- Pattern library with classic structures
- Real-time simulation with adjustable speed
- Data visualization of population metrics
- Customizable grid colors and appearance
- Responsive design that works on various screen sizes


## Index

- [Implementing and Extending Conway's Game of Life as a Web Application](#implementing-and-extending-conways-game-of-life-as-a-web-application)
  - [Project Features](#project-features)
  - [Index](#index)
  - [Quick Access Options](#quick-access-options)
    - [Option 1: Access the Live Deployment](#option-1-access-the-live-deployment)
    - [Option 2: Run the Pre-built Version Locally](#option-2-run-the-pre-built-version-locally)
  - [Development Setup](#development-setup)
    - [Using local machine](#using-local-machine)
      - [System Requirements](#system-requirements)
      - [Installation Steps](#installation-steps)
      - [Running the Application](#running-the-application)
    - [Using docker setup](#using-docker-setup)

---

## Quick Access Options

### Option 1: Access the Live Deployment

**This is the recommended way to quickly evaluate the application without local setup:**

[https://gameoflife.site/](https://gameoflife.site/)

### Option 2: Run the Pre-built Version Locally

For the purpose of this coursework, the build folder has been included in the repository.

1. **Using Python to serve the files:**
   ```sh
   cd ./dist
   python -m http.server 5001
   ```
   The website will be available at http://localhost:5001

2. **Using npm (if Node.js is installed):**
   ```sh
   npm run preview
   ```
   This will serve the contents of the `dist` folder at http://localhost:4173

---

## Development Setup

**Note for evaluator**
The following is the development setup instructions for the project. Proceed with this only if it  is needed to test the applicaiton/make changes to the existing app and test it out.

### Using local machine
#### System Requirements

- **Node.js**: v18 or higher (recommended: v20 LTS)
- **npm**: v9 or higher (comes with Node.js)
- **Modern Web Browser**: Chrome (v120+), Firefox (v120+), Edge (v120+), or Safari (v17+)
- **Operating System**: Windows 10/11, macOS 12+, or Linux
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 500MB free space

#### Installation Steps

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd conways-game-of-life-group-project
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   This will install all required packages defined in the package.json file, including React, Ant Design, TailwindCSS, and other dependencies.

#### Running the Application

1. **Start the development server:**
   ```sh
   npm run dev
   ```
   This will start the Vite development server with hot reloading enabled.

2. **Access the application:**
   - The app will be available at [http://localhost:5173](http://localhost:5173) by default
   - If port 5173 is already in use, Vite will automatically use another port (check the terminal output)

3. **Stopping the application:**
   - Press `Ctrl+C` in the terminal to stop the development server

4. **Running the linter:**
   ```sh
   npm run lint
   ```
   This will check your code for any formatting or style issues according to the project's ESLint configuration.


### Using docker setup
