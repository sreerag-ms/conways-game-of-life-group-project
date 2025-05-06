# Getting Started with Conway's Game of Life

This guide provides step-by-step instructions for setting up and running the Conway's Game of Life application on a new machine.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop on Windows and Mac)

## Steps to Run the Application


### 1. Run with Docker (Recommended)

The application is containerized using Docker, making it easy to run on any machine without worrying about dependencies.

#### Development Mode

To start the application in development mode with hot reloading:

```bash
docker-compose up dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

#### Production Mode

To build and run the application in production mode:

```bash
docker-compose up app
```

This will serve the optimized production build at [http://localhost:8080](http://localhost:8080).

### 2. Alternative: Run Without Docker

If you prefer not to use Docker, you can run the application directly using Bun.

#### Install Bun

First, install Bun by following the instructions at [bun.sh](https://bun.sh/).

#### Install Dependencies

```bash
bun install
```

#### Development Mode

```bash
bun run dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

#### Production Build

```bash
bun run build
```

This will create a production build in the `dist` folder which you can serve using any static file server.

## Additional Information

- The application uses Vite as the build tool
- TailwindCSS is used for styling
- The simulation logic is implemented in React with WebGL for rendering large grids

## Troubleshooting

If you encounter any issues:

1. Make sure Docker is running
2. Check if ports 5173 and 8080 are available on your machine
3. Try rebuilding the Docker images with `docker-compose build`
4. For Docker permission issues on Linux, you might need to run the commands with `sudo`

## Contributing

Please refer to the README.md file for contribution guidelines.