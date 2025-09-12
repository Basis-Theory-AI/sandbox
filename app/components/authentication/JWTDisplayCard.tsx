"use client";

import { decodeJWT } from "../../services/jwtService";
interface JWTDisplayCardProps {
  title: string;
  description: string;
  role: "public" | "private";
  jwt: string;
  isCreating: boolean;
  copied: boolean;
  onGenerate: () => void;
  onCopy: () => void;
}

export function JWTDisplayCard({
  title,
  description,
  role,
  jwt,
  isCreating,
  copied,
  onGenerate,
  onCopy,
}: JWTDisplayCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#f4f4f5]">{title}</h3>
          <p className="text-xs text-[#a1a1aa]">{description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGenerate}
            disabled={isCreating}
            className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create New"}
          </button>
          {jwt && (
            <button
              onClick={onCopy}
              className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>
      {jwt ? (
        <>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#bff660] overflow-hidden mb-3">
            <div className="break-all">{jwt}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#a1a1aa] max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(decodeJWT(jwt), null, 2)}
            </pre>
          </div>
        </>
      ) : (
        <div className="bg-black/30 rounded-lg p-3 text-xs text-[#a1a1aa] text-center">
          Click "Create New" to generate a {role} JWT
        </div>
      )}
    </div>
  );
}
