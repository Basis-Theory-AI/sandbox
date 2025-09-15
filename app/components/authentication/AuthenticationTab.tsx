"use client";

import { useState, useEffect } from "react";
import { APIService } from "../../services/apiService";
import { copyToClipboard } from "../../shared/utils";
import { JWTDisplayCard } from "./JWTDisplayCard";
import { useSnackbar } from "../../hooks/useSnackbar";

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
  const { showSuccess, showError } = useSnackbar();

  const generateJWT = async (role: "public" | "private") => {
    const setter =
      role === "public" ? setIsCreatingPublic : setIsCreatingPrivate;
    setter(true);

    try {
      const jwt = await APIService.generateJWT(entityId, role);

      if (role === "public") {
        setPublicJWT(jwt);
        showSuccess("Public JWT Generated", "New public JWT created successfully.");
      } else if (role === "private") {
        setPrivateJWT(jwt);
        showSuccess("Private JWT Generated", "New private JWT created successfully.");
      } else {
        throw new Error(`Invalid role: ${role}`);
      }
    } catch (error) {
      showError("JWT Generation Failed", `Failed to generate ${role} JWT: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setter(false);
    }

    onJWTsChanged(publicJWT, privateJWT);
  };

  const refreshJWTs = async () => {
    await generateJWT("public");
    await generateJWT("private");
    onJWTsChanged(publicJWT, privateJWT);
  };

  // initialize JWTs
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
        showError("JWT Initialization Failed", error instanceof Error ? error.message : String(error));
      }
    };

    initializeJWTs();
  }, []);

  // handlers for JWT cards
  const handlePublicGenerate = () => generateJWT("public");
  const handlePrivateGenerate = () => generateJWT("private");

  const handlePublicCopy = async () => {
    await copyToClipboard(publicJWT);
    setCopiedPublic(true);
    showSuccess("Public JWT Copied", "JWT copied to clipboard.");
    setTimeout(() => setCopiedPublic(false), 2000);
  };

  const handlePrivateCopy = async () => {
    await copyToClipboard(privateJWT);
    setCopiedPrivate(true);
    showSuccess("Private JWT Copied", "JWT copied to clipboard.");
    setTimeout(() => setCopiedPrivate(false), 2000);
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-semibold text-[#f4f4f5] mb-2">
            Authentication
          </h1>
          <p className="text-base text-[#a1a1aa]">
            Manage and Create Authentication JWTs
          </p>
        </div>
        <div className="flex gap-2">
          {" "}
          <button
            onClick={refreshJWTs}
            className="px-3 h-8 bg-white/10 text-[#e4e4e7] text-sm font-medium font-sans rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 flex items-center"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Entity Configuration */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-[#0D0D0F] px-6 py-4">
            <h3 className="text-base font-semibold text-[#f4f4f5] mb-1">
              Entity Configuration
            </h3>
            <p className="text-xs text-[#a1a1aa]">
              Configure the Entity ID for JWT generation
            </p>
          </div>

          <div className="border-t border-white/10"></div>

          <div className="bg-[#0D0D0F] px-6 py-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                  Entity ID
                </label>
                <input
                  type="text"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e4e4e7] text-sm font-mono focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                  placeholder="user123"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10"></div>

          <div
            className="px-6 py-4"
            style={{ backgroundColor: "rgba(23, 23, 26, 1)" }}
          >
            <div className="flex justify-end">
              <button
                onClick={refreshJWTs}
                disabled={isCreatingPublic || isCreatingPrivate}
                className="px-3 h-8 bg-[#B5F200] text-[#131316] text-sm font-medium font-sans rounded-lg hover:bg-[#A3E600] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex items-center"
              >
                {isCreatingPublic || isCreatingPrivate
                  ? "Updating..."
                  : "Update"}
              </button>
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
    </div>
  );
}
