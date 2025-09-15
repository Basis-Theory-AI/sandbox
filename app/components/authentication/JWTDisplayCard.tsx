"use client";

import { decodeJWT } from "../../services/jwtService";
import { JSONDisplay } from "../shared/JSONDisplay";
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
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D0D0F] px-6 py-4">
        <h3 className="text-base font-semibold text-[#f4f4f5] mb-1">{title}</h3>
        <p className="text-xs text-[#a1a1aa]">{description}</p>
      </div>
      
      {/* Divider */}
      <div className="border-t border-white/10"></div>
      
      {/* JWT Content */}
      <div className="bg-[#0D0D0F] px-6 py-4">
        {jwt ? (
          <>
            <div className="rounded-lg py-4 px-2 font-mono text-xs text-white overflow-hidden mb-3" style={{ backgroundColor: 'rgba(23, 23, 26, 1)' }}>
              <div className="break-all">{jwt}</div>
            </div>
            <JSONDisplay data={decodeJWT(jwt)} />
          </>
        ) : (
          <div className="rounded-lg py-4 px-2 text-xs text-[#a1a1aa] text-center" style={{ backgroundColor: 'rgba(23, 23, 26, 1)' }}>
            Click "Create New" to generate a {role} JWT
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="border-t border-white/10"></div>
      
      {/* Footer */}
      <div className="px-6 py-4" style={{ backgroundColor: 'rgba(23, 23, 26, 1)' }}>
        <div className="flex justify-end gap-2">
          <button
            onClick={onGenerate}
            disabled={isCreating}
            className="px-3 h-8 bg-[#B5F200] text-[#131316] text-sm font-medium font-sans rounded-lg hover:bg-[#A3E600] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex items-center"
          >
            {isCreating ? "Creating..." : "Create New"}
          </button>
          {jwt && (
            <button
              onClick={onCopy}
              className="px-3 h-8 bg-white/10 text-[#e4e4e7] text-sm font-medium font-sans rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5 flex items-center"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
