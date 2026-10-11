import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Club, 
  ClubLedgerEntry, 
  ClubApplication, 
  PayoutSettlementRequest, 
  ClubCoordinator,
  ClubMember,
  ClubMeeting,
  ClubMeetingSummary
} from '../types';
import { 
  SEED_CLUBS, 
  SEED_LEDGER_ENTRIES, 
  SEED_CLUB_APPLICATIONS, 
  SEED_PAYOUT_REQUESTS,
  SEED_CLUB_MEMBERS,
  SEED_CLUB_MEETINGS
} from '../data/seedData';
import { fetchClubs } from '../services/api';

interface CentralTreasuryStats {
  totalGrossCampusRevenue: number;
  totalAvailableBalance: number;
  totalPendingSettlements: number;
  totalTransactionsCount: number;
  clubBreakdown: Array<{
    clubId: string;
    clubSlug: string;
    clubName: string;
    category: string;
    availableBalance: number;
    totalRevenue: number;
    pendingSettlement: number;
    payoutUpiId: string;
    memberCount: number;
    eventsHostedCount: number;
  }>;
}

interface ClubContextType {
  clubs: Club[];
  ledgerEntries: ClubLedgerEntry[];
  clubApplications: ClubApplication[];
  payoutRequests: PayoutSettlementRequest[];
  clubMembers: ClubMember[];
  clubMeetings: ClubMeeting[];
  getClubBySlug: (slug: string) => Club | undefined;
  getClubById: (id: string) => Club | undefined;
  updateClubProfile: (clubIdOrSlug: string, updates: Partial<Club>) => { success: boolean; message: string };
  getClubLedger: (clubId: string) => ClubLedgerEntry[];
  requestPayoutSettlement: (
    clubId: string, 
    amount: number, 
    upiId: string, 
    requestedBy: { id: string; name: string },
    note?: string
  ) => { success: boolean; message: string; receiptId?: string };
  approvePayoutByDean: (requestId: string) => { success: boolean; message: string };
  rejectPayoutByDean: (requestId: string, reason?: string) => { success: boolean; message: string };
  addClubCoordinator: (clubId: string, coordinator: Omit<ClubCoordinator, 'id'>) => { success: boolean; message: string };
  removeClubCoordinator: (clubId: string, coordinatorId: string) => { success: boolean; message: string };
  submitJoinApplication: (application: Omit<ClubApplication, 'id' | 'appliedAt' | 'status'>) => { success: boolean; message: string };
  reviewJoinApplication: (appId: string, status: 'ACCEPTED' | 'REJECTED', notes?: string) => { success: boolean; message: string };
  getCentralTreasuryStats: () => CentralTreasuryStats;
  resetToDefaultData: () => void;
  // Internal Club Member & Meeting Features
  getClubMembers: (clubIdOrSlug: string) => ClubMember[];
  addClubMember: (memberData: Omit<ClubMember, 'id' | 'joinedAt' | 'status'>) => { success: boolean; message: string; member?: ClubMember };
  removeClubMember: (memberId: string) => { success: boolean; message: string };
  getClubMeetings: (clubIdOrSlug: string) => ClubMeeting[];
  scheduleClubMeeting: (meetingData: Omit<ClubMeeting, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string; meeting?: ClubMeeting };
  publishMeetingSummary: (meetingId: string, summary: ClubMeetingSummary) => { success: boolean; message: string };
  deleteClubMeeting: (meetingId: string) => { success: boolean; message: string };
  getTodayMeetingsForUser: (userRollNo?: string, userEmail?: string) => ClubMeeting[];
  isUserMemberOfClub: (clubIdOrSlug: string, userRollNo?: string, userEmail?: string) => boolean;
}

const STORAGE_KEYS = {
  CLUBS: 'campussphere_clubs_v3',
  LEDGER: 'campussphere_ledger_v3',
  APPLICATIONS: 'campussphere_club_apps_v3',
  PAYOUTS: 'campussphere_payout_reqs_v3',
  MEMBERS: 'campussphere_club_members_v4',
  MEETINGS: 'campussphere_club_meetings_v4',
};

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useState<Club[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLUBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load clubs from localStorage:', e);
    }
    return SEED_CLUBS;
  });

  const [ledgerEntries, setLedgerEntries] = useState<ClubLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEDGER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load ledger from localStorage:', e);
    }
    return SEED_LEDGER_ENTRIES;
  });

  const [clubApplications, setClubApplications] = useState<ClubApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load applications from localStorage:', e);
    }
    return SEED_CLUB_APPLICATIONS;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutSettlementRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load payouts from localStorage:', e);
    }
    return SEED_PAYOUT_REQUESTS;
  });

  const [clubMembers, setClubMembers] = useState<ClubMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load club members from localStorage:', e);
    }
    return SEED_CLUB_MEMBERS;
  });

  const [clubMeetings, setClubMeetings] = useState<ClubMeeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load club meetings from localStorage:', e);
    }
    return SEED_CLUB_MEETINGS;
  });
  
  // Load live clubs from MongoDB Atlas on mount
  useEffect(() => {
    fetchClubs()
      .then((data) => {
        if (data && data.length > 0) {
          setClubs(data);
        }
      })
      .catch((err) => console.warn('Could not sync clubs from MongoDB Atlas:', err));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    } catch (e) {
      console.error('Error saving clubs to storage', e);
    }
  }, [clubs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledgerEntries));
    } catch (e) {
      console.error('Error saving ledger to storage', e);
    }
  }, [ledgerEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(clubApplications));
    } catch (e) {
      console.error('Error saving applications to storage', e);
    }
  }, [clubApplications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payoutRequests));
    } catch (e) {
      console.error('Error saving payouts to storage', e);
    }
  }, [payoutRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(clubMembers));
    } catch (e) {
      console.error('Error saving club members to storage', e);
    }
  }, [clubMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(clubMeetings));
    } catch (e) {
      console.error('Error saving club meetings to storage', e);
    }
  }, [clubMeetings]);

  const getClubBySlug = (slug: string): Club | undefined => {
    return clubs.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  };

  const getClubById = (id: string): Club | undefined => {
    return clubs.find(c => c.id === id);
  };

  const updateClubProfile = (clubIdOrSlug: string, updates: Partial<Club>): { success: boolean; message: string } => {
    let updated = false;
    setClubs(prev => prev.map(c => {
      if (c.id === clubIdOrSlug || c.slug.toLowerCase() === clubIdOrSlug.toLowerCase()) {
        updated = true;
        return {
          ...c,
          ...updates,
          treasury: updates.treasury ? { ...c.treasury, ...updates.treasury } : c.treasury,
          socialLinks: updates.socialLinks ? { ...c.socialLinks, ...updates.socialLinks } : c.socialLinks,
        };
      }
      return c;
    }));

    if (updated) {
      return { success: true, message: 'Club profile updated successfully!' };
    }
    return { success: false, message: 'Club not found.' };
  };

  const getClubLedger = (clubId: string): ClubLedgerEntry[] => {
    return ledgerEntries
      .filter(entry => entry.clubId === clubId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const requestPayoutSettlement = (
    clubId: string, 
    amount: number, 
    upiId: string, 
    requestedBy: { id: string; name: string },
    note?: string
  ): { success: boolean; message: string; receiptId?: string } => {
    const club = clubs.find(c => c.id === clubId);
    if (!club) {
      return { success: false, message: 'Club not found.' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Disbursement amount must be greater than ₹0.' };
    }

    if (amount > club.treasury.availableBalance) {
      return { 
        success: false, 
        message: `Insufficient funds: Available balance is ₹${club.treasury.availableBalance.toLocaleString()}, but ₹${amount.toLocaleString()} requested.` 
      };
    }

    const refNum = `DISB-ACEIT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newBalance = club.treasury.availableBalance - amount;

    // 1. Update Club Treasury state
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          treasury: {
            ...c.treasury,
            availableBalance: newBalance,
            pendingSettlement: c.treasury.pendingSettlement + amount,
            payoutUpiId: upiId || c.treasury.payoutUpiId,
          }
        };
      }
      return c;
    }));

    // 2. Add Ledger Entry
    const newLedgerEntry: ClubLedgerEntry = {
      id: `ledg_payout_${Date.now()}`,
      clubId: club.id,
      clubName: club.name,
      type: 'PAYOUT_DISBURSEMENT',
      creditAmount: 0,
      debitAmount: amount,
      gatewayFee: 0,
      netAmount: -amount,
      runningBalance: newBalance,
      remarks: note ? `Payout to ${upiId}: ${note}` : `Payout request dispatched to ${upiId}`,
      timestamp: new Date().toISOString(),
      referenceId: refNum,
      status: 'PENDING',
    };
    setLedgerEntries(prev => [newLedgerEntry, ...prev]);

    // 3. Add to Payout Requests Queue
    const newPayoutRequest: PayoutSettlementRequest = {
      id: `payout_req_${Date.now()}`,
      clubId: club.id,
      clubName: club.name,
      requestedByUserId: requestedBy.id,
      requestedByUserName: requestedBy.name,
      amount,
      payoutUpiId: upiId,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      referenceNumber: refNum,
      deanApprovalStatus: 'PENDING',
    };
    setPayoutRequests(prev => [newPayoutRequest, ...prev]);

    return { 
      success: true, 
      message: `Payout request for ₹${amount.toLocaleString()} registered! Reference: ${refNum}`,
      receiptId: refNum 
    };
  };

  const approvePayoutByDean = (requestId: string): { success: boolean; message: string } => {
    const req = payoutRequests.find(p => p.id === requestId);
    if (!req) return { success: false, message: 'Payout request not found.' };

    setPayoutRequests(prev => prev.map(p => {
      if (p.id === requestId) {
        return {
          ...p,
          status: 'DISBURSED',
          deanApprovalStatus: 'APPROVED',
          disbursedAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    // Settle pending in club treasury
    setClubs(prev => prev.map(c => {
      if (c.id === req.clubId) {
        return {
          ...c,
          treasury: {
            ...c.treasury,
            pendingSettlement: Math.max(0, c.treasury.pendingSettlement - req.amount),
          }
        };
      }
      return c;
    }));

    // Update ledger entry status to SETTLED
    setLedgerEntries(prev => prev.map(e => {
      if (e.referenceId === req.referenceNumber) {
        return { ...e, status: 'SETTLED' };
      }
      return e;
    }));

    return { success: true, message: `Disbursement ${req.referenceNumber} approved and settled by Dean.` };
  };

  const rejectPayoutByDean = (requestId: string, reason?: string): { success: boolean; message: string } => {
    const req = payoutRequests.find(p => p.id === requestId);
    if (!req) return { success: false, message: 'Payout request not found.' };

    setPayoutRequests(prev => prev.map(p => {
      if (p.id === requestId) {
        return {
          ...p,
          status: 'REJECTED',
          deanApprovalStatus: 'PENDING',
        };
      }
      return p;
    }));

    // Revert funds back to availableBalance
    setClubs(prev => prev.map(c => {
      if (c.id === req.clubId) {
        return {
          ...c,
          treasury: {
            ...c.treasury,
            availableBalance: c.treasury.availableBalance + req.amount,
            pendingSettlement: Math.max(0, c.treasury.pendingSettlement - req.amount),
          }
        };
      }
      return c;
    }));

    // Add refund/reversal ledger entry
    const revertEntry: ClubLedgerEntry = {
      id: `ledg_rev_${Date.now()}`,
      clubId: req.clubId,
      clubName: req.clubName,
      type: 'REFUND',
      creditAmount: req.amount,
      debitAmount: 0,
      gatewayFee: 0,
      netAmount: req.amount,
      runningBalance: (clubs.find(c => c.id === req.clubId)?.treasury.availableBalance || 0) + req.amount,
      remarks: `Reversal of ${req.referenceNumber} by Dean: ${reason || 'Audit rejection'}`,
      timestamp: new Date().toISOString(),
      referenceId: `REV-${req.referenceNumber}`,
      status: 'SETTLED',
    };
    setLedgerEntries(prev => [revertEntry, ...prev]);

    return { success: true, message: `Payout request ${req.referenceNumber} rejected and refunded to club balance.` };
  };

  const addClubCoordinator = (clubId: string, coordinator: Omit<ClubCoordinator, 'id'>): { success: boolean; message: string } => {
    const id = `coord_${Date.now()}`;
    const newCoord: ClubCoordinator = { id, ...coordinator };

    let updated = false;
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        updated = true;
        const currentCoords = c.coordinators || [];
        return {
          ...c,
          coordinators: [...currentCoords, newCoord],
          studentLeads: [...c.studentLeads, `${newCoord.name} (${newCoord.designation})`],
        };
      }
      return c;
    }));

    return updated 
      ? { success: true, message: `${coordinator.name} added to coordinator roster!` }
      : { success: false, message: 'Club not found.' };
  };

  const removeClubCoordinator = (clubId: string, coordinatorId: string): { success: boolean; message: string } => {
    let updated = false;
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        updated = true;
        const filtered = (c.coordinators || []).filter(coord => coord.id !== coordinatorId);
        return {
          ...c,
          coordinators: filtered,
        };
      }
      return c;
    }));

    return updated 
      ? { success: true, message: 'Coordinator removed from club roster.' }
      : { success: false, message: 'Club not found.' };
  };

  const submitJoinApplication = (application: Omit<ClubApplication, 'id' | 'appliedAt' | 'status'>): { success: boolean; message: string } => {
    const newApp: ClubApplication = {
      id: `app_${Date.now()}`,
      ...application,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };

    setClubApplications(prev => [newApp, ...prev]);
    return { success: true, message: `Application submitted to ${application.clubName}! Executive committee will review.` };
  };

  const reviewJoinApplication = (appId: string, status: 'ACCEPTED' | 'REJECTED', notes?: string): { success: boolean; message: string } => {
    const app = clubApplications.find(a => a.id === appId);
    if (!app) return { success: false, message: 'Application not found.' };

    setClubApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          reviewedAt: new Date().toISOString(),
          reviewerNotes: notes || (status === 'ACCEPTED' ? 'Welcome to the team!' : 'Application not accepted at this time.'),
        };
      }
      return a;
    }));

    if (status === 'ACCEPTED') {
      // Increment club member count
      setClubs(prev => prev.map(c => {
        if (c.id === app.clubId) {
          return { ...c, memberCount: c.memberCount + 1 };
        }
        return c;
      }));
    }

    return { 
      success: true, 
      message: `Application by ${app.userName} has been marked as ${status}.` 
    };
  };

  const getCentralTreasuryStats = (): CentralTreasuryStats => {
    let totalGrossCampusRevenue = 0;
    let totalAvailableBalance = 0;
    let totalPendingSettlements = 0;

    const clubBreakdown = clubs.map(club => {
      totalGrossCampusRevenue += club.treasury.totalRevenue;
      totalAvailableBalance += club.treasury.availableBalance;
      totalPendingSettlements += club.treasury.pendingSettlement;

      return {
        clubId: club.id,
        clubSlug: club.slug,
        clubName: club.name,
        category: club.category,
        availableBalance: club.treasury.availableBalance,
        totalRevenue: club.treasury.totalRevenue,
        pendingSettlement: club.treasury.pendingSettlement,
        payoutUpiId: club.treasury.payoutUpiId,
        memberCount: club.memberCount,
        eventsHostedCount: club.eventsHostedCount,
      };
    });

    return {
      totalGrossCampusRevenue,
      totalAvailableBalance,
      totalPendingSettlements,
      totalTransactionsCount: ledgerEntries.length,
      clubBreakdown,
    };
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.CLUBS);
    localStorage.removeItem(STORAGE_KEYS.LEDGER);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.MEETINGS);
    setClubs(SEED_CLUBS);
    setLedgerEntries(SEED_LEDGER_ENTRIES);
    setClubApplications(SEED_CLUB_APPLICATIONS);
    setPayoutRequests(SEED_PAYOUT_REQUESTS);
    setClubMembers(SEED_CLUB_MEMBERS);
    setClubMeetings(SEED_CLUB_MEETINGS);
  };

  // --- INTERNAL CLUB MEMBERS & MEETINGS METHODS ---
  const getClubMembers = (clubIdOrSlug: string): ClubMember[] => {
    const slug = clubIdOrSlug.toLowerCase();
    return clubMembers.filter(m => m.clubId === clubIdOrSlug || m.clubSlug.toLowerCase() === slug);
  };

  const addClubMember = (memberData: Omit<ClubMember, 'id' | 'joinedAt' | 'status'>) => {
    const slug = memberData.clubSlug?.toLowerCase() || '';
    const roll = memberData.rollNo ? memberData.rollNo.trim().toUpperCase() : '';
    const email = memberData.email ? memberData.email.trim().toLowerCase() : '';

    // Check duplicate
    const exists = clubMembers.some(m => 
      (m.clubId === memberData.clubId || m.clubSlug.toLowerCase() === slug) &&
      ((roll && m.rollNo.toUpperCase() === roll) || (email && m.email.toLowerCase() === email))
    );

    if (exists) {
      return { success: false, message: `Student (${roll || email}) is already an active member of this club chapter!` };
    }

    const newMember: ClubMember = {
      ...memberData,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      rollNo: roll,
      email: email,
      joinedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    setClubMembers(prev => [newMember, ...prev]);

    // Increment member count in club
    setClubs(prev => prev.map(c => {
      if (c.id === memberData.clubId || c.slug.toLowerCase() === slug) {
        return { ...c, memberCount: (c.memberCount || 0) + 1 };
      }
      return c;
    }));

    return { 
      success: true, 
      message: `Successfully inducted ${newMember.name} (${newMember.rollNo || newMember.email}) as ${memberData.clubRole}!`,
      member: newMember 
    };
  };

  const removeClubMember = (memberId: string) => {
    const target = clubMembers.find(m => m.id === memberId);
    if (!target) return { success: false, message: 'Member not found.' };

    setClubMembers(prev => prev.filter(m => m.id !== memberId));
    setClubs(prev => prev.map(c => {
      if (c.id === target.clubId || c.slug.toLowerCase() === target.clubSlug.toLowerCase()) {
        return { ...c, memberCount: Math.max(0, (c.memberCount || 1) - 1) };
      }
      return c;
    }));

    return { success: true, message: `Removed ${target.name} from club roster.` };
  };

  const getClubMeetings = (clubIdOrSlug: string): ClubMeeting[] => {
    const slug = clubIdOrSlug.toLowerCase();
    return clubMeetings
      .filter(m => m.clubId === clubIdOrSlug || m.clubSlug.toLowerCase() === slug)
      .sort((a, b) => new Date(b.meetingDateTime).getTime() - new Date(a.meetingDateTime).getTime());
  };

  const scheduleClubMeeting = (meetingData: Omit<ClubMeeting, 'id' | 'createdAt' | 'status'>) => {
    const newMeeting: ClubMeeting = {
      ...meetingData,
      id: `meet_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };

    setClubMeetings(prev => [newMeeting, ...prev]);
    return { 
      success: true, 
      message: `Meeting "${newMeeting.title}" scheduled! Club members will receive instant meeting notifications.`,
      meeting: newMeeting 
    };
  };

  const publishMeetingSummary = (meetingId: string, summary: ClubMeetingSummary) => {
    const meeting = clubMeetings.find(m => m.id === meetingId);
    if (!meeting) return { success: false, message: 'Meeting not found.' };

    setClubMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          status: 'CONCLUDED',
          summary: {
            ...summary,
            publishedAt: new Date().toISOString()
          }
        };
      }
      return m;
    }));

    return { 
      success: true, 
      message: 'Meeting summary (MoM) & action items published! Absent and attending members can now review key takeaways.' 
    };
  };

  const deleteClubMeeting = (meetingId: string) => {
    setClubMeetings(prev => prev.filter(m => m.id !== meetingId));
    return { success: true, message: 'Meeting record deleted.' };
  };

  const isUserMemberOfClub = (clubIdOrSlug: string, userRollNo?: string, userEmail?: string): boolean => {
    if (!userRollNo && !userEmail) return false;
    const target = clubIdOrSlug.toLowerCase();
    const roll = userRollNo?.trim().toLowerCase();
    const email = userEmail?.trim().toLowerCase();

    return clubMembers.some(m => {
      const matchClub = m.clubId.toLowerCase() === target || m.clubSlug.toLowerCase() === target;
      if (!matchClub) return false;
      const matchRoll = roll && m.rollNo.trim().toLowerCase() === roll;
      const matchEmail = email && m.email.trim().toLowerCase() === email;
      return matchRoll || matchEmail;
    });
  };

  const getTodayMeetingsForUser = (userRollNo?: string, userEmail?: string): ClubMeeting[] => {
    if (!userRollNo && !userEmail) return [];
    const roll = userRollNo?.trim().toLowerCase();
    const email = userEmail?.trim().toLowerCase();

    // Find club slugs where user is active member
    const userClubs = new Set(
      clubMembers
        .filter(m => (roll && m.rollNo.trim().toLowerCase() === roll) || (email && m.email.trim().toLowerCase() === email))
        .map(m => m.clubSlug.toLowerCase())
    );

    if (userClubs.size === 0) return [];

    const now = new Date();
    const todayYMD = now.toISOString().split('T')[0];

    return clubMeetings.filter(m => {
      if (!userClubs.has(m.clubSlug.toLowerCase())) return false;
      if (m.status !== 'SCHEDULED') return false;
      const meetDate = new Date(m.meetingDateTime);
      const meetYMD = meetDate.toISOString().split('T')[0];
      return meetYMD === todayYMD;
    });
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      ledgerEntries,
      clubApplications,
      payoutRequests,
      clubMembers,
      clubMeetings,
      getClubBySlug,
      getClubById,
      updateClubProfile,
      getClubLedger,
      requestPayoutSettlement,
      approvePayoutByDean,
      rejectPayoutByDean,
      addClubCoordinator,
      removeClubCoordinator,
      submitJoinApplication,
      reviewJoinApplication,
      getCentralTreasuryStats,
      resetToDefaultData,
      getClubMembers,
      addClubMember,
      removeClubMember,
      getClubMeetings,
      scheduleClubMeeting,
      publishMeetingSummary,
      deleteClubMeeting,
      getTodayMeetingsForUser,
      isUserMemberOfClub,
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
