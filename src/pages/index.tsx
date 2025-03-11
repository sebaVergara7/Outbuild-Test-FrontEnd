/**
 * Home page component that initializes user data and displays the collaborative task board.
 */

import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Board from "@/components/Board/Board";
import Head from "next/head";

const Home = () => {
  useEffect(() => {
    // Generate user ID if it does not exist
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", uuidv4());
    }

    // Generate username if it does not exist
    if (!localStorage.getItem("username")) {
      localStorage.setItem(
        "username",
        `User-${Math.floor(Math.random() * 1000)}`
      );
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Collaborative Task Board</title>
        <meta
          name="description"
          content="Real-time collaborative Kanban board"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Board />
      </main>
    </div>
  );
};

export default Home;
