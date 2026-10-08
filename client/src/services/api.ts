// CampusSphere - Live Spring Boot & MongoDB Atlas API Service
// Replaces static client seed data with live backend persistence

import { 
  Club, 
  Venue, 
  Event, 
  ClubLedgerEntry, 
  PayoutSettlementRequest, 
  Registration,
  VerifiedFeedback,
  EventFeedbackSummary,
  StudentSuggestion,
  Certificate,
  AicteTranscript,
  SuggestionStatus,
  AiEventDraft,
  AiActionLink,
  AiChatResponse
} from '../types';

const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE = envApiUrl ? `${envApiUrl.replace(/\/$/, '')}/api` : '/api';

export interface VenueClashResult {
  clash: boolean;
  conflictingEventId?: string;
  conflictingEventTitle?: string;
  conflictingClubName?: string;
  conflictingSchedule?: string;
  bufferExplanation?: string;
  alternativeVenues?: Venue[];
}

export interface EventProposalPayload {
  title: string;
  clubId: string;
  category: string;
  tags?: string[];
  shortSummary: string;
  descriptionMarkdown?: string;
  bannerImage?: string;
  venueId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  registrationDeadline?: string;
  registrationType?: 'SOLO' | 'TEAM';
  minTeamSize?: number;
  maxTeamSize?: number;
  isPaid?: boolean;
  ticketPrice?: number;
  maxCapacity: number;
  activityPointsAwarded: number;
}

// --- CLUBS API ---
export async function fetchClubs(): Promise<Club[]> {
  const res = await fetch(`${API_BASE}/clubs`);
  if (!res.ok) throw new Error(`Failed to fetch clubs: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchClubBySlug(slug: string): Promise<Club> {
  const res = await fetch(`${API_BASE}/clubs/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch club ${slug}: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

// --- VENUES API ---
export async function fetchVenues(): Promise<Venue[]> {
  const res = await fetch(`${API_BASE}/venues`);
  if (!res.ok) throw new Error(`Failed to fetch venues: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

// --- VENUE CLASH & BUFFER ENGINE ---
export async function checkVenueClash(payload: {
  venueId: string;
  startTime: string;
  endTime: string;
  excludeEventId?: string;
}): Promise<VenueClashResult> {
  const res = await fetch(`${API_BASE}/venues/check-clash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Clash check failed: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

// --- EVENTS API ---
export async function fetchEvents(params?: {
  status?: string;
  clubId?: string;
  category?: string;
}): Promise<Event[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.clubId) searchParams.set('clubId', params.clubId);
  if (params?.category) searchParams.set('category', params.category);

  const url = `${API_BASE}/events${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchEventById(id: string): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch event: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export async function proposeEvent(payload: EventProposalPayload): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/propose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to propose event (${res.status})`);
  }
  return json.data;
}

export async function approveEvent(
  id: string,
  deanId = 'dean_office_01',
  comments = 'Sanctioned by Dean Office. Venue reservation confirmed.'
): Promise<Event> {
  const res = await fetch(
    `${API_BASE}/events/${id}/approve?deanId=${encodeURIComponent(deanId)}&comments=${encodeURIComponent(comments)}`,
    { method: 'PUT' }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to approve event: ${res.statusText}`);
  }
  return json.data;
}

export async function rejectEvent(
  id: string,
  deanId = 'dean_office_01',
  comments: string
): Promise<Event> {
  const res = await fetch(
    `${API_BASE}/events/${id}/reject?deanId=${encodeURIComponent(deanId)}&comments=${encodeURIComponent(comments)}`,
    { method: 'PUT' }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to reject event: ${res.statusText}`);
  }
  return json.data;
}

// --- TREASURY & LEDGER API ---
export async function fetchClubLedger(clubId: string): Promise<ClubLedgerEntry[]> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/ledger`);
  if (!res.ok) throw new Error(`Failed to fetch ledger for club ${clubId}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchPayoutRequests(): Promise<PayoutSettlementRequest[]> {
  const res = await fetch(`${API_BASE}/clubs/payout-requests`);
  if (!res.ok) throw new Error(`Failed to fetch payout requests`);
  const json = await res.json();
  return json.data || [];
}

export async function requestPayout(payload: {
  clubId: string;
  requestedByUserId: string;
  requestedByUserName: string;
  amount: number;
  payoutUpiId: string;
}): Promise<PayoutSettlementRequest> {
  const res = await fetch(`${API_BASE}/clubs/payout-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Payout request failed`);
  }
  return json.data;
}

export async function approvePayoutRequest(
  requestId: string,
  deanId = 'dean_office_01'
): Promise<PayoutSettlementRequest> {
  const res = await fetch(
    `${API_BASE}/clubs/payout-requests/${requestId}/approve?deanId=${encodeURIComponent(deanId)}`,
    { method: 'PUT' }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Payout approval failed`);
  }
  return json.data;
}

// --- SUPER ADMIN AUDIT API ---
export async function fetchSuperAdminAudit(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/audit-summary`);
  if (!res.ok) throw new Error(`Failed to fetch super admin audit data`);
  const json = await res.json();
  return json.data;
}

// --- REGISTRATION & TICKET PASS API (PHASE 4 - LIVE MONGODB ATLAS) ---
export interface RegistrationRequestPayload {
  eventId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userRollNo?: string;
  department?: string;
  semester?: number;
  registrationType?: 'SOLO' | 'TEAM';
  teamName?: string;
  teamPasscode?: string;
  teamMembers?: string[];
  paymentId?: string;
}

export interface GateVerificationRequestPayload {
  ticketNumber: string;
  hmacSignature?: string;
  timestampWindow?: number;
  adminId?: string;
  gateLocation?: string;
}

export interface GateVerificationResult {
  verified: boolean;
  alreadyCheckedIn: boolean;
  message: string;
  studentName?: string;
  studentRollNo?: string;
  department?: string;
  eventTitle?: string;
  ticketNumber?: string;
  activityPointsAwarded?: number;
  checkedInAt?: string;
  registration?: Registration;
}

export async function registerForEvent(payload: RegistrationRequestPayload): Promise<Registration> {
  const res = await fetch(`${API_BASE}/registrations/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Registration failed (${res.status})`);
  }
  return json.data;
}

export async function verifyGateTicket(payload: GateVerificationRequestPayload): Promise<GateVerificationResult> {
  const res = await fetch(`${API_BASE}/registrations/verify-gate-ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Gate verification failed (${res.status})`);
  }
  return json.data;
}

export async function fetchUserPasses(userId: string): Promise<Registration[]> {
  const res = await fetch(`${API_BASE}/registrations/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch user passes`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchEventAttendees(eventId: string): Promise<Registration[]> {
  const res = await fetch(`${API_BASE}/registrations/event/${eventId}`);
  if (!res.ok) throw new Error(`Failed to fetch event attendees`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchClubAttendees(clubId: string): Promise<Registration[]> {
  const res = await fetch(`${API_BASE}/registrations/club/${clubId}`);
  if (!res.ok) throw new Error(`Failed to fetch club attendees`);
  const json = await res.json();
  return json.data || [];
}

// --- ATTENDANCE-GATED VERIFIED FEEDBACK API (PHASE 5) ---
export interface FeedbackSubmissionPayload {
  eventId: string;
  userId: string;
  contentDepth: number; // 1-5
  organization: number; // 1-5
  speakerQuality: number; // 1-5
  venueFacilities: number; // 1-5
  valueForTime: number; // 1-5
  comments: string;
  strengths?: string;
  areasOfImprovement?: string;
}

export interface SuggestionSubmissionPayload {
  eventId: string;
  clubId: string;
  userId: string;
  title: string;
  description: string;
}

export interface KanbanStatusUpdatePayload {
  suggestionId: string;
  newStatus: SuggestionStatus;
  adminId: string;
  adminName: string;
  responseText?: string;
  proofImageUrl?: string;
}

export async function submitFeedback(payload: FeedbackSubmissionPayload): Promise<VerifiedFeedback> {
  const res = await fetch(`${API_BASE}/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Feedback submission failed (${res.status})`);
  }
  return json.data;
}

export async function fetchEventFeedbackSummary(eventId: string): Promise<EventFeedbackSummary> {
  const res = await fetch(`${API_BASE}/feedback/event/${eventId}/summary`);
  if (!res.ok) throw new Error(`Failed to fetch event feedback summary`);
  const json = await res.json();
  return json.data;
}

export async function fetchEventFeedbacks(eventId: string): Promise<VerifiedFeedback[]> {
  const res = await fetch(`${API_BASE}/feedback/event/${eventId}`);
  if (!res.ok) throw new Error(`Failed to fetch event reviews`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchUserFeedbackForEvent(userId: string, eventId: string): Promise<VerifiedFeedback | null> {
  const res = await fetch(`${API_BASE}/feedback/user/${userId}/event/${eventId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch user feedback`);
  const json = await res.json();
  return json.data;
}

// --- "YOU SAID, WE DID" SUGGESTIONS & KANBAN API (PHASE 5) ---
export async function submitSuggestion(payload: SuggestionSubmissionPayload): Promise<StudentSuggestion> {
  const res = await fetch(`${API_BASE}/suggestions/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to submit suggestion`);
  }
  return json.data;
}

export async function upvoteSuggestion(suggestionId: string, userId: string): Promise<StudentSuggestion> {
  const res = await fetch(`${API_BASE}/suggestions/${suggestionId}/upvote?userId=${encodeURIComponent(userId)}`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to upvote suggestion`);
  }
  return json.data;
}

export async function updateKanbanStatus(payload: KanbanStatusUpdatePayload): Promise<StudentSuggestion> {
  const res = await fetch(`${API_BASE}/suggestions/${payload.suggestionId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to update Kanban status`);
  }
  return json.data;
}

export async function fetchClubSuggestions(clubId: string): Promise<StudentSuggestion[]> {
  const res = await fetch(`${API_BASE}/suggestions/club/${clubId}`);
  if (!res.ok) throw new Error(`Failed to fetch club suggestions`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchEventSuggestions(eventId: string): Promise<StudentSuggestion[]> {
  const res = await fetch(`${API_BASE}/suggestions/event/${eventId}`);
  if (!res.ok) throw new Error(`Failed to fetch event suggestions`);
  const json = await res.json();
  return json.data || [];
}

// --- CRYPTOGRAPHIC CERTIFICATES & AICTE TRANSCRIPT API (PHASE 5) ---
export async function claimCertificate(eventId: string, userId: string): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/claim?eventId=${encodeURIComponent(eventId)}&userId=${encodeURIComponent(userId)}`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to claim certificate`);
  }
  return json.data;
}

export async function fetchUserCertificates(userId: string): Promise<Certificate[]> {
  const res = await fetch(`${API_BASE}/certificates/user/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch user certificates`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchEventCertificates(eventId: string): Promise<Certificate[]> {
  const res = await fetch(`${API_BASE}/certificates/event/${encodeURIComponent(eventId)}`);
  if (!res.ok) throw new Error(`Failed to fetch event certificates`);
  const json = await res.json();
  return json.data || [];
}

export async function verifyCertificatePublic(certificateId: string): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(certificateId)}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Certificate verification failed`);
  }
  return json.data;
}

export async function fetchAicteTranscript(userId: string): Promise<AicteTranscript> {
  const res = await fetch(`${API_BASE}/certificates/transcript/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch AICTE transcript`);
  const json = await res.json();
  return json.data;
}

// --- PHASE 6: AI INTELLIGENCE SUITE API ---
export async function generateAiEventDraft(payload: { prompt: string; clubId?: string; category?: string }): Promise<AiEventDraft> {
  const res = await fetch(`${API_BASE}/ai/copilot/generate-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to generate AI event draft');
  }
  return json.data;
}

export async function sendConciergeChat(payload: { query: string; userId?: string }): Promise<AiChatResponse> {
  const res = await fetch(`${API_BASE}/ai/concierge/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to get concierge response');
  }
  return json.data;
}

export async function fetchAiRecommendations(userId = 'arya_student_01'): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/ai/recommendations/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch AI recommendations');
  const json = await res.json();
  return json.data || [];
}



