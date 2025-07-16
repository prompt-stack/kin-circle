import { useState, useEffect } from 'react';
import { FamilyGroup, FamilyMember } from '@/types';
import { StorageService } from '@/services/storage';
import { FamilyMemberList } from './FamilyMemberList';
import { LocationAnalysis } from './LocationAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MapPin, Calendar, ArrowLeft } from 'lucide-react';

interface GroupDashboardProps {
  group: FamilyGroup;
  onBackToHome: () => void;
}

export function GroupDashboard({ group: initialGroup, onBackToHome }: GroupDashboardProps) {
  const [group, setGroup] = useState<FamilyGroup>(initialGroup);
  const [activeTab, setActiveTab] = useState('members');

  const refreshGroup = () => {
    const updatedGroup = StorageService.getFamilyGroup(group.id);
    if (updatedGroup) {
      setGroup(updatedGroup);
    }
  };

  useEffect(() => {
    refreshGroup();
  }, [group.id]);

  const totalAttendees = group.members.reduce((sum, member) => sum + member.attendeeCount, 0);
  const uniqueStates = new Set(group.members.map(member => member.state)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackToHome}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">KinCircle</h1>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <p className="text-sm text-muted-foreground">
                {group.eventYear && `${group.eventYear} • `}
                Organized by {group.organizerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{group.members.length}</div>
              <div className="text-sm text-muted-foreground">Families Added</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalAttendees}</div>
              <div className="text-sm text-muted-foreground">Total Attendees</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold">{uniqueStates}</div>
              <div className="text-sm text-muted-foreground">States Represented</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Family Members
              {group.members.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {group.members.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planning
              <Badge variant="outline" className="ml-1">
                Soon
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <FamilyMemberList
              groupId={group.id}
              members={group.members}
              onMembersChange={refreshGroup}
            />
          </TabsContent>

          <TabsContent value="locations">
            <LocationAnalysis
              groupId={group.id}
              members={group.members}
            />
          </TabsContent>

          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Planning Features</CardTitle>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground mb-4">
                  Poll creation, RSVP management, itinerary building, and budget tracking
                </p>
                <Badge variant="outline">Phase 1.5 Features</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}