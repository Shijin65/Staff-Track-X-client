"use client";

import { use } from "react";
import { UserViewContainer } from '@/components/users/UserViewContainer';

export default function UserViewPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const uid = use(params).id;
  return <UserViewContainer uid={uid} />;
}
