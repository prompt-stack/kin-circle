import { FamilyGroup, FamilyMember, LocationAnalysis, Poll } from '@/types';

// Local storage keys
const FAMILY_GROUPS_KEY = 'kinCircle_familyGroups';
const LOCATION_ANALYSES_KEY = 'kinCircle_locationAnalyses';
const POLLS_KEY = 'kinCircle_polls';

// JSON-based storage service for MVP
export class StorageService {
  static getAllFamilyGroups(): FamilyGroup[] {
    const stored = localStorage.getItem(FAMILY_GROUPS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getFamilyGroup(id: string): FamilyGroup | null {
    const groups = this.getAllFamilyGroups();
    return groups.find(group => group.id === id) || null;
  }

  static saveFamilyGroup(group: FamilyGroup): void {
    const groups = this.getAllFamilyGroups();
    const existingIndex = groups.findIndex(g => g.id === group.id);
    
    if (existingIndex >= 0) {
      groups[existingIndex] = group;
    } else {
      groups.push(group);
    }
    
    localStorage.setItem(FAMILY_GROUPS_KEY, JSON.stringify(groups));
  }

  static addFamilyMember(groupId: string, member: FamilyMember): void {
    const group = this.getFamilyGroup(groupId);
    if (group) {
      group.members.push(member);
      this.saveFamilyGroup(group);
    }
  }

  static updateFamilyMember(groupId: string, memberId: string, updates: Partial<FamilyMember>): void {
    const group = this.getFamilyGroup(groupId);
    if (group) {
      const memberIndex = group.members.findIndex(m => m.id === memberId);
      if (memberIndex >= 0) {
        group.members[memberIndex] = { ...group.members[memberIndex], ...updates };
        this.saveFamilyGroup(group);
      }
    }
  }

  static deleteFamilyMember(groupId: string, memberId: string): void {
    const group = this.getFamilyGroup(groupId);
    if (group) {
      group.members = group.members.filter(m => m.id !== memberId);
      this.saveFamilyGroup(group);
    }
  }

  static saveLocationAnalysis(groupId: string, analysis: LocationAnalysis): void {
    const stored = localStorage.getItem(LOCATION_ANALYSES_KEY);
    const analyses = stored ? JSON.parse(stored) : {};
    analyses[groupId] = analysis;
    localStorage.setItem(LOCATION_ANALYSES_KEY, JSON.stringify(analyses));
  }

  static getLocationAnalysis(groupId: string): LocationAnalysis | null {
    const stored = localStorage.getItem(LOCATION_ANALYSES_KEY);
    const analyses = stored ? JSON.parse(stored) : {};
    return analyses[groupId] || null;
  }

  static savePoll(poll: Poll): void {
    const stored = localStorage.getItem(POLLS_KEY);
    const polls = stored ? JSON.parse(stored) : [];
    const existingIndex = polls.findIndex((p: Poll) => p.id === poll.id);
    
    if (existingIndex >= 0) {
      polls[existingIndex] = poll;
    } else {
      polls.push(poll);
    }
    
    localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  }

  static getPoll(pollId: string): Poll | null {
    const stored = localStorage.getItem(POLLS_KEY);
    const polls = stored ? JSON.parse(stored) : [];
    return polls.find((p: Poll) => p.id === pollId) || null;
  }

  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}