"use client";

interface AuthLoadingStateProps {
  title: string;
  message: string;
}

export function AuthLoadingState({ title, message }: AuthLoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
      <div className="text-center p-8">
        <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
          {title}
        </h2>
        <p className="text-[#a1a1aa] text-sm">{message}</p>
      </div>
    </div>
  );
}
