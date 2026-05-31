# C2C Messaging Marketplace

A marketplace app built with Next.js, Prisma, NextAuth, Cloudinary image upload, and real-time messaging via Pusher.

## Features

- Email/password authentication with protected routes
- User dashboard for creating new listings
- Home page with all public products and direct seller messaging
- Profile page with user info and personal listings
- Conversation inbox and per-conversation chat pages
- Cloudinary file upload for listing images
- Prisma + PostgreSQL data model for users, listings, conversations, and messages
- Real-time chat support via Pusher

## Project Structure

- `app/`
  - `page.tsx` — public marketplace home page
  - `dashboard/page.tsx` — create new listings and upload images
  - `profile/page.tsx` — user profile and own listings management
  - `messages/page.tsx` — inbox for active conversations
  - `messages/[conversationId]/page.tsx` — conversation thread page
  - `api/` — API routes for auth, listings, conversations, and messages
- `components/` — reusable UI components like `ProductCard`, `CreateListingForm`, `CloudinaryUpload`, and `ConversationThread`
- `lib/` — shared helpers for Prisma, authentication, and providers
- `prisma/schema.prisma` — database schema for `User`, `Listing`, `Conversation`, and `Message`

## Environment Variables

Create a `.env` file at the project root with the following variables:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-nextauth-secret"
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```

### Required values

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — secret for next-auth session encryption
- `PUSHER_APP_ID`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` — Pusher credentials for real-time messaging

## Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client after schema changes:

```bash
npx prisma generate
```

Run migrations (development only):

```bash
npx prisma migrate dev --name init
```

Start the dev server:

```bash
npm run dev
```

Open: `http://localhost:3000`

## Usage

### Pages

- `/` — browse all available products
- `/login` — sign in with credentials
- `/register` — create an account
- `/dashboard` — authenticated listing creation and Cloudinary upload
- `/profile` — view user info and manage your own listings
- `/messages` — view conversation list
- `/messages/[conversationId]` — message thread for a particular conversation

### API Endpoints

- `GET /api/listings` — fetch all listings
- `GET /api/listings?mine=1` — fetch listings created by current user
- `POST /api/listings` — create a new listing
- `PATCH /api/listings?id=<id>` — update listing by owner
- `DELETE /api/listings?id=<id>` — delete listing by owner
- `POST /api/conversations` — start or return a conversation for a listing
- `GET /api/conversations` — fetch current user conversations
- `POST /api/messages` — send a message in a conversation
- `GET /api/messages?conversationId=<id>` — fetch messages for a conversation

## Database Schema

Current Prisma models:

- `User`
- `Listing`
- `Conversation`
- `Message`

Relationships:

- `User` has many `listings`, `buyerConversations`, `sellerConversations`, and `messages`
- `Listing` belongs to a `seller` and has many `conversations`
- `Conversation` belongs to a `listing`, `buyer`, and `seller`, and has many `messages`
- `Message` belongs to a `conversation` and has one `sender`

## Deployment Notes

- Ensure environment variables are configured in your deployment platform
- Re-run `npx prisma generate` after any schema change
- Set Pusher credentials in production environment values
- Use a secure `NEXTAUTH_SECRET`

## Troubleshooting

- If a route fails with missing `conversationId`, verify the dynamic route path uses `/messages/[conversationId]`
- If Prisma reports validation errors, re-run `npx prisma generate`
- If upload fails, confirm the Cloudinary upload preset and public credentials are valid

## Made by Oleksandr Koniukh
