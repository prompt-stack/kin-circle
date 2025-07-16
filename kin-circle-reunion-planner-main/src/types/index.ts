export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  attendeeCount: number;
  travelMode: 'drive' | 'fly' | 'either';
  accessNeeds?: string;
  relationshipRole?: string;
  lat?: number;
  lng?: number;
}

export interface FamilyGroup {
  id: string;
  name: string;
  eventYear?: number;
  organizerName: string;
  organizerEmail: string;
  members: FamilyMember[];
  createdAt: string;
}

export interface LocationCandidate {
  city: string;
  state: string;
  score: number;
  medianDriveHours: number;
  flightCostEst?: number;
  hotelBand: '$' | '$$' | '$$$';
  rationale: string;
  lat: number;
  lng: number;
}

export interface LocationAnalysis {
  centroid: {
    lat: number;
    lng: number;
  };
  candidates: LocationCandidate[];
  totalMembers: number;
  totalAttendees: number;
}

export interface Poll {
  id: string;
  familyGroupId: string;
  pollType: 'location' | 'date';
  options: string[];
  votes: { [option: string]: number };
  expiresAt: string;
}