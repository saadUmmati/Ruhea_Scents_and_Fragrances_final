# RUHEA Fragrances - The Essence of Luxury - E-Commerce Platform

A premium Next.js 16 e-commerce platform for luxury fragrances, built with modern web technologies and optimized for performance. Performance meets high-end perfumery. A digital flagship where luxury is not just seen, but felt through speed and minimalism.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-gold?style=for-the-badge&logo=vercel)](https://ruheafragrances.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2016%20|%20TypeScript%20|%20MongoDB-black?style=for-the-badge)](https://ruheafragrances.vercel.app/)

<details>
<summary>🌌 The Anti-Gravity Philosophy</summary>

### The Vision
In a world of bloated, slow-loading templates, **RUHEA** stands as a testament to "Anti Gravity" coding. This philosophy dictates that code should never weigh down the user experience. We believe that **Luxury is Speed** and **Minimalism is Power**. 

### Brand Identity & Aesthetic
The target audience for RUHEA consists of luxury fragrance enthusiasts—individuals who appreciate the nuance of a base note and the elegance of a clean interface.
* **Minimalist UI:** Using a palette of "Ethereal White," "Onyx Black," and "Champagne Gold."
* **Micro-Interactions:** Powered by **Framer Motion**, elements don't just "appear"; they glide into place, mimicking the physical weightlessness of a premium scent.
* **Intentional Friction:** We removed unnecessary pop-ups and aggressive marketing banners to focus entirely on the product artistry.

</details>

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Image Upload**: Cloudinary
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **3D Rendering**: Three.js + React Three Fiber

<details>
<summary>🛠 Technical Deep Dive (The Engine Room)</summary>

### Why Next.js 16?
We chose the App Router for its unparalleled ability to handle complex data fetching while maintaining SEO integrity.
* **Server Components (RSC):** Product catalogs are rendered on the server, ensuring instant "First Contentful Paint."
* **Dynamic Routing:** Each fragrance occupies its own dynamic slug (`/product/[id]`), optimized for indexing.

### Styling & 3D Visuals
* **Tailwind CSS v4:** A utility-first approach allowed us to build a custom design system without the overhead of heavy CSS libraries.
* **Three.js Integration:** We bring 3D depth to the digital store, treating each bottle as a piece of digital art through React Three Fiber.
</details>

## 📋 Prerequisites

- Node.js 20.9 or higher
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- npm or yarn package manager

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ruhea-fragrances
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ruhea-fragrances

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-preset>

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

## 📁 Project Structure

```
ruhea-fragrances/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (account)/         # User account pages
│   ├── admin/             # Admin panel
│   ├── shop/              # Shop pages
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── home/             # Homepage components
│   ├── shop/             # Shop components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── actions/          # Server actions
│   ├── db/               # Database models & connection
│   └── utils/            # Helper functions
├── public/               # Static assets
├── scripts/              # Utility scripts
└── types/                # TypeScript type definitions
```

## 🔑 Key Features

- **User Authentication**: Email/password + OAuth (Google, GitHub)
- **Product Management**: Full CRUD with image upload
- **Shopping Cart**: Persistent cart with Zustand
- **Wishlist**: Save favorite products
- **Admin Panel**: 
  - User management with role-based access
  - Order management with status tracking
  - Product management with variants
  - Analytics dashboard
- **Responsive Design**: Mobile-first approach
- **Image Optimization**: Automatic optimization via Next.js Image
- **SEO Optimized**: Meta tags, sitemap, robots.txt
- **Performance**: Server-side pagination, lazy loading

## 🛍 Other features Showcase

<details>
<summary>View Detailed Feature Breakdown</summary>

### 1. Dynamic Product Catalog
* **User Story:** "As a connoisseur, I want to filter fragrances by olfactory family so I can find my signature scent."
* **Technical Execution:** A real-time filtering engine that updates the URL state without a full page reload, allowing users to share filtered views with friends.

### 2. The Luxury Shopping Bag
* **User Story:** "I want to add items to my cart and see them persist even if I refresh the page."
* **Technical Execution:** A hybrid state management approach using **Zustand** for global UI state and **LocalStorage synchronization** to ensure the cart follows the user across devices.

### 3. Responsive "Liquid" Layout
* **User Story:** "I want to shop on my mobile device with the same elegance as my desktop."
* **Technical Execution:** Using Tailwind's breakpoint system, we designed a "Liquid Layout." The 4-column product grid gracefully collapses into a touch-optimized single-column view.

[Insert Mobile View Screenshot Here]
</details>
## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production (test)
npm run build

# Start production server
npm start
```

## 📝 Environment Variables Reference

See `.env.example` for all available environment variables.

### Required for Production:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Optional:
- OAuth provider credentials
- Payment gateway credentials
- Email service API keys
- Analytics IDs

## 🔒 Security Features

- HTTPS enforced via security headers
- CSRF protection via NextAuth
- XSS protection headers
- Rate limiting on authentication routes
- Environment variable validation
- Password hashing with bcrypt

## 📊 Performance Optimizations

- Server-side rendering (SSR)
- Static site generation (SSG) where applicable
- Image optimization (AVIF, WebP)
- Code splitting
- Server-side pagination
- Lazy loading
- CDN caching via Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions, please contact the development team.

---

---
**Ready to redefine luxury?** [Contact the Developer](mailto:msaadisiddiqui@gmail.com) | [Portfolio](https://muhammadsaadahmedportfolio.vercel.app/)

*Built with the Anti-Gravity Engine — where high-performance engineering meets timeless elegance.*
