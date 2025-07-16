import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationAnalysis as LocationAnalysisType, FamilyMember } from '@/types';
import { LocationService } from '@/services/locationService';
import { StorageService } from '@/services/storage';
import { MapPin, Clock, DollarSign, Star, Loader2 } from 'lucide-react';

interface LocationAnalysisProps {
  groupId: string;
  members: FamilyMember[];
}

export function LocationAnalysis({ groupId, members }: LocationAnalysisProps) {
  const [analysis, setAnalysis] = useState<LocationAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing analysis if available
    const existingAnalysis = StorageService.getLocationAnalysis(groupId);
    if (existingAnalysis) {
      setAnalysis(existingAnalysis);
    }
  }, [groupId]);

  const handleAnalyze = async () => {
    if (members.length < 2) {
      alert('Please add at least 2 family members to analyze locations');
      return;
    }

    setLoading(true);
    try {
      const result = await LocationService.analyzeLocations(members);
      setAnalysis(result);
      StorageService.saveLocationAnalysis(groupId, result);
    } catch (error) {
      console.error('Error analyzing locations:', error);
      alert('Error analyzing locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHotelBandText = (band: string) => {
    switch (band) {
      case '$': return 'Budget-friendly';
      case '$$': return 'Mid-range';
      case '$$$': return 'Premium';
      default: return 'Unknown';
    }
  };

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Ready to find the perfect location?</h3>
          <p className="text-muted-foreground">
            Add family members first, then we'll analyze the best central meeting spots
          </p>
        </CardContent>
      </Card>
    );
  }

  if (members.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Add more family members</h3>
          <p className="text-muted-foreground">
            We need at least 2 family members from different locations to suggest meeting spots
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Location Analysis</h2>
          <p className="text-muted-foreground">
            Find the fairest meeting spot for your family
          </p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            analysis ? 'Re-analyze Locations' : 'Find Best Locations'
          )}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{analysis.totalMembers}</div>
                  <div className="text-sm text-muted-foreground">Families</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{analysis.totalAttendees}</div>
                  <div className="text-sm text-muted-foreground">Total Attendees</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-lg font-semibold">
                    {analysis.centroid.lat.toFixed(2)}°, {analysis.centroid.lng.toFixed(2)}°
                  </div>
                  <div className="text-sm text-muted-foreground">Geographic Center</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recommended Locations</h3>
            <div className="grid gap-4">
              {analysis.candidates.map((candidate, index) => (
                <Card key={`${candidate.city}-${candidate.state}`} className={index === 0 ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold">
                            {candidate.city}, {candidate.state}
                          </h4>
                          {index === 0 && (
                            <Badge className="bg-primary">
                              <Star className="h-3 w-3 mr-1" />
                              Best Match
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Score: {(candidate.score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{candidate.rationale}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-accent" />
                            <span>{candidate.medianDriveHours.toFixed(1)}h median drive</span>
                          </div>
                          
                          {candidate.flightCostEst && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-accent" />
                              <span>~${Math.round(candidate.flightCostEst)} flights</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{getHotelBandText(candidate.hotelBand)}</Badge>
                            <span>hotels</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="py-6 text-center">
              <h3 className="text-lg font-medium mb-2">Ready for the next step?</h3>
              <p className="text-muted-foreground mb-4">
                Create a poll to let your family vote on their preferred location and dates
              </p>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Create Family Poll
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}