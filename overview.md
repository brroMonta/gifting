Project Overview

I am building a cross-platform mobile app (iOS + Android) that helps users remember and organize gifting:

- who they buy gifts for
- when gifts are needed
- what they've already given
- and optionally avoid duplicate gifts through shared lists

The app is private-first, with optional sharing. This is a clearly defined MVP with frozen scope.

---

Core Product Promise

"This app remembers gifting for me — who, when, and what — and helps me avoid duplicate gifts."

All implementation decisions should support this promise.

---

Target Users

Organized but overwhelmed adults (primarily women 35–55) managing gifting for:

- children
- extended family
- blended families / co-parents
- friends and social circles

This is a consumer app, not enterprise software.

---

Platform & Tech Preferences

- Frontend: Flutter (single codebase for iOS + Android)
- Backend: Firebase (Auth, Firestore, Storage)
- Notifications: Local notifications (push optional for MVP)
- Repo: GitHub (client-owned)
- Design: Figma (provided separately)

---

MVP FEATURES — IN SCOPE ONLY

## 1. People

Users can create and manage people they buy gifts for.

**Fields**

- Name
- Relationship (free text)
- Birthday (month/day; year optional)
- Notes

---

## 2. Gift Maps (Critical Feature)

Each person has a Gift Map (a list of gift ideas).

**Gift Map items include**

- Item name
- URL link
- Notes (size, color, etc.)
- Reserved status (yes/no)

**Behavior**

- Gift Maps are private by default
- User may generate a shareable link
- Shared link is view-only
- Viewers can mark an item as "Reserved"
- Reserved items show as "Reserved" to other viewers
- Gift Map owner does NOT see who reserved items (surprise-safe)

---

## 3. Gift Events

Events represent when a gift is needed.

**Fields**

- Event type (Birthday, Holiday, Custom)
- Event date
- Status:
  - Idea
  - Shopping
  - Bought
  - Delivered

**Behavior**

- Events are tied to one person
- Events appear on the dashboard sorted by date

---

## 4. Reminders

Simple, reliable reminders.

**MVP rules**

- Default reminders at:
  - 30 days before
  - 7 days before
  - 1 day before
- Fixed send time (e.g., 9:00 AM local)
- User can toggle reminders on/off per event
- Local notifications are sufficient for MVP

---

## 5. Gift History

Tracks past gifts to avoid repeats.

**Two directions**

- Gifts the user gave the person
- Gifts the person gave the user

**Fields**

- Gift name
- Date
- Notes
- Optional link
- Optional photo upload

---

## 6. Groups (Light Version)

Minimal grouping functionality.

**Includes**

- Create groups (e.g., "Family")
- Add people to groups
- View individual Gift Maps of group members

**Does NOT include**

- Group gift events
- Group budgets
- Messaging or chat

---

## 7. Calendar Add (One-Way Only)

Convenience feature.

**Behavior**

- Button to "Add to calendar"
- Creates a single event such as "Buy gift for Mom"
- One-way only (no syncing back)
- No editing or deletion required inside the app
