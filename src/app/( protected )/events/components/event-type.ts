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
  status?: string;
  description?: string;
  locationInstructions?: string;
  longitude?: string;
  latitude?: string;
}