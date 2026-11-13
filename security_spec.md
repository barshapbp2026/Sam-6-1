# Security Specification — Master PDF & Dafa Summary Store

## 1. Data Invariants
1. **Default Deny**: All paths not explicitly matched are denied by default (`/{document=**}`).
2. **Deterministic Valid IDs**: Every document ID in `/pdf_summaries/{summaryId}`, `/dafa_summaries/{dafaId}`, and `/admins/{adminUid}` must match `^[a-zA-Z0-9_\-]+$` and be <= 128 chars.
3. **No Open Blanket Reads**: `list` and `get` on `pdf_summaries` and `dafa_summaries` enforce `resource.data.isPublic == true` (no PII is stored in these collections; non-public documents are restricted to admins).
4. **Verified Identity & UID Binding**: Write operations (`create`, `update`) require `request.auth != null && request.auth.token.email_verified == true` and `incoming().updatedByUid == request.auth.uid`.
5. **Immutable Audit Fields & Server Timestamps**: `createdAt == request.time` on `create`, `incoming().createdAt == existing().createdAt && incoming().updatedAt == request.time` on `update`, and `docId` is immutable.
6. **Strict Keys & Bounded Payloads**: `hasAll` + `hasOnly` on `create`, `affectedKeys().hasOnly(...)` on `update`, string `.size()` bounds on every string field, and `.size()` bounds on every array field.

## 2. Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `create` on `/pdf_summaries/pdf_1`.
2. Signed-in user with `email_verified: false` creating `/pdf_summaries/pdf_1`.
3. Signed-in user creating `/pdf_summaries/pdf_1` with `updatedByUid` spoofed to another user's UID.
4. Signed-in user creating `/pdf_summaries/bad..id!` with path traversal / invalid characters in docId.
5. Signed-in user creating `/pdf_summaries/pdf_1` with a shadow field `{ isVerifiedAdmin: true }`.
6. Signed-in user creating `/pdf_summaries/pdf_1` with `createdAt` backdated instead of `request.time`.
7. Signed-in user creating `/pdf_summaries/pdf_1` with a 50KB `documentTitle` (> maxLength 500).
8. Signed-in user creating `/pdf_summaries/pdf_1` with `keyPoints` array of 100 items (> 30 limit).
9. Non-owner, non-admin signed-in user updating another user's `/pdf_summaries/pdf_1`.
10. Owner updating `/pdf_summaries/pdf_1` while mutating `createdAt` or `docId`.
11. Non-admin deleting `/dafa_summaries/dafa_1`.
12. Non-admin reading or writing `/admins/victim_uid`.
