/**
 * Phase 0 Red-Team Verification Checklist for firestore.rules.
 * Designed to verify the 12 "Dirty Dozen" denial cases against rules_version = '2'.
 */

export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated create on pdf_summaries', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Unverified email create on pdf_summaries', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Spoofed updatedByUid on create', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Invalid docId format on create', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow field injection on create', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Client-forged createdAt timestamp', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Oversized documentTitle string (>500 chars)', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Unbounded keyPoints array (>30 items)', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Non-owner non-admin update on pdf_summaries', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Mutating immutable createdAt or docId on update', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Non-admin delete on dafa_summaries', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Non-admin access to /admins collection', expected: 'PERMISSION_DENIED' },
] as const;
