"use client";

import React, { useState, useEffect } from "react";
import { BtAiProvider } from "@basis-theory-ai/react";
import { Playground } from "./components/Playground";
import { APIService } from "./services/apiService";

function Home() {
  const [initialJWT, setInitialJWT] = useState<string | null>(null);

  // generate initial public JWT on mount
  useEffect(() => {
    const generateInitialJWT = async () => {
      try {
        const jwt = await APIService.generateJWT("user123", "public");
        setInitialJWT(jwt);
      } catch (error) {
        throw error;
      }
    };

    generateInitialJWT();
  }, []);

  // show loading until we have an initial JWT
  if (!initialJWT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050506] text-[#f4f4f5] font-sans">
        <div className="text-center p-8">
          <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#B5F200] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Initializing BT AI SDK...
          </h2>
          <p className="text-[#a1a1aa] text-sm">Generating JWT</p>
        </div>
      </div>
    );
  }

  return (
    <BtAiProvider jwt={initialJWT} environment="production">
      <Playground initialJWT={initialJWT} />
    </BtAiProvider>
  );
}

export default Home;
