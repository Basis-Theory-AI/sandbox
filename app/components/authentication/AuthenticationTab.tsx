"use client";

import { useState, useEffect } from "react";
import { APIService } from "../../services/apiService";
import { copyToClipboard } from "../../shared/utils";
import { JWTDisplayCard } from "./JWTDisplayCard";

interface AuthenticationTabProps {
  onJWTsChanged: (publicJWT: string, privateJWT: string) => void;
}

export function AuthenticationTab({ onJWTsChanged }: AuthenticationTabProps) {
  const [entityId, setEntityId] = useState("user123");
  const [publicJWT, setPublicJWT] = useState("");
  const [privateJWT, setPrivateJWT] = useState("");
  const [isCreatingPublic, setIsCreatingPublic] = useState(false);
  const [isCreatingPrivate, setIsCreatingPrivate] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);

  // auto-generate JWTs on mount
  useEffect(() => {
    const initializeJWTs = async () => {
      try {
        const [publicToken, privateToken] = await Promise.all([
          APIService.generateJWT(entityId, "public"),
          APIService.generateJWT(entityId, "private"),
        ]);

        setPublicJWT(publicToken);
        setPrivateJWT(privateToken);
        onJWTsChanged(publicToken, privateToken);
      } catch (error) {
        console.error("Failed to initialize JWTs:", error);
      }
    };

    initializeJWTs();
  }, []);

  const generateJWT = async (role: "public" | "private") => {
    const setter =
      role === "public" ? setIsCreatingPublic : setIsCreatingPrivate;
    setter(true);

    try {
      const jwt = await APIService.generateJWT(entityId, role);

      if (role === "public") {
        setPublicJWT(jwt);
        onJWTsChanged(jwt, privateJWT);
      } else if (role === "private") {
        setPrivateJWT(jwt);
        onJWTsChanged(publicJWT, jwt);
      } else {
        throw new Error(`Invalid role: ${role}`);
      }
    } catch (error) {
      console.error(`Failed to generate ${role} JWT:`, error);
    } finally {
      setter(false);
    }
  };

  // handlers for JWT cards
  const handlePublicGenerate = () => generateJWT("public");
  const handlePrivateGenerate = () => generateJWT("private");

  const handlePublicCopy = async () => {
    await copyToClipboard(publicJWT);
    setCopiedPublic(true);
    setTimeout(() => setCopiedPublic(false), 2000);
  };

  const handlePrivateCopy = async () => {
    await copyToClipboard(privateJWT);
    setCopiedPrivate(true);
    setTimeout(() => setCopiedPrivate(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Entity ID Input */}
      <div className="bg-[#0D0D0F] backdrop-blur border border-white/10 rounded-xl p-4">
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

      {/* Frontend JWT (Public Role) */}
      <JWTDisplayCard
        title="Frontend JWT (Public Role)"
        description="Used by React SDK and to Create Payment Methods"
        role="public"
        jwt={publicJWT}
        isCreating={isCreatingPublic}
        copied={copiedPublic}
        onGenerate={handlePublicGenerate}
        onCopy={handlePublicCopy}
      />

      {/* Backend JWT (Private Role) */}
      <JWTDisplayCard
        title="Backend JWT (Private Role)"
        description="Used to Create/Read Purchase Intents and Read Payment Methods"
        role="private"
        jwt={privateJWT}
        isCreating={isCreatingPrivate}
        copied={copiedPrivate}
        onGenerate={handlePrivateGenerate}
        onCopy={handlePrivateCopy}
      />
    </div>
  );
}
