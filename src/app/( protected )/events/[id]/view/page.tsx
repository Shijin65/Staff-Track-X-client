"use client";

import React, { use } from "react";
import { EventView } from "../../../../../components/events/EventView";

interface EventViewPageProps {
  params: Promise<{ id: string }>;
}

export default function EventViewPage({ params }: EventViewPageProps) {
  const id = use(params).id;

  return <EventView eventId={id} />;
}
