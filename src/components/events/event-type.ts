export interface EventPayload {
  eventId: string;
  title: string;
  eventVenue?: string;
  eventType?: string;
  eventDate?: string; 
  reportingTime?: string;
  startTime?: string;
  clientName?: string;
  clientPhone?: string;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  status?: string;
  description?: string;
  locationInstructions?: string;
  longitude?: string;
  latitude?: string;
}

export type Order = "asc" | "desc";

export interface EventRow {
  id: string;
  title: string;
  eventDate: string;
  eventVenue: string;
  status: string;
}