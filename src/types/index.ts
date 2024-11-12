export type WhiteboardMode = "WRITE" | "APPEND" | "ANNOTATE";

export interface WhiteboardCommand {
  mode: WhiteboardMode;
  text: string;
  annotation?: {
    pattern: string;
    index: number;
  };
}
