import { FamilyMember, LocationCandidate, LocationAnalysis } from '@/types';

// Mock geocoding for MVP - in production, use Mapbox or similar
const MOCK_GEOCODES: { [key: string]: { lat: number; lng: number } } = {
  // Major cities for testing
  '30303': { lat: 33.7490, lng: -84.3880 }, // Atlanta, GA
  '48201': { lat: 42.3314, lng: -83.0458 }, // Detroit, MI
  '60609': { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
  '20001': { lat: 38.9072, lng: -77.0369 }, // Washington, DC
  '77001': { lat: 29.7604, lng: -95.3698 }, // Houston, TX
  '10001': { lat: 40.7505, lng: -73.9934 }, // New York, NY
  '90210': { lat: 34.0901, lng: -118.4065 }, // Beverly Hills, CA
  '37203': { lat: 36.1627, lng: -86.7816 }, // Nashville, TN
  '63101': { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  '28202': { lat: 35.2271, lng: -80.8431 }, // Charlotte, NC
};

const CANDIDATE_CITIES = [
  { city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880, hotelBand: '$$' as const },
  { city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816, hotelBand: '$$' as const },
  { city: 'St. Louis', state: 'MO', lat: 38.6270, lng: -90.1994, hotelBand: '$' as const },
  { city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431, hotelBand: '$$' as const },
  { city: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.0490, hotelBand: '$' as const },
  { city: 'Birmingham', state: 'AL', lat: 33.5207, lng: -86.8025, hotelBand: '$' as const },
  { city: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715, hotelBand: '$$$' as const },
  { city: 'Orlando', state: 'FL', lat: 28.5383, lng: -81.3792, hotelBand: '$$$' as const },
];

export class LocationService {
  static async geocodeMembers(members: FamilyMember[]): Promise<FamilyMember[]> {
    // In MVP, use mock data. In production, call real geocoding API
    return members.map(member => {
      const coords = MOCK_GEOCODES[member.postalCode] || 
                    MOCK_GEOCODES[Object.keys(MOCK_GEOCODES)[0]]; // fallback
      return {
        ...member,
        lat: coords.lat,
        lng: coords.lng
      };
    });
  }

  static calculateCentroid(members: FamilyMember[]): { lat: number; lng: number } {
    if (members.length === 0) return { lat: 39.8283, lng: -98.5795 }; // Geographic center of US

    let totalLat = 0;
    let totalLng = 0;
    let totalWeight = 0;

    members.forEach(member => {
      if (member.lat && member.lng) {
        const weight = member.attendeeCount;
        totalLat += member.lat * weight;
        totalLng += member.lng * weight;
        totalWeight += weight;
      }
    });

    return {
      lat: totalLat / totalWeight,
      lng: totalLng / totalWeight
    };
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula for distance in miles
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static async analyzeLocations(members: FamilyMember[]): Promise<LocationAnalysis> {
    // Geocode all members first
    const geocodedMembers = await this.geocodeMembers(members);
    
    // Calculate centroid
    const centroid = this.calculateCentroid(geocodedMembers);
    
    // Score each candidate city
    const candidates: LocationCandidate[] = CANDIDATE_CITIES.map(candidate => {
      const distances = geocodedMembers.map(member => {
        if (!member.lat || !member.lng) return 1000; // Large penalty for missing coords
        return this.calculateDistance(member.lat, member.lng, candidate.lat, candidate.lng);
      });

      const medianDistance = this.median(distances);
      const maxDistance = Math.max(...distances);
      const distanceVariance = this.variance(distances);
      
      // Scoring algorithm: lower is better
      // - Minimize median travel distance
      // - Minimize maximum distance (fairness)
      // - Minimize variance (equity)
      const score = 1 / (1 + medianDistance * 0.3 + maxDistance * 0.2 + distanceVariance * 0.001);
      
      const medianDriveHours = medianDistance / 65; // Assume 65 mph average
      
      // Mock flight cost estimation
      const flightCostEst = medianDistance > 300 ? 150 + (medianDistance - 300) * 0.8 : undefined;
      
      let rationale = `Fair central location with ${medianDriveHours.toFixed(1)}h median drive`;
      if (flightCostEst) {
        rationale += `, ~$${Math.round(flightCostEst)} flights`;
      }

      return {
        city: candidate.city,
        state: candidate.state,
        score,
        medianDriveHours,
        flightCostEst,
        hotelBand: candidate.hotelBand,
        rationale,
        lat: candidate.lat,
        lng: candidate.lng
      };
    });

    // Sort by score (higher is better)
    candidates.sort((a, b) => b.score - a.score);

    const totalMembers = members.length;
    const totalAttendees = members.reduce((sum, member) => sum + member.attendeeCount, 0);

    return {
      centroid,
      candidates: candidates.slice(0, 5), // Top 5 recommendations
      totalMembers,
      totalAttendees
    };
  }

  private static median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private static variance(numbers: number[]): number {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }
}