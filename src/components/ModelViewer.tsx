// components/ModelViewer.tsx
import { useEffect, useRef } from "react";

// Declare model-viewer as a custom JSX element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          "camera-orbit"?: string;
          exposure?: string;
          ar?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

interface ModelViewerProps {
  modelUrl: string;
  tshirtUrl?: string;   // optional separate shirt GLB
}

export default function ModelViewer({ modelUrl, tshirtUrl }: ModelViewerProps) {
  // Inject model-viewer script once
  useEffect(() => {
    if (document.querySelector('script[data-mv]')) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.setAttribute("data-mv", "1");
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden bg-gradient-to-b from-primary/5 to-secondary/5">
      {/* model-viewer only accepts ONE src — so you combine them server-side */}
      <model-viewer
        key={modelUrl}
        src={modelUrl}
        alt="3D body and outfit preview"
        camera-controls
        auto-rotate
        shadow-intensity="1.2"
        exposure="0.9"
        camera-orbit="0deg 75deg 2.5m"
        style={{ width: "100%", height: "100%", minHeight: "400px", background: "transparent" }}
      />
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <span className="text-xs text-muted-foreground bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full">
          Drag to rotate · Scroll to zoom
        </span>
      </div>
    </div>
  );
}