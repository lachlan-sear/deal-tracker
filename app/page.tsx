import { cookies } from "next/headers";
import { createHash } from "crypto";
import DealTracker from "@/components/DealTracker";
import PasswordGate from "@/components/PasswordGate";

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get("tracker_auth")?.value;
  const password = process.env.TRACKER_PASSWORD;

  let isAuthed = false;
  if (password && token) {
    const expectedToken = createHash("sha256")
      .update(password + "deal-tracker-salt")
      .digest("hex");
    isAuthed = token === expectedToken;
  }

  if (!isAuthed) {
    return <PasswordGate />;
  }

  return <DealTracker />;
}
