import React from "react";

interface JSONDisplayProps {
  data: any;
  className?: string;
}

export function JSONDisplay({ data, className = "" }: JSONDisplayProps) {
  const renderObject = (obj: any, indent: number = 0): React.ReactNode => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return (
          <span>
            <span style={{ color: "white" }}>[</span>
            {obj.map((item, index) => (
              <span key={index}>
                {renderObject(item, indent)}
                {index < obj.length - 1 && (
                  <span style={{ color: "white" }}>,</span>
                )}
              </span>
            ))}
            <span style={{ color: "white" }}>]</span>
          </span>
        );
      } else {
        const entries = Object.entries(obj);
        return (
          <span>
            <span style={{ color: "white" }}>{"{"}</span>
            {entries.map(([key, value], index) => (
              <div key={key} style={{ marginLeft: `${(indent + 1) * 16}px` }}>
                <span style={{ color: "rgba(0, 232, 198, 1)" }}>"{key}"</span>
                <span style={{ color: "white" }}>: </span>
                {renderObject(value, indent + 1)}
                {index < entries.length - 1 && (
                  <span style={{ color: "white" }}>,</span>
                )}
              </div>
            ))}
            <div style={{ marginLeft: `${indent * 16}px` }}>
              <span style={{ color: "white" }}>{"}"}</span>
            </div>
          </span>
        );
      }
    } else if (typeof obj === "string") {
      return <span style={{ color: "rgba(150, 224, 114, 1)" }}>"{obj}"</span>;
    } else {
      return (
        <span style={{ color: "rgba(150, 224, 114, 1)" }}>
          {JSON.stringify(obj)}
        </span>
      );
    }
  };

  return (
    <div
      className={`rounded-lg py-4 px-2 ${className}`}
      style={{ backgroundColor: "rgba(23, 23, 26, 1)" }}
    >
      <div
        className="text-xs whitespace-pre-wrap"
        style={{ fontFamily: "'Chivo Mono', monospace", fontWeight: 500 }}
      >
        {renderObject(data)}
      </div>
    </div>
  );
}
