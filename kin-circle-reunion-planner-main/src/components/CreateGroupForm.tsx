import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FamilyGroup } from '@/types';
import { StorageService } from '@/services/storage';
import { Heart } from 'lucide-react';

interface CreateGroupFormProps {
  onGroupCreated: (group: FamilyGroup) => void;
}

export function CreateGroupForm({ onGroupCreated }: CreateGroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    eventYear: new Date().getFullYear() + 1,
    organizerName: '',
    organizerEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.organizerName || !formData.organizerEmail) {
      alert('Please fill in all required fields');
      return;
    }

    const group: FamilyGroup = {
      id: StorageService.generateId(),
      name: formData.name,
      eventYear: formData.eventYear,
      organizerName: formData.organizerName,
      organizerEmail: formData.organizerEmail,
      members: [],
      createdAt: new Date().toISOString()
    };

    StorageService.saveFamilyGroup(group);
    onGroupCreated(group);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">KinCircle</h1>
          </div>
          <CardTitle className="text-xl">Start Your Family Reunion</CardTitle>
          <p className="text-muted-foreground">
            Bring your family together with smart planning
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Reunion Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Johnson Family Reunion"
                required
              />
            </div>

            <div>
              <Label htmlFor="eventYear">Reunion Year</Label>
              <Input
                id="eventYear"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 5}
                value={formData.eventYear}
                onChange={(e) => setFormData({ ...formData, eventYear: parseInt(e.target.value) || new Date().getFullYear() + 1 })}
              />
            </div>

            <div>
              <Label htmlFor="organizerName">Your Name *</Label>
              <Input
                id="organizerName"
                value={formData.organizerName}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="organizerEmail">Your Email *</Label>
              <Input
                id="organizerEmail"
                type="email"
                value={formData.organizerEmail}
                onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Reunion
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}