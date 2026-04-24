"use client";

import React, { use } from "react";
import { EventView } from "../../components/EventView";

interface EventViewPageProps {
  params: Promise<{ id: string }>;
}

export default function EventViewPage(props: EventViewPageProps) {
  const params = use(props.params);

  return <EventView eventId={params.id} />;
}
