import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FamilyMember } from '@/types';
import { StorageService } from '@/services/storage';

interface FamilyMemberFormProps {
  groupId: string;
  onMemberAdded: () => void;
  member?: FamilyMember;
  onCancel?: () => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const RELATIONSHIP_ROLES = [
  'Parent', 'Grandparent', 'Great-Grandparent',
  'Aunt/Uncle', 'Great Aunt/Uncle', 
  'Sibling', 'Cousin', 'Second Cousin',
  'Child', 'Grandchild', 'Great-Grandchild',
  'In-Law', 'Family Friend', 'Other'
];

export function FamilyMemberForm({ groupId, onMemberAdded, member, onCancel }: FamilyMemberFormProps) {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    phone: member?.phone || '',
    city: member?.city || '',
    state: member?.state || '',
    postalCode: member?.postalCode || '',
    country: member?.country || 'United States',
    attendeeCount: member?.attendeeCount || 1,
    travelMode: member?.travelMode || 'either',
    accessNeeds: member?.accessNeeds || '',
    relationshipRole: member?.relationshipRole || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.city || !formData.state || !formData.postalCode) {
      alert('Please fill in all required fields');
      return;
    }

    const memberData: FamilyMember = {
      id: member?.id || StorageService.generateId(),
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email,
      phone: formData.phone,
      city: formData.city!,
      state: formData.state!,
      postalCode: formData.postalCode!,
      country: formData.country!,
      attendeeCount: formData.attendeeCount!,
      travelMode: formData.travelMode!,
      accessNeeds: formData.accessNeeds,
      relationshipRole: formData.relationshipRole
    };

    if (member) {
      StorageService.updateFamilyMember(groupId, member.id, memberData);
    } else {
      StorageService.addFamilyMember(groupId, memberData);
    }

    onMemberAdded();
  };

  const isEditing = !!member;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">
          {isEditing ? 'Edit Family Member' : 'Add Family Member'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g., Auntie Sarah"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Johnson"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah.johnson@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Atlanta"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="postalCode">ZIP Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="30303"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attendeeCount">Number Attending *</Label>
              <Input
                id="attendeeCount"
                type="number"
                min="1"
                value={formData.attendeeCount}
                onChange={(e) => setFormData({ ...formData, attendeeCount: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="relationshipRole">Relationship</Label>
              <Select value={formData.relationshipRole} onValueChange={(value) => setFormData({ ...formData, relationshipRole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="travelMode">Travel Preference</Label>
            <Select value={formData.travelMode} onValueChange={(value: 'drive' | 'fly' | 'either') => setFormData({ ...formData, travelMode: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drive">Prefer Driving</SelectItem>
                <SelectItem value="fly">Prefer Flying</SelectItem>
                <SelectItem value="either">Either Drive or Fly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accessNeeds">Accessibility Needs (Optional)</Label>
            <Textarea
              id="accessNeeds"
              value={formData.accessNeeds}
              onChange={(e) => setFormData({ ...formData, accessNeeds: e.target.value })}
              placeholder="Wheelchair access, mobility assistance, etc."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}