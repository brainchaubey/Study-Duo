# Security Specification for StudyDuo

## 1. Data Invariants
- Direct unauthenticated reads and writes are strictly forbidden (`allow read, write: if false` by default).
- The chat is exclusively for two authorized participants (`chamgadar` and `chatgpt`).
- Messages can only be written if senderId matches the authenticated identity and the text is under 2000 characters.
- Incoming payloads cannot contain shadow or ghost fields (`affectedKeys().hasOnly(...)` / strict key enforcement).
- Study progress records are partitioned per participant.

## 2. Dirty Dozen Test Payloads
1. **Unauthenticated Read**: Attempting to read `/messages/{msgId}` without authorization. -> REJECTED
2. **Unauthenticated Write**: Attempting to send a message without authorization. -> REJECTED
3. **Spoofed Sender**: Attempting to write a message with `senderId: "chamgadar"` while authenticated as `chatgpt`. -> REJECTED
4. **Third Party Sender**: Attempting to write a message with `senderId: "malicious_user"`. -> REJECTED
5. **Oversized Text Attack**: Payload with `text.size() > 2000` or 2MB payload. -> REJECTED
6. **Ghost / Shadow Field Injection**: Injecting `{ "isAdmin": true, "verified": true }` into message document. -> REJECTED
7. **Invalid ID Poisoning**: Document ID with invalid characters or exceeding 128 characters. -> REJECTED
8. **Tampering with Conversation ID**: Modifying or sending invalid conversationId. -> REJECTED
9. **Direct Client Scraping**: Blind list query without participant identity constraints. -> REJECTED
10. **Study Progress Hijack**: Attempting to overwrite another participant's syllabus progress. -> REJECTED
11. **Empty Message Write**: Attempting to send `{ text: "" }`. -> REJECTED
12. **Tampering with Creation Timestamps**: Client providing spoofed past or future createdAt without server timestamp validation. -> REJECTED
