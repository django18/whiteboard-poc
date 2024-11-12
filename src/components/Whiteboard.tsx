import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Showdown from "showdown";
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
  const converter = new Showdown.Converter();

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
        const exists = annotations.some(
          (anno) => anno.pattern === pattern && anno.index === index
        );
        if (!exists) {
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
    }
  };

  const renderMarkdown = (markdown: string) => {
    let annotatedContent = markdown;

    annotations.forEach((annotation) => {
      const { pattern } = annotation;
      const regex = new RegExp(pattern, "g");
      annotatedContent = annotatedContent.replace(regex, (match) => {
        return `<span class="annotation" style="background-color: yellow;">${match}</span>`;
      });
    });

    const html = converter.makeHtml(annotatedContent);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  useEffect(() => {
    const currentContainer = containerBottomRef.current;
    if (currentContainer) {
      currentContainer.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [content]);

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
                renderMarkdown(content)
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
