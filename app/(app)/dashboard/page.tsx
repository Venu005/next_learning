"use client";
import { signOut } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <div>
      Dashboaard
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default page;
