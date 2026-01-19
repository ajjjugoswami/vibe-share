# vibecheck Backend API

A Node.js backend for the vibecheck music sharing platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (recommended)
- **Database**: PostgreSQL (recommended) or MongoDB
- **Authentication**: JWT tokens

## API Endpoints (Planned)

### Authentication
```
POST /api/auth/register    - Create new user account
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
GET  /api/auth/me          - Get current user
```

### Users
```
GET    /api/users/:id           - Get user profile
PUT    /api/users/:id           - Update user profile
GET    /api/users/:id/playlists - Get user's playlists
POST   /api/users/:id/follow    - Follow a user
DELETE /api/users/:id/follow    - Unfollow a user
```

### Playlists
```
GET    /api/playlists           - Get all playlists (paginated)
GET    /api/playlists/trending  - Get trending playlists
POST   /api/playlists           - Create new playlist
GET    /api/playlists/:id       - Get playlist by ID
PUT    /api/playlists/:id       - Update playlist
DELETE /api/playlists/:id       - Delete playlist
POST   /api/playlists/:id/like  - Like a playlist
```

### Songs
```
GET    /api/songs/trending      - Get trending songs
POST   /api/playlists/:id/songs - Add song to playlist
DELETE /api/playlists/:id/songs/:songId - Remove song from playlist
```

## Data Models

### User
```javascript
{
  id: String,
  username: String,
  email: String,
  password: String (hashed),
  bio: String,
  avatarUrl: String,
  followers: [UserId],
  following: [UserId],
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist
```javascript
{
  id: String,
  title: String,
  description: String,
  coverUrl: String,
  creator: UserId,
  songs: [SongId],
  likes: Number,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Song
```javascript
{
  id: String,
  title: String,
  artist: String,
  album: String,
  duration: Number,
  externalUrl: String,  // Spotify/Apple Music link
  addedBy: UserId,
  plays: Number,
  createdAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file:
```env
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Console Logging (For Development)

Currently, all data operations are logged to console for development purposes:

```javascript
// Example: When a user creates a playlist
console.log('[PLAYLIST_CREATED]', {
  userId: user.id,
  playlistId: newPlaylist.id,
  title: newPlaylist.title,
  timestamp: new Date().toISOString()
});

// Example: When a user follows another user
console.log('[USER_FOLLOWED]', {
  followerId: currentUser.id,
  followedId: targetUser.id,
  timestamp: new Date().toISOString()
});

// Example: When trending data is fetched
console.log('[TRENDING_FETCH]', {
  type: 'playlists',
  count: results.length,
  timestamp: new Date().toISOString()
});
```

## Future Enhancements

- [ ] Integration with Spotify API for song metadata
- [ ] Real-time notifications via WebSocket
- [ ] Music recommendation engine
- [ ] Social sharing features
- [ ] Analytics dashboard for creators

---

Made with 💜 for vibecheck
