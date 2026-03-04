"use client";

import { useState, useEffect } from "react";
import DealTracker from "@/components/DealTracker";
import PasswordGate from "@/components/PasswordGate";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function Page() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(getCookie("tracker_auth") === "1");
  }, []);

  if (authed === null) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#E7F3E9" }} />;
  }

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="fade-in">
      <DealTracker />
    </div>
  );
}
