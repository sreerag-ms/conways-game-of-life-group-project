# Implementing and Extending Conway's Game of Life as a Web Application

## Project Features
- Web-based implementation of Conway's Game of Life with modern UI
- Multiple rule sets beyond the standard Conway rules
- Pattern library with classic structures
- Real-time simulation with adjustable speed
- Data visualisation of population metrics
- Customisable grid colours and appearance


## Index

- [Implementing and Extending Conway's Game of Life as a Web Application](#implementing-and-extending-conways-game-of-life-as-a-web-application)
  - [Project Features](#project-features)
  - [Index](#index)
  - [Quick Access Options](#quick-access-options)
    - [Option 1: Access the Live Deployment](#option-1-access-the-live-deployment)
    - [Option 2: Run the Pre-built Version Locally (Without using other Node.js)](#option-2-run-the-pre-built-version-locally-without-using-other-nodejs)
  - [Development Setup](#development-setup)
    - [Using docker setup](#using-docker-setup)
      - [Prerequisites](#prerequisites)
      - [Run with Docker](#run-with-docker)
        - [Development Mode](#development-mode)
        - [Production Mode](#production-mode)
      - [Possible issues and their fixes](#possible-issues-and-their-fixes)
    - [Using local machine](#using-local-machine)
      - [System Requirements](#system-requirements)
      - [Running the Application](#running-the-application)
  - [Statement of contribution](#statement-of-contribution)
    - [Individual Contributions](#individual-contributions)
    - [Shared Contributions](#shared-contributions)

---

## Quick Access Options

### Option 1: Access the Live Deployment

**This is the recommended way to quickly evaluate the application without local setup:**

[https://gameoflife.site/](https://gameoflife.site/)

### Option 2: Run the Pre-built Version Locally (Without using other Node.js)

For the purpose of this coursework, the build folder has been included in the repository. Run all the commands from the root of the project.

1. **Using Python to serve the files:**
   ```sh
   cd ./builds
   python -m http.server 5001
   ```
   The website will be available at http://localhost:5001

## Development Setup

**Note for evaluator**

The following is the development setup instructions for the project. Proceed with this only if it is needed to test the application/make changes to the existing app and test it out.


### Using docker setup

#### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop on Windows and Mac)

#### Run with Docker 

The application is containerised using Docker, making it easy to run on any machine without worrying about dependencies. Run all the commands from the root of the project.

##### Development Mode

To start the application in development mode with hot reloading:

```bash
docker-compose up dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

##### Production Mode

To build and run the application in production mode:

```bash
docker-compose up app
```

This will serve the optimised production build at [http://localhost:8080](http://localhost:8080).

#### Possible issues and their fixes

If you encounter any issues:

1. Make sure Docker is running
2. Check if ports 5173 and 8080 are available on your machine
3. Try rebuilding the Docker images with `docker-compose build`
4. For Docker permission issues on Linux, you might need to run the commands with `sudo`

---

### Using local machine

These are the setup instructions without using Docker. Run all the commands from the root of the project. 

#### System Requirements

- **Node.js**: v18 or higher (recommended: v20 LTS). [Installation docs.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **npm**: v9 or higher (comes with Node.js)
- **bun**: Bun package manager. [Installation docs.](https://bun.sh/).
- **Modern Web Browser**: Chrome, Firefox, Edge, or Safari
- **Operating System**: Windows 10/11, macOS 12+, or Linux
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 500MB free space

#### Running the Application

1. ```sh
   bun install
   ```
   This will install all required packages defined in the package.json file, including React, Ant Design, TailwindCSS, and other dependencies

2. **Start the development server:**
   ```sh
   bun run dev
   ```
   This will start the Vite development server with hot reloading enabled.

3. **Access the application:**
   - The app will be available at [http://localhost:5173](http://localhost:5173) by default
   - If port 5173 is already in use, Vite will automatically use another port (check the terminal output)

4. **Stopping the application:**
   - Press `Ctrl+C` in the terminal to stop the development server


---

## Statement of contribution

Below, we outline the individual and shared contributions to ensure transparency and proper acknowledgement of each team member's work.

### Individual Contributions

**Sreerag Mudilikulam Sadanandan:**
- Designed and implemented the core Game of Life simulation in React, including the grid component, game logic for applying the B3/S23 rules, and UI controls (Start, Pause, Clear)
- Conducted manual testing to verify the correct behaviour of known patterns (Gliders, Blinkers)
- Drafted the methodology and results sections of the report
- Implemented the grid using WebGL
- Developed the pattern library feature

**Daniel Ferreira:**
- Built the live‐cell population visualisation using Chart.js to plot counts over generations
- Added CSV export for simulation metrics
- Implemented a colour picker for cells
- Implemented next‐generation preview for cells
- Authored the experiment and discussion sections of the report, including figures

### Shared Contributions

- Collaborated on debugging the integrated system and ensuring seamless interaction of components
- Jointly wrote the introduction, background, and conclusions, emphasising the bio‐inspired context
- Co‐authored the README, covering setup, running instructions, and sample I/O
- Performed the final review and editing of code, documentation, and report

All code in this repository is original. External resources and packages (such as React and Zustand) are properly referenced in the report. The package.json file at the repository root provides a complete list of dependencies used in the project. These packages do not directly contribute to the core simulation logic; they are standard JavaScript and React libraries supporting web development tasks such as state management and UI rendering. The main simulation logic, shared code, and user interface were developed collaboratively, with equal contributions from both authors. This project contains complete source code, along with accompanying documentation. 
