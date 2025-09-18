"use client";

import React, { useEffect, useState } from "react";
import { snackbarService, SnackbarItem } from "../../services/snackbarService";
import { CircleCheckIcon } from "./icons/CircleCheckIcon";
import { CircleXIcon } from "./icons/CircleXIcon";

interface SnackbarProps {
  snackbar: SnackbarItem;
  onRemove: (id: string) => void;
}

function SingleSnackbar({ snackbar, onRemove }: SnackbarProps) {
  const isSuccess = snackbar.type === "success";

  const colors = {
    success: {
      text: "rgba(110, 231, 183, 1)",
      background: "rgba(16, 185, 129, 0.1)",
    },
    error: {
      text: "rgba(253, 164, 175, 1)",
      background: "rgba(244, 63, 94, 0.1)",
    },
  };

  const currentColors = colors[snackbar.type];

  return (
    <div
      className="h-10 px-4 rounded-lg border border-white/10 flex items-center gap-3 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300"
      style={{ backgroundColor: currentColors.background }}
    >
      {/* Icon */}
      {isSuccess ? (
        <CircleCheckIcon
          className="w-4 h-4 flex-shrink-0"
          fill={currentColors.text}
        />
      ) : (
        <CircleXIcon
          className="w-4 h-4 flex-shrink-0"
          fill={currentColors.text}
        />
      )}

      {/* Content */}
      <div className="flex items-center gap-1 min-w-0 flex-1 whitespace-nowrap">
        <span
          className="text-sm font-semibold font-sans"
          style={{ color: currentColors.text }}
        >
          {snackbar.title}.
        </span>
        {snackbar.description && (
          <span
            className="text-sm font-sans"
            style={{ color: currentColors.text }}
          >
            {snackbar.description}
          </span>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(snackbar.id)}
        className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
        style={{ color: currentColors.text }}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export function SnackbarContainer() {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  useEffect(() => {
    const unsubscribe = snackbarService.subscribe(setSnackbars);
    return unsubscribe;
  }, []);

  const handleRemove = (id: string) => {
    snackbarService.remove(id);
  };

  if (snackbars.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 max-w-2xl">
      {snackbars.map((snackbar) => (
        <SingleSnackbar
          key={snackbar.id}
          snackbar={snackbar}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
