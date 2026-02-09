# CarDiagnostic

A modern, AI-powered car diagnostic web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **User Authentication**: Secure email/password registration and login
- 💳 **Stripe Payment Integration**: Multiple subscription plans with beautiful pricing cards
- 💬 **AI Chat Assistant**: Interactive chat interface for car diagnostic assistance (bot integration ready)
- 🎨 **Modern UI**: Polished, responsive design with gradient backgrounds and smooth animations
- 🔒 **Secure Database**: PostgreSQL with Prisma ORM for user management
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Optimized for Vercel deployment with Next.js

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom auth with bcrypt
- **Payments**: Stripe (integration ready)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MilijanGacanovic/CarDiagnostic.git
cd CarDiagnostic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (optional)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (optional)

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For New Users (Logged Out)
- View the landing page with feature highlights
- Register a new account with email and password
- Login with existing credentials

### For Logged-In Users
- View and select from three subscription plans (Basic, Pro, Enterprise)
- Access the AI chat assistant for diagnostic questions
- See feature cards and additional information

## Database Schema

The application uses a simple User model:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   (hashed with bcrypt)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

### Database Options for Vercel

- **Vercel Postgres**: Built-in PostgreSQL database
- **Neon**: Serverless Postgres
- **Supabase**: PostgreSQL with additional features
- **PlanetScale**: MySQL alternative

## Project Structure

```
CarDiagnostic/
├── app/
│   ├── api/
│   │   └── auth/          # Authentication API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── AuthForm.tsx       # Login/registration form
│   ├── ChatPrompt.tsx     # AI chat interface
│   ├── Footer.tsx         # Footer component
│   ├── Header.tsx         # Header with logo and logout
│   ├── HomePage.tsx       # Main page component
│   └── StripePayment.tsx  # Payment/pricing section
├── lib/
│   ├── auth.ts            # Authentication utilities
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
└── package.json
```

## Security Features

- Passwords are hashed with bcrypt (10 rounds)
- Email validation on registration
- Password validation (min 1 character, max 128 characters, trimmed)
- Duplicate email prevention
- HTTP-only cookies for session management
- SQL injection protection via Prisma

**Note:** The application currently allows passwords of any length ≥1 character. For production use, consider implementing additional security controls such as rate limiting, CAPTCHA, or multi-factor authentication.

## Future Enhancements

- [ ] Complete Stripe payment integration
- [ ] AI bot integration for chat assistant
- [ ] OBD-II device connection
- [ ] Real-time vehicle data monitoring
- [ ] Diagnostic report generation
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.