"use client";

import { useState, useRef } from "react";

export default function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "paddockpass") {
      document.cookie = "tracker_auth=1; path=/; max-age=" + 60 * 60 * 24 * 30;
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 400);
      inputRef.current?.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E7F3E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={shaking ? "shake" : ""}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Lora', serif",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "0.2em",
            color: "#1A1A1A",
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          LACHLAN SEAR
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            color: "#6B6B6B",
            marginBottom: 16,
          }}
        >
          Deal Pipeline
        </div>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(false);
          }}
          placeholder={error ? "Try again" : "Password"}
          autoFocus
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${error ? "#e57373" : "#C0C0C0"}`,
            borderRadius: 8,
            padding: "10px 16px",
            color: "#1A1A1A",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            outline: "none",
            width: 280,
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#8cc49a";
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#C0C0C0";
          }}
        />
        {error && (
          <style>{`input::placeholder { color: #e57373 !important; }`}</style>
        )}
        <button type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
}
