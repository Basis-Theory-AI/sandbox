"use client";

import React, { useState, useEffect } from "react";
import { JWTService } from "../../services/jwtService";

interface AuthenticationTabProps {
  defaultJWT: string;
  onJWTUpdate?: (publicJWT: string, privateJWT: string) => void;
}

export function AuthenticationTab({
  defaultJWT,
  onJWTUpdate,
}: AuthenticationTabProps) {
  const [frontendJWT, setFrontendJWT] = useState(defaultJWT);
  const [backendJWT, setBackendJWT] = useState("");
  const [entityId, setEntityId] = useState("user123");
  const [isCreatingFrontend, setIsCreatingFrontend] = useState(false);
  const [isCreatingBackend, setIsCreatingBackend] = useState(false);
  const [copiedFrontend, setCopiedFrontend] = useState(false);
  const [copiedBackend, setCopiedBackend] = useState(false);
  const [isLoadingBackendJWT, setIsLoadingBackendJWT] = useState(true);

  // Initialize with default JWTs
  useEffect(() => {
    setFrontendJWT(defaultJWT);
  }, [defaultJWT]);

  // Fetch the existing backend JWT
  useEffect(() => {
    const fetchBackendJWT = async () => {
      try {
        const jwt = await JWTService.getBackendJWT();
        setBackendJWT(jwt);
        // Notify parent when backend JWT is loaded
        if (onJWTUpdate && frontendJWT) {
          onJWTUpdate(frontendJWT, jwt);
        }
      } catch (error) {
        // Error handling - could show toast notification
      } finally {
        setIsLoadingBackendJWT(false);
      }
    };

    fetchBackendJWT();
  }, []);

  const createJWT = async (roles: string[], isBackend = false) => {
    const setter = isBackend ? setIsCreatingBackend : setIsCreatingFrontend;
    setter(true);

    try {
      let jwt: string;
      
      if (isBackend) {
        jwt = await JWTService.getBackendJWT();
        setBackendJWT(jwt);
        // Notify parent of JWT updates (backend JWT has private role)
        if (onJWTUpdate && frontendJWT) {
          onJWTUpdate(frontendJWT, jwt);
        }
      } else {
        jwt = await JWTService.createJWT({
          userId: entityId,
          roles: roles,
        });
        setFrontendJWT(jwt);
        // Notify parent of JWT updates (frontend JWT has public role)
        if (onJWTUpdate && backendJWT) {
          onJWTUpdate(jwt, backendJWT);
        }
      }
    } catch (error) {
      // Error handling - could show toast notification
    } finally {
      setter(false);
    }
  };

  const handleCopy = async (jwt: string, isBackend = false) => {
    await JWTService.copyToClipboard(jwt);
    if (isBackend) {
      setCopiedBackend(true);
      setTimeout(() => setCopiedBackend(false), 2000);
    } else {
      setCopiedFrontend(true);
      setTimeout(() => setCopiedFrontend(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Entity ID Input */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-3">
          Entity Configuration
        </h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
              Entity ID
            </label>
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e4e4e7] text-sm font-mono focus:outline-none focus:border-[#bff660] focus:bg-white/8"
              placeholder="user123"
            />
          </div>
        </div>
      </div>

      {/* Frontend JWT */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5]">
              Frontend JWT (Public Role)
            </h3>
            <p className="text-xs text-[#a1a1aa]">
              Used by React SDK and to Create Payment Methods
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createJWT(["public"])}
              disabled={isCreatingFrontend}
              className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isCreatingFrontend ? "Creating..." : "Create New"}
            </button>
            <button
              onClick={() => handleCopy(frontendJWT)}
              className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              {copiedFrontend ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
        {frontendJWT && (
          <>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#bff660] overflow-hidden mb-3">
              <div className="break-all">{frontendJWT}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#a1a1aa] max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(JWTService.decodeJWT(frontendJWT), null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Backend JWT */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5]">
              Backend JWT (Private Role)
            </h3>
            <p className="text-xs text-[#a1a1aa]">
              Used to Create/Fetch Purchase Intents and Fetch Payment Methods
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createJWT(["private"], true)}
              disabled={isCreatingBackend}
              className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isCreatingBackend ? "Refreshing..." : "Refresh"}
            </button>
            {backendJWT && (
              <button
                onClick={() => handleCopy(backendJWT, true)}
                className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
              >
                {copiedBackend ? "✓ Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>
        {isLoadingBackendJWT ? (
          <div className="bg-black/30 rounded-lg p-3 text-xs text-[#a1a1aa] text-center flex items-center justify-center gap-2">
            <div className="w-3 h-3 border border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin"></div>
            Loading backend JWT...
          </div>
        ) : backendJWT ? (
          <>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#bff660] overflow-hidden mb-3">
              <div className="break-all">{backendJWT}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#a1a1aa] max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(JWTService.decodeJWT(backendJWT), null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <div className="bg-black/30 rounded-lg p-3 text-xs text-[#a1a1aa] text-center">
            Failed to load backend JWT
          </div>
        )}
      </div>
    </div>
  );
}
