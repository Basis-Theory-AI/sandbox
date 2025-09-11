"use client";

import React, { useState, useEffect } from "react";
import { BtAiProvider } from "@basis-theory-ai/react";
import { Playground } from "./components/Playground";
import { JWTService } from "./services/jwtService";

function Home() {
  const [initialJWT, setInitialJWT] = useState<string | null>(null);
  const [currentJWT, setCurrentJWT] = useState<string | null>(null);

  // generate initial public JWT on mount
  useEffect(() => {
    const generateInitialJWT = async () => {
      try {
        const jwt = await JWTService.generateJWT("user123", "public");
        setInitialJWT(jwt);
        setCurrentJWT(jwt);
      } catch (error) {
        throw error
      }
    };

    generateInitialJWT();
  }, []);

  // handle JWT updates from Authentication tab
  const handleJWTUpdate = (publicJWT: string) => {
    setCurrentJWT(publicJWT);
  };

  // show loading until we have an initial JWT
  if (!initialJWT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center p-8">
          <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Initializing BT AI SDK...
          </h2>
          <p className="text-[#a1a1aa] text-sm">Generating JWT</p>
        </div>
      </div>
    );
  }

  return (
    <BtAiProvider jwt={currentJWT || initialJWT} environment="local">
      <Playground initialJWT={initialJWT} onJWTUpdate={handleJWTUpdate} />
    </BtAiProvider>
  );
}

export default Home;