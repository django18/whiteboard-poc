import { WhiteboardCommand } from "../types";

const mockCommands: WhiteboardCommand[] = [
  {
    mode: "WRITE",
    text: `# Welcome to the AI Whiteboard

This is a simple whiteboard that supports markdown rendering. Click the buttons above to see it in action!`,
  },
  {
    mode: "APPEND",
    text: `

## Features
- **Markdown Support**
- *Interactive Elements*
- Real-time updates`,
  },
  {
    mode: "ANNOTATE",
    text: "whiteboard",
    annotation: {
      pattern: "whiteboard",
      index: 0, // Will highlight the first occurrence of "whiteboard"
    },
  },
  {
    mode: "ANNOTATE",
    text: "markdown",
    annotation: {
      pattern: "markdown",
      index: 0, // Will highlight the first occurrence of "markdown"
    },
  },
];

export const getMockCommand = (index: number): WhiteboardCommand | null => {
  return mockCommands[index] || null;
};

export default {
  getMockCommand,
};
