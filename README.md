src/
├── api/ # Axios client setup and interceptors
├── assets/ # Static images, icons, placeholders
├── components/ # Reusable UI components (Buttons, Inputs, Cards)
│ ├── common/ # Shared across the app (Navbar, Footer, Modal)
│ ├── ui/ # Micro-components (Button, Input, Spinner)
│ └── movies/ # Domain-specific components (MovieCard, SeatGrid)
├── hooks/ # Custom React hooks (useAuth, useFetch)
├── layouts/ # Page layouts (MainLayout, AuthLayout, DashboardLayout)
├── pages/ # Route-level components
│ ├── auth/ # Login, Register
│ ├── public/ # Home, MovieDetails
│ ├── booking/ # ShowSelection, SeatSelection, PaymentStatus
│ └── dashboard/ # Admin and Theatre admin screens
├── routes/ # React Router v6 object-based config & guards
├── services/ # API call wrappers organized by domain
├── store/ # Redux Toolkit config and slices
├── types/ # Global TypeScript interfaces matching backend DTOs
└── utils/ # Helper functions (JWT decoder, formatting, seat logic)
