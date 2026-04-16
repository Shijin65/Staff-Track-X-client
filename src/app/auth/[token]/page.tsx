"use client";

import React, { use } from "react";
import PasswordSetup from "@/app/auth/components/PasswordSetup";

export default function PasswordSetupPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params);

  return <PasswordSetup token={token} />;
}
