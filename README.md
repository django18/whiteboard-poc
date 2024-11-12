# Whiteboard POC

## Overview

The Whiteboard POC (Proof of Concept) is a simple interactive whiteboard application that supports markdown rendering and real-time updates. Users can write, append text, and annotate specific words or phrases with highlights. The application is built using React, TypeScript, and Tailwind CSS, and utilizes Framer Motion for animations.

## Features

- **Markdown Support**: Render markdown content dynamically.
- **Interactive Elements**: Users can write and append text to the whiteboard.
- **Annotations**: Highlight specific words or phrases in the text.
- **Smooth Scrolling**: Automatically scrolls to the bottom of the container when new content is added.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Markdown
- React Rough Notation

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/whiteboard-poc.git
   cd whiteboard-poc
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will start the application on `http://localhost:3000` (or another port if 3000 is in use).

### Usage

- Click on the "Write" button to start writing text on the whiteboard.
- Click on the "Append" button to add more text.
- Click on the "Annotate" button to highlight specific words or phrases in the text.
- The view will automatically scroll to the bottom as new content is added.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
