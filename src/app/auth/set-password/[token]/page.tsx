"use client";
import { use } from "react";
import PasswordSetup from "@/components/auth/PasswordSetup";

export default function PasswordSetupPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params);

  return <PasswordSetup token={token} />;
}
