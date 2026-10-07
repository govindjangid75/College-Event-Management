import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Club, 
  ClubLedgerEntry, 
  ClubApplication, 
  PayoutSettlementRequest, 
  ClubCoordinator 
} from '../types';
import { 
  SEED_CLUBS, 
  SEED_LEDGER_ENTRIES, 
  SEED_CLUB_APPLICATIONS, 
  SEED_PAYOUT_REQUESTS 
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
}

const STORAGE_KEYS = {
  CLUBS: 'campussphere_clubs_v3',
  LEDGER: 'campussphere_ledger_v3',
  APPLICATIONS: 'campussphere_club_apps_v3',
  PAYOUTS: 'campussphere_payout_reqs_v3',
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
    setClubs(SEED_CLUBS);
    setLedgerEntries(SEED_LEDGER_ENTRIES);
    setClubApplications(SEED_CLUB_APPLICATIONS);
    setPayoutRequests(SEED_PAYOUT_REQUESTS);
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      ledgerEntries,
      clubApplications,
      payoutRequests,
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
