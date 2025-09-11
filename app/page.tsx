"use client";

import React from "react";
import { BasisTheoryProvider } from "@basis-theory-ai/react";
import { useJWT } from "./hooks/useJWT";
import { AuthLoadingState } from "./components/authentication/AuthLoadingState";
import { AuthErrorState } from "./components/authentication/AuthErrorState";
import { Playground } from "./components/Playground";

function Home() {
  const jwtHook = useJWT();
  const { jwt, isLoading, error } = jwtHook;

  if (isLoading) {
    return (
      <AuthLoadingState
        title="Generating Authentication Token..."
        message="Setting up secure session"
      />
    );
  }

  if (error) {
    return <AuthErrorState error={error} jwtHook={jwtHook} />;
  }

  if (!jwt) {
    return (
      <AuthLoadingState
        title="Setting up Authentication..."
        message="Generating secure tokens"
      />
    );
  }

  return (
    <BasisTheoryProvider apiKey={jwt} environment="local">
      <Playground jwt={jwt} />
    </BasisTheoryProvider>
  );
}

export default Home;