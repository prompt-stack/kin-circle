import { FamilyGroup } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar, Trash2 } from 'lucide-react';
import { StorageService } from '@/services/storage';

interface GroupListProps {
  groups: FamilyGroup[];
  onGroupSelect: (group: FamilyGroup) => void;
  onGroupsChange: () => void;
}

export function GroupList({ groups, onGroupSelect, onGroupsChange }: GroupListProps) {
  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (confirm(`Are you sure you want to delete "${groupName}"? This cannot be undone.`)) {
      const allGroups = StorageService.getAllFamilyGroups();
      const filteredGroups = allGroups.filter(g => g.id !== groupId);
      localStorage.setItem('kinCircle_familyGroups', JSON.stringify(filteredGroups));
      onGroupsChange();
    }
  };

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No reunions yet</h3>
          <p className="text-muted-foreground">
            Create your first family reunion to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {groups.map((group) => {
        const totalAttendees = group.members.reduce((sum, member) => sum + member.attendeeCount, 0);
        const uniqueStates = new Set(group.members.map(member => member.state)).size;
        
        return (
          <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {group.eventYear && (
                    <Badge variant="outline">{group.eventYear}</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id, group.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent onClick={() => onGroupSelect(group)}>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 text-primary mb-1" />
                  <div className="font-semibold">{group.members.length}</div>
                  <div className="text-xs text-muted-foreground">Families</div>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-accent mb-1" />
                  <div className="font-semibold">{totalAttendees}</div>
                  <div className="text-xs text-muted-foreground">Attendees</div>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="h-5 w-5 text-secondary-foreground mb-1" />
                  <div className="font-semibold">{uniqueStates}</div>
                  <div className="text-xs text-muted-foreground">States</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Organized by {group.organizerName}
              </div>
              
              <Button className="w-full mt-4">
                Open Reunion
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}