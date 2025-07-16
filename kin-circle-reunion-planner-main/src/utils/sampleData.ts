import { FamilyGroup, FamilyMember } from '@/types';
import { StorageService } from '@/services/storage';

export function createSampleData() {
  // Check if sample data already exists
  const existingGroups = StorageService.getAllFamilyGroups();
  if (existingGroups.length > 0) {
    return;
  }

  const sampleMembers: FamilyMember[] = [
    {
      id: 'member-1',
      firstName: 'Auntie Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(404) 555-0123',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30303',
      country: 'United States',
      attendeeCount: 4,
      travelMode: 'either',
      relationshipRole: 'Aunt/Uncle',
      accessNeeds: ''
    },
    {
      id: 'member-2',
      firstName: 'Uncle Marcus',
      lastName: 'Johnson',
      email: 'marcus.j@email.com',
      phone: '(313) 555-0456',
      city: 'Detroit',
      state: 'MI',
      postalCode: '48201',
      country: 'United States',
      attendeeCount: 3,
      travelMode: 'drive',
      relationshipRole: 'Aunt/Uncle',
      accessNeeds: 'Wheelchair accessible venue needed'
    },
    {
      id: 'member-3',
      firstName: 'Cousin Keisha',
      lastName: 'Williams',
      email: 'keisha.w@email.com',
      phone: '(773) 555-0789',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60609',
      country: 'United States',
      attendeeCount: 5,
      travelMode: 'either',
      relationshipRole: 'Cousin',
      accessNeeds: ''
    },
    {
      id: 'member-4',
      firstName: 'Grandma Betty',
      lastName: 'Johnson',
      email: '',
      phone: '(202) 555-0321',
      city: 'Washington',
      state: 'DC',
      postalCode: '20001',
      country: 'United States',
      attendeeCount: 2,
      travelMode: 'fly',
      relationshipRole: 'Grandparent',
      accessNeeds: 'Senior-friendly accommodations'
    },
    {
      id: 'member-5',
      firstName: 'Big Mike',
      lastName: 'Johnson',
      email: 'mike.houston@email.com',
      phone: '(713) 555-0654',
      city: 'Houston',
      state: 'TX',
      postalCode: '77001',
      country: 'United States',
      attendeeCount: 6,
      travelMode: 'drive',
      relationshipRole: 'Cousin',
      accessNeeds: ''
    },
    {
      id: 'member-6',
      firstName: 'Sister Janet',
      lastName: 'Thompson',
      email: 'janet.t@email.com',
      phone: '(704) 555-0987',
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28202',
      country: 'United States',
      attendeeCount: 2,
      travelMode: 'either',
      relationshipRole: 'Sibling',
      accessNeeds: ''
    }
  ];

  const sampleGroup: FamilyGroup = {
    id: 'sample-group-1',
    name: 'Johnson Family Reunion 2025',
    eventYear: 2025,
    organizerName: 'Denise Johnson',
    organizerEmail: 'denise.organizer@email.com',
    members: sampleMembers,
    createdAt: new Date().toISOString()
  };

  StorageService.saveFamilyGroup(sampleGroup);
}

export function clearAllData() {
  localStorage.removeItem('kinCircle_familyGroups');
  localStorage.removeItem('kinCircle_locationAnalyses');
  localStorage.removeItem('kinCircle_polls');
}