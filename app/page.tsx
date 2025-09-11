"use client";

import React from "react";
import { BasisTheoryProvider } from "@basis-theory-ai/react";
import { Playground } from "./components/Playground";

function Home() {
  // Use a minimal placeholder JWT - real JWTs are auto-generated in the Authentication tab
  const placeholderJWT = "placeholder";

  return (
    <BasisTheoryProvider apiKey={placeholderJWT} environment="local">
      <Playground />
    </BasisTheoryProvider>
  );
}

export default Home;