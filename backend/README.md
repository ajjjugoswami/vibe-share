# vibecheck Backend API

A Supabase-powered backend for the vibecheck music playlist sharing platform.

## Tech Stack

- **Backend**: Supabase (Lovable Cloud)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage (for future profile images)
- **Edge Functions**: Deno-based serverless functions

## Database Schema

### Users (via Supabase Auth)
Managed by Supabase Auth with additional profile data:
```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Playlists
```sql
playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_gradient TEXT DEFAULT 'from-purple-800 to-pink-900',
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Songs (Song Links)
```sql
songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT NOT NULL,
  thumbnail TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Playlist Likes
```sql
playlist_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, playlist_id)
)
```

### Saved Playlists
```sql
saved_playlists (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, playlist_id)
)
```

### User Follows
```sql
user_follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
)
```

## API Endpoints

### Authentication (Supabase Auth)
- `supabase.auth.signUp()` - Create new user
- `supabase.auth.signInWithPassword()` - User login
- `supabase.auth.signOut()` - User logout
- `supabase.auth.getUser()` - Get current user

### Playlists (via Supabase Client)
```typescript
// Get all public playlists
supabase.from('playlists').select('*').eq('is_public', true)

// Get user's playlists
supabase.from('playlists').select('*').eq('user_id', userId)

// Create playlist
supabase.from('playlists').insert({ title, description, tags, ... })

// Update playlist
supabase.from('playlists').update({ title, ... }).eq('id', playlistId)

// Delete playlist
supabase.from('playlists').delete().eq('id', playlistId)
```

### Songs (via Supabase Client)
```typescript
// Get songs for playlist
supabase.from('songs').select('*').eq('playlist_id', playlistId).order('position')

// Add song to playlist
supabase.from('songs').insert({ playlist_id, title, artist, url, platform, ... })

// Remove song
supabase.from('songs').delete().eq('id', songId)

// Reorder songs
supabase.from('songs').update({ position: newPosition }).eq('id', songId)
```

## Row Level Security (RLS)

### Playlists
- SELECT: Public playlists visible to all, private only to owner
- INSERT: Authenticated users can create their own playlists
- UPDATE: Only playlist owner can update
- DELETE: Only playlist owner can delete

### Songs
- SELECT: Inherits from playlist visibility
- INSERT/UPDATE/DELETE: Only playlist owner

### Likes & Saves
- SELECT: Users can see their own likes/saves
- INSERT/DELETE: Users can like/save any public playlist

## Supported Music Platforms

Song links support automatic platform detection:
- YouTube (youtube.com, youtu.be)
- Spotify (open.spotify.com)
- SoundCloud (soundcloud.com)
- Apple Music (music.apple.com)
- Deezer (deezer.com)
- Tidal (tidal.com)

YouTube links automatically fetch thumbnail previews.

## Tags System

Playlists support up to 5 tags for categorization:
- Tags are stored as a PostgreSQL array
- Suggested tags: chill, vibes, workout, study, party, roadtrip, lofi, hiphop, indie, electronic, rnb, pop, rock, jazz, classical, motivation, sleep, focus

## Console Logging (Development)

All data operations are logged for development:
```javascript
console.log('[PLAYLIST_CREATED]', { playlist, timestamp })
console.log('[SONG_ADDED]', { playlistId, song, timestamp })
console.log('[USER_LOGIN]', { email, timestamp })
console.log('[PLAYLIST_LIKED]', { playlistId, userId, timestamp })
```

## Getting Started

1. Enable Lovable Cloud in your project
2. Run the database migrations
3. Configure authentication settings
4. Start building!

## Future Enhancements

- [ ] Real-time playlist collaboration
- [ ] Music recommendation engine
- [ ] Social sharing with OG previews
- [ ] Playlist embedding for external sites
- [ ] Import from Spotify/Apple Music
- [ ] Analytics dashboard for creators

---

Made with 💜 for vibecheck
