// CampusSphere - Master TypeScript Type Definitions
// Platform: Arya College of Engineering & IT (ACEIT), Jaipur

export type UserRole = 'STUDENT' | 'CLUB_ADMIN' | 'SUPER_ADMIN';

export interface StudentProfile {
  rollNo: string;
  enrollmentNo?: string;
  department: string;
  semester: number;
  batch: number;
  phone: string;
  interests: string[];
  activityPointsTotal: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  administeredClubId?: string; // If CLUB_ADMIN, the club slug/id they manage
  facultyDesignation?: string;  // If faculty or SUPER_ADMIN
  studentProfile?: StudentProfile;
  createdAt: string;
}

export type ClubCategory = 
  | 'Science & Tech' 
  | 'Coding / Dev' 
  | 'Hackathons' 
  | 'Gaming / Esports' 
  | 'Cultural' 
  | 'Social Welfare' 
  | 'Literary' 
  | 'Aerospace' 
  | 'Robotics' 
  | 'Industrial Automation' 
  | 'Sustainability' 
  | 'Music' 
  | 'Mind Sports' 
  | 'AIoT / Sensors' 
  | 'Open Source';

export interface ClubTreasury {
  totalRevenue: number;
  availableBalance: number;
  pendingSettlement: number;
  payoutUpiId: string;
}

export interface ClubCoordinator {
  id: string;
  name: string;
  designation: string; // e.g. "President", "Vice President", "Technical Lead", "PR & Outreach Lead"
  email: string;
  phone?: string;
  rollNo?: string;
  department?: string;
  year?: number;
  avatarUrl?: string;
}

export interface ClubApplication {
  id: string;
  clubId: string;
  clubName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRollNo: string;
  department: string;
  semester: number;
  statementOfPurpose: string;
  preferredRole: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface PayoutSettlementRequest {
  id: string;
  clubId: string;
  clubName: string;
  requestedByUserId: string;
  requestedByUserName: string;
  amount: number;
  payoutUpiId: string;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  requestedAt: string;
  disbursedAt?: string;
  referenceNumber: string;
  deanApprovalStatus: 'PENDING' | 'APPROVED';
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  category: ClubCategory;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  facultyCoordinator: string;
  studentLeads: string[];
  coordinators?: ClubCoordinator[];
  recruitmentStatus?: 'OPEN' | 'CLOSED';
  meetingSchedule?: string;
  treasury: ClubTreasury;
  memberCount: number;
  eventsHostedCount: number;
  socialLinks: {
    github?: string;
    instagram?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
  };
  createdAt: string;
}

export interface Venue {
  id: string;
  code: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
  isActive: boolean;
}

export type EventStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'LIVE' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type RegistrationType = 'SOLO' | 'TEAM';

export interface EventSchedule {
  startTime: string;
  endTime: string;
  registrationDeadline: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  clubId: string;
  clubName: string;
  clubLogoUrl?: string;
  category: string;
  tags: string[];
  shortSummary: string;
  descriptionMarkdown?: string;
  bannerImage?: string;
  venueId: string;
  venueName?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  schedule?: EventSchedule;
  registrationType?: RegistrationType;
  minTeamSize?: number;
  maxTeamSize?: number;
  teamSizeLimits?: {
    min: number;
    max: number;
  };
  isPaid?: boolean;
  ticketPrice?: number;
  maxCapacity?: number;
  registeredCount?: number;
  waitlistCount?: number;
  ticketing?: {
    isPaid: boolean;
    ticketPrice: number;
    maxCapacity: number;
    registeredCount: number;
    waitlistAllowed: boolean;
    waitlistCount: number;
  };
  activityPointsAwarded: number; // AICTE / RTU Activity Points
  status: EventStatus;
  approvedBy?: string;
  approvalComments?: string;
  approvedAt?: string;
  approvalAudit?: {
    approvedBy: string;
    approvedAt: string;
    comments?: string;
  };
  createdAt?: string;
}

export interface Ticket {
  ticketNumber: string;
  hmacSeed: string;
  issuedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  clubId?: string;
  clubName?: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRollNo?: string;
  department?: string;
  semester?: number;
  registrationType: RegistrationType;
  teamName?: string;
  teamCode?: string;
  teamPasscode?: string;
  teamMembers?: string[];
  isCaptain?: boolean;
  status?: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  ticket?: Ticket;
  ticketNumber?: string;
  hmacSecretSeed?: string;
  ticketPrice?: number;
  amountPaid: number;
  paymentId?: string;
  paymentStatus?: string;
  attendanceVerified: boolean;
  attendanceVerifiedAt?: string;
  checkedInAt?: string;
  scannedByAdminId?: string;
  feedbackSubmitted?: boolean;
  certificateClaimed?: boolean;
  activityPointsAwarded?: number;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  registrationId: string;
  eventId: string;
  eventTitle: string;
  clubId: string;
  clubName: string;
  payerUserId: string;
  payerName: string;
  amountInr: number;
  gatewayFeeInr: number;
  netCreditedToClub: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export interface ClubLedgerEntry {
  id: string;
  clubId: string;
  clubName?: string;
  paymentId?: string;
  eventId?: string;
  eventTitle?: string;
  type: 'TICKET_SALE' | 'PAYOUT_DISBURSEMENT' | 'REFUND';
  creditAmount: number;
  debitAmount: number;
  gatewayFee?: number;
  netAmount?: number;
  runningBalance: number;
  remarks: string;
  timestamp: string;
  referenceId?: string;
  status?: 'SETTLED' | 'PENDING' | 'FAILED';
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rollNo?: string;
  ticketNumber: string;
  scannedByAdminId: string;
  scanMethod: 'DYNAMIC_QR_SCANNER' | 'MANUAL_OVERRIDE';
  checkedInAt: string;
}

export interface FeedbackRatings {
  contentDepth: number; // 1-5
  organization: number; // 1-5
  speakerQuality: number; // 1-5
  venueFacilities: number; // 1-5
  valueForTime: number; // 1-5
  overallAverage: number;
}

export interface VerifiedFeedback {
  id: string;
  eventId: string;
  clubId?: string;
  userId: string;
  studentName: string;
  studentRollNo: string;
  ratings: FeedbackRatings;
  comments: string;
  strengths?: string;
  areasOfImprovement?: string;
  sentimentLabel: 'POSITIVE' | 'NEUTRAL' | 'CONSTRUCTIVE';
  sentimentScore: number;
  submittedAt: string;
}

export interface EventFeedbackSummary {
  eventId: string;
  totalReviews?: number;
  totalVerifiedReviews?: number;
  averageOverall?: number;
  averageOverallRating?: number;
  averageContentDepth: number;
  averageOrganization: number;
  averageSpeakerQuality: number;
  averageVenueFacilities: number;
  averageValueForTime: number;
  positiveCount?: number;
  neutralCount?: number;
  constructiveCount?: number;
  positivePercentage?: number;
  reviews?: any[];
  recentReviews?: VerifiedFeedback[];
}

export type SuggestionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'PLANNED' | 'IMPLEMENTED';

export interface StudentSuggestion {
  id: string;
  eventId: string;
  eventTitle?: string;
  clubId: string;
  clubName?: string;
  authorUserId: string;
  authorName: string;
  authorRollNo?: string;
  title: string;
  description: string;
  upvotesCount: number;
  upvotedByUserIds: string[];
  kanbanStatus: SuggestionStatus;
  respondedByAdminId?: string;
  respondedByAdminName?: string;
  clubActionResponseText?: string;
  proofImageUrl?: string;
  resolvedAt?: string;
  createdAt: string;
}

// Backwards compatibility alias
export type Suggestion = StudentSuggestion;

export interface Certificate {
  id: string;
  certificateId: string; // e.g. CS-ARYA-2026-HACK-0142
  verificationHash: string; // SHA-256 seal
  eventId: string;
  eventTitle: string;
  eventCategory?: string;
  clubId?: string;
  organizingClub: string;
  userId: string;
  studentName: string;
  rollNo: string;
  department?: string;
  semester?: number;
  activityPointsAwarded: number;
  deanSignatory: string;
  institution?: string;
  publicVerifyUrl: string;
  issuedAt?: string;
  issueDate?: string;
}

export interface AicteTranscript {
  userId: string;
  studentName: string;
  rollNo: string;
  department: string;
  semester: number;
  batch: number;
  totalActivityPointsEarned: number;
  requiredHonorsPoints: number;
  honorsEligible: boolean;
  completionPercentage: number;
  categoryPointsBreakdown: Record<string, number>;
  earnedCertificates: Certificate[];
  certifiedBy: string;
  generatedAt: string;
}

export interface AicteActivityRecord {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  category: string;
  pointsEarned: number;
  verifiedAt: string;
  certificateId: string;
}

// --- PHASE 6: AI INTELLIGENCE & 3D DIGITAL TWIN TYPES ---
export interface AiEventDraft {
  prompt: string;
  clubId?: string;
  category?: string;
  suggestedTitle: string;
  shortSummary: string;
  descriptionMarkdown: string;
  suggestedCategory: string;
  tags: string[];
  suggestedPoints: number;
  idealVenueName: string;
  recommendedCapacity: number;
  agendaMarkdown?: string;
}

export interface AiActionLink {
  label: string;
  url: string;
  type: string;
}

export interface AiChatResponse {
  query: string;
  reply: string;
  intent: string;
  actionLinks: AiActionLink[];
  quickFollowUps: string[];
}

export interface CampusBeacon {
  id: string;
  venueId: string;
  venueName: string;
  buildingName: string;
  position: [number, number, number]; // x, y, z in Three.js coordinates
  color: string;
  activeEventsCount: number;
  featuredEventTitle?: string;
  featuredCategory?: string;
  capacity?: number;
  slug?: string;
}

