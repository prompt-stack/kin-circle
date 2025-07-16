import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FamilyMember } from '@/types';
import { StorageService } from '@/services/storage';
import { FamilyMemberForm } from './FamilyMemberForm';
import { Edit2, Trash2, Users, MapPin, Phone, Mail } from 'lucide-react';

interface FamilyMemberListProps {
  groupId: string;
  members: FamilyMember[];
  onMembersChange: () => void;
}

export function FamilyMemberList({ groupId, members, onMembersChange }: FamilyMemberListProps) {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this family member?')) {
      StorageService.deleteFamilyMember(groupId, memberId);
      onMembersChange();
    }
  };

  const handleMemberAdded = () => {
    setShowAddForm(false);
    setEditingMember(null);
    onMembersChange();
  };

  const totalAttendees = members.reduce((sum, member) => sum + member.attendeeCount, 0);

  if (editingMember) {
    return (
      <FamilyMemberForm
        groupId={groupId}
        member={editingMember}
        onMemberAdded={handleMemberAdded}
        onCancel={() => setEditingMember(null)}
      />
    );
  }

  if (showAddForm) {
    return (
      <FamilyMemberForm
        groupId={groupId}
        onMemberAdded={handleMemberAdded}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Family Members</h2>
          <p className="text-muted-foreground">
            {members.length} families • {totalAttendees} total attendees
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Add Family Member
        </Button>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No family members added yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding family members who want to attend the reunion
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Add First Family Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.relationshipRole && (
                        <Badge variant="secondary">{member.relationshipRole}</Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {member.attendeeCount}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {member.city}, {member.state} {member.postalCode}
                      </div>
                      
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </div>
                      )}
                      
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {member.phone}
                        </div>
                      )}
                      
                      <div>
                        Travel: <span className="capitalize">{member.travelMode.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {member.accessNeeds && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Accessibility needs:</strong> {member.accessNeeds}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingMember(member)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}