"use client";

import { useState } from "react";

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-2">
          deal-tracker
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-zinc-200 font-mono text-sm focus:outline-none focus:border-zinc-600 w-64 placeholder:text-zinc-600 transition-colors"
        />
        {error && (
          <div className="text-red-500/80 text-xs font-mono">
            Invalid password
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-sm px-6 py-2 rounded transition-colors disabled:opacity-50 w-64"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
