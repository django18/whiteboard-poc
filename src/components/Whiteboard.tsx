import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RoughNotation } from "react-rough-notation";
import ReactMarkdown from "react-markdown";
import { WhiteboardCommand } from "../types";
import { getMockCommand } from "../services/mockAiService";
import ButtonPanel from "./ButtonPanel";

export default function Whiteboard() {
  const [content, setContent] = useState("");
  const [annotations, setAnnotations] = useState<
    Array<{
      pattern: string;
      index: number;
      startIndex: number;
      endIndex: number;
    }>
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerBottomRef = useRef<HTMLDivElement>(null);

  const findMatchPosition = (
    text: string,
    pattern: string,
    targetIndex: number
  ) => {
    const regex = new RegExp(pattern, "g");
    let match;
    let currentIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (currentIndex === targetIndex) {
        return {
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        };
      }
      currentIndex++;
    }
    return null;
  };

  const handleWrite = async () => {
    setIsAnimating(true);
    setAnnotations([]);

    const command: WhiteboardCommand | null = getMockCommand(0);
    if (command && command.mode === "WRITE") {
      setContent("");
      let tempContent = "";
      for (let i = 0; i < command.text.length; i++) {
        tempContent += command.text[i];
        setContent(tempContent);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
    setIsAnimating(false);
  };

  const handleAppend = async () => {
    setIsAnimating(true);

    const command: WhiteboardCommand | null = getMockCommand(1);
    if (command && command.mode === "APPEND") {
      let tempContent = content;
      for (let i = 0; i < command.text.length; i++) {
        tempContent += command.text[i];
        setContent(tempContent);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
    setIsAnimating(false);
  };

  const handleAnnotate = async () => {
    const commandIndex = annotations.length % 2; // Alternate between the two annotation commands
    const command: WhiteboardCommand | null = getMockCommand(commandIndex + 2); // Adjust index to get the correct command

    if (command && command.annotation) {
      const { pattern, index } = command.annotation;
      const position = findMatchPosition(content, pattern, index);

      if (position) {
        setAnnotations((prev) => [
          ...prev,
          {
            pattern,
            index,
            startIndex: position.startIndex,
            endIndex: position.endIndex,
          },
        ]);
      }
    }
  };

  const MarkdownWithAnnotations = ({ content }: { content: string }) => {
    const parts = [];
    let lastIndex = 0;

    annotations.forEach((anno, idx) => {
      if (lastIndex < anno.startIndex) {
        parts.push(
          <ReactMarkdown
            key={`text-${idx}`}
            components={{ p: ({ children }) => <span>{children}</span> }}
          >
            {content.substring(lastIndex, anno.startIndex)}
          </ReactMarkdown>
        );
      }

      parts.push(
        <RoughNotation
          key={`annotation-${idx}`}
          type="highlight"
          show={true}
          color="rgba(255, 225, 0, 0.3)"
          iterations={1}
          animationDuration={300}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <span style={{ margin: "0 4px" }}>{children}</span>
              ),
            }}
          >
            {content.substring(anno.startIndex, anno.endIndex)}
          </ReactMarkdown>
        </RoughNotation>
      );

      lastIndex = anno.endIndex;
    });

    if (lastIndex < content.length) {
      parts.push(
        <ReactMarkdown
          key="remaining-text"
          components={{ p: ({ children }) => <span>{children}</span> }}
        >
          {content.substring(lastIndex)}
        </ReactMarkdown>
      );
    }

    return <>{parts}</>;
  };

  useEffect(() => {
    const currentContainer = containerBottomRef.current;
    if (currentContainer) {
      // Scroll to the bottom smoothly
      currentContainer.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [content]); // Run effect when content changes

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100">
      <div className="w-full py-6 bg-white shadow-sm flex-shrink-0">
        <ButtonPanel
          isAnimating={isAnimating}
          onWrite={handleWrite}
          onAppend={handleAppend}
          onAnnotate={handleAnnotate}
        />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {content ? (
                <MarkdownWithAnnotations content={content} />
              ) : (
                <div className="text-center text-gray-500 italic">
                  Click on any of the above commands to see the whiteboard in
                  action!
                </div>
              )}
              <div ref={containerBottomRef}></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
