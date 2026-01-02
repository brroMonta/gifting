# 🎁 Luxury Gifting App

A gift management application designed to help you track, organize, and remember gifts for the special people in your life. Built with React Native and Expo.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-0.72-blue.svg)
![Expo](https://img.shields.io/badge/Expo-54-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

### 👥 People Management
- Add and organize people you buy gifts for
- Track birthdays (with optional year for age calculation)
- Store relationship types and personal notes
- Group people into categories (Family, Friends, Colleagues)

### 🎁 Gift Maps
- Create private gift idea lists for each person
- Add gift ideas with names, URLs, and notes
- **Share gift maps** with family and friends via unique links
- Others can **reserve items anonymously** (perfect for coordinated gifting)
- Real-time updates when items are reserved

### 📅 Event Tracking
- Track birthdays, holidays, anniversaries, and custom events
- Four-stage gift status workflow: Idea → Shopping → Bought → Delivered
- View upcoming events at a glance
- Automatic countdown to important dates

### 🔔 Smart Notifications
- Local push notifications for upcoming events
- Automated reminders at 30 days, 7 days, and 1 day before events
- Configurable per-event notification preferences

### 📖 Gift History
- Record past gifts (both given and received)
- Attach photos and receipts
- Add product links and notes
- Search and filter by person or direction (gave/received)
- Avoid duplicate gifts by referencing history

### 🗂️ Groups
- Organize people into custom groups
- Bidirectional relationship management
- Quick access to all group members

### 📤 Calendar Export
- One-way export to device calendar
- Keep gift events synchronized with your schedule

## 🎨 Design System

### Luxury Aesthetic
Inspired by high-end jewelry brands (Cartier, Rolex, Tiffany's):

**Color Palette:**
- **Primary**: Deep charcoal navy (`#1a1f2e`)
- **Accent**: Champagne gold (`#c9a961`)
- **Rose Gold**: Available for special highlights
- **Background**: Warm cream/ivory (`#fafaf9`)
- **Surface**: Pure white with elevated cream variations

**Typography:**
- Light weights (300-400) for elegance
- Generous letter spacing for refinement
- Uppercase buttons with extended tracking
- Small caps labels

**Details:**
- Minimal border radius (4-12px)
- Subtle shadows (0.04-0.08 opacity)
- Gold accent borders and dividers
- Sophisticated spacing scale

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type safety and better DX
- **Expo Router** - File-based navigation

### State Management
- **Zustand** - Lightweight state management
- Custom hooks for feature-specific logic

### Backend & Services
- **Firebase Authentication** - User auth with email/password
- **Cloud Firestore** - Real-time NoSQL database
- **Firebase Storage** - Photo and file storage
- **Expo Notifications** - Local push notifications
- **Expo Calendar** - Device calendar integration

### Development Tools
- **React Hook Form** - Form validation and management
- **date-fns** - Date manipulation and formatting

## 📁 Project Structure

```
gifting/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── people/
│   │   │   ├── index.tsx         # People list
│   │   │   ├── [id].tsx          # Person detail
│   │   │   └── add.tsx           # Add person
│   │   ├── events.tsx            # Events list
│   │   └── history.tsx           # History list
│   ├── gift-map/
│   │   └── [personId].tsx        # Gift map (owner view)
│   ├── shared/
│   │   └── [shareToken].tsx      # Shared gift map (public)
│   └── groups/
│       ├── index.tsx             # Groups list
│       └── [id].tsx              # Group detail
│
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── people/
│   │   │   ├── PersonCard.tsx
│   │   │   └── PersonForm.tsx
│   │   ├── gift-maps/
│   │   │   ├── GiftItemCard.tsx
│   │   │   ├── GiftItemForm.tsx
│   │   │   └── ShareLinkModal.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   └── EventForm.tsx
│   │   ├── history/
│   │   │   ├── HistoryCard.tsx
│   │   │   └── HistoryForm.tsx
│   │   └── groups/
│   │       ├── GroupCard.tsx
│   │       └── GroupForm.tsx
│   │
│   ├── store/                    # Zustand stores
│   │   ├── authStore.ts
│   │   ├── peopleStore.ts
│   │   ├── giftMapsStore.ts
│   │   ├── eventsStore.ts
│   │   ├── historyStore.ts
│   │   └── groupsStore.ts
│   │
│   ├── repositories/             # Data access layer
│   │   ├── person.repository.ts
│   │   ├── giftMap.repository.ts
│   │   ├── event.repository.ts
│   │   ├── history.repository.ts
│   │   └── group.repository.ts
│   │
│   ├── services/                 # External services
│   │   ├── firebase.ts
│   │   ├── firestore.service.ts
│   │   ├── storage.service.ts
│   │   ├── notifications.service.ts
│   │   └── calendar.service.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePeople.ts
│   │   ├── useGiftMaps.ts
│   │   ├── useEvents.ts
│   │   ├── useHistory.ts
│   │   └── useGroups.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── person.ts
│   │   ├── giftMap.ts
│   │   ├── giftEvent.ts
│   │   ├── giftHistory.ts
│   │   └── group.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   └── styles/                   # Design system
│       └── theme.ts              # Luxury theme
│
├── assets/                       # Static assets
├── package.json
├── tsconfig.json
├── app.json                      # Expo configuration
└── README.md
```

## 🗄️ Data Model

### Firestore Structure

```
users/{userId}/
├── people/{personId}
│   ├── name: string
│   ├── relationship: string
│   ├── birthdayMonth: number (1-12)
│   ├── birthdayDay: number (1-31)
│   ├── birthdayYear: number | null
│   ├── notes: string
│   ├── groupIds: string[]
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── gift_maps/{giftMapId}
│   ├── personId: string
│   ├── personName: string (denormalized)
│   ├── shareToken: string | null
│   ├── isShared: boolean
│   ├── items: Array<{
│   │     id: string
│   │     name: string
│   │     url: string | null
│   │     notes: string | null
│   │     isReserved: boolean
│   │     reservedAt: timestamp | null
│   │     order: number
│   │   }>
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── gift_events/{eventId}
│   ├── personId: string
│   ├── personName: string (denormalized)
│   ├── eventType: 'birthday' | 'holiday' | 'custom'
│   ├── eventDate: timestamp
│   ├── status: 'idea' | 'shopping' | 'bought' | 'delivered'
│   ├── remindersEnabled: boolean
│   ├── notes: string | null
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── gift_history/{historyId}
│   ├── personId: string
│   ├── personName: string (denormalized)
│   ├── giftName: string
│   ├── direction: 'gave' | 'received'
│   ├── date: timestamp
│   ├── notes: string | null
│   ├── link: string | null
│   ├── photoUrl: string | null
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
└── groups/{groupId}
    ├── name: string
    ├── memberIds: string[] (person IDs)
    ├── createdAt: timestamp
    └── updatedAt: timestamp

shared_gift_maps/{shareToken}/    # Public collection
├── userId: string
├── giftMapId: string
├── personName: string
├── items: Array<{...}>
└── updatedAt: timestamp
```

### Key Design Decisions

**Gift Map Items as Array:** Embedded array for better performance and offline support

**Denormalization:** Person names stored in events/history/maps to avoid complex queries

**Shared Maps Duplication:** Separate collection for public access without authentication

**Bidirectional Relationships:** Groups maintain memberIds, persons maintain groupIds

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Simulator** (macOS) or **Android Emulator**
- **Expo Go app** (for testing on physical devices)

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Create a **Firestore Database** in production mode
4. Enable **Firebase Storage** for photo uploads
5. Copy your Firebase config

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gifting-app.git
   cd gifting-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**

   Create `src/config/firebase.config.ts`:
   ```typescript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Deploy Firestore Security Rules:**

   In Firebase Console → Firestore → Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;

         match /{document=**} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }

       // Shared gift maps are publicly readable
       match /shared_gift_maps/{shareToken} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

5. **Deploy Storage Security Rules:**

   In Firebase Console → Storage → Rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/history_photos/{photoId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Start the development server:**
   ```bash
   npx expo start
   ```

7. **Run on a device:**
   - Scan QR code with **Expo Go** app (iOS/Android)
   - Press `i` for **iOS Simulator**
   - Press `a` for **Android Emulator**

## 📱 Usage

### Creating Your First Person

1. Tap the **People** tab
2. Tap **+ Add** button
3. Fill in name and relationship
4. Optionally add birthday (month, day, year)
5. Add notes about preferences, sizes, etc.
6. Tap **Add Person**

### Creating a Gift Map

1. Open a person's detail page
2. Tap **Gift Map**
3. Tap **+ Add Gift Item**
4. Add gift name, URL, and notes
5. Save the item

### Sharing a Gift Map

1. Open a gift map
2. Tap **Share Gift Map**
3. Copy the share link
4. Send to family/friends via text or email
5. Recipients can view and reserve items anonymously

### Setting Up Event Reminders

1. Go to **Events** tab
2. Tap **+ Add**
3. Select person and event type
4. Choose date
5. Enable **Reminders**
6. You'll receive notifications at 30d, 7d, and 1d before

### Recording Gift History

1. Go to **History** tab
2. Tap **+ Add**
3. Select person
4. Enter gift name and direction (gave/received)
5. Add photo, link, and notes
6. Save

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Start with cleared cache
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Code Style

- **TypeScript** for type safety
- **Functional components** with hooks
- **Zustand** for state management
- **Repository pattern** for data access
- **Custom hooks** for business logic

### Adding a New Feature

1. **Define types** in `src/types/`
2. **Create repository** in `src/repositories/`
3. **Create Zustand store** in `src/store/`
4. **Create custom hook** in `src/hooks/`
5. **Build UI components** in `src/components/`
6. **Create screen** in `app/`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Log in and log out
- [ ] Create, edit, delete people
- [ ] Add birthday with and without year
- [ ] Create gift maps with items
- [ ] Generate and test share links
- [ ] Reserve items on shared maps
- [ ] Create events with different types
- [ ] Verify notifications trigger
- [ ] Add history with photos
- [ ] Create and manage groups
- [ ] Add/remove members from groups
- [ ] Export events to calendar
- [ ] Test offline functionality

### Testing Notifications

1. Create an event for tomorrow
2. Enable reminders
3. Set device time forward 23 hours
4. Verify notification appears

## 📦 Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## 🔐 Security Considerations

### Authentication
- Email/password authentication via Firebase
- No user data stored in AsyncStorage
- Secure token management by Firebase SDK

### Data Privacy
- User data isolated per Firebase Auth UID
- Firestore security rules enforce user boundaries
- Shared gift maps use UUID tokens (not user IDs)

### Best Practices
- Never commit `firebase.config.ts` to version control
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize URLs before opening

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by **Cartier**, **Rolex**, and **Tiffany & Co.**
- Built with **React Native** and **Expo**
- Backend powered by **Firebase**
- Icons from **Expo Icons**

## 📞 Support

If you have any questions or need help:

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/gifting-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/gifting-app/discussions)

## 🗺️ Roadmap

- [ ] Add web version using React Native Web
- [ ] Implement push notifications (FCM)
- [ ] Add social authentication (Google, Apple)
- [ ] Create gift recommendations AI
- [ ] Add collaborative shopping lists
- [ ] Integrate with Amazon/shopping APIs
- [ ] Add budget tracking
- [ ] Create gift wrapping tracker
- [ ] Add multi-language support
- [ ] Dark mode

---

**Made with ❤️ and attention to detail**
