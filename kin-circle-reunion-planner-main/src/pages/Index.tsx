import { useState, useEffect } from 'react';
import { FamilyGroup } from '@/types';
import { StorageService } from '@/services/storage';
import { CreateGroupForm } from '@/components/CreateGroupForm';
import { GroupDashboard } from '@/components/GroupDashboard';
import { GroupList } from '@/components/GroupList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Plus, Sparkles } from 'lucide-react';
import { createSampleData } from '@/utils/sampleData';
import heroImage from '@/assets/family-reunion-hero.jpg';

const Index = () => {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    const groups = StorageService.getAllFamilyGroups();
    setFamilyGroups(groups);
  };

  const handleGroupCreated = (group: FamilyGroup) => {
    setSelectedGroup(group);
    setShowCreateForm(false);
    loadGroups();
  };

  const handleBackToHome = () => {
    setSelectedGroup(null);
    loadGroups();
  };

  // Show group dashboard if a group is selected
  if (selectedGroup) {
    return (
      <GroupDashboard 
        group={selectedGroup} 
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Show create form if explicitly requested or no groups exist
  if (showCreateForm) {
    return <CreateGroupForm onGroupCreated={handleGroupCreated} />;
  }

  // Show home page with group list
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">KinCircle</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bring your family together with smart reunion planning. 
            Collect everyone's info, find the perfect location, and coordinate everything in one place.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Family Reunions</h2>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Reunion
            </Button>
          </div>

          {familyGroups.length === 0 ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <img 
                  src={heroImage} 
                  alt="Family reunion gathering" 
                  className="w-full max-w-md mx-auto rounded-lg mb-6"
                />
                <h3 className="text-2xl font-bold mb-4">Ready to plan your family reunion?</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  KinCircle makes it easy to collect family info, find the perfect central location, 
                  and coordinate all the details for an amazing reunion.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowCreateForm(true)} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Your Reunion
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      createSampleData();
                      loadGroups();
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try Demo Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <GroupList 
              groups={familyGroups}
              onGroupSelect={setSelectedGroup}
              onGroupsChange={loadGroups}
            />
          )}

          {familyGroups.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">How KinCircle Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Add Family Members</h3>
                    <p className="text-sm text-muted-foreground">
                      Collect everyone's location and travel preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-accent/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-foreground font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Find Best Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Get smart recommendations for fair, central meeting spots
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-secondary-foreground font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Plan Together</h3>
                    <p className="text-sm text-muted-foreground">
                      Share polls, collect RSVPs, and coordinate the details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
