"use client";

import { JWTStatus } from "../JWTStatus";

interface AuthErrorStateProps {
  error: string;
  jwtHook: any;
}

export function AuthErrorState({ error, jwtHook }: AuthErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
      <div className="text-center p-8 bg-white/5 backdrop-blur rounded-xl border border-white/10 max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
          Authentication Error
        </h2>
        <p className="text-[#a1a1aa] mb-4 text-sm">{error}</p>
        <JWTStatus {...jwtHook} onRefresh={jwtHook.refreshJWT} />
      </div>
    </div>
  );
}
