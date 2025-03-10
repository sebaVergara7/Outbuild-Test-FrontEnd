import React from "react";
import { BoardProvider } from "@/contexts/BoardContext";
import "@/styles/globals.css";
import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <BoardProvider>
      <Component {...pageProps} />
    </BoardProvider>
  );
};

export default MyApp;
