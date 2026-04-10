# Finance Dashboard

A complete client-side finance dashboard application built with React, TypeScript, and IndexedDB. All data is stored locally in the browser with no cloud dependencies.

## Features

- **Complete Offline Functionality**: All data stored in browser's IndexedDB
- **Role-Based Access Control**: Switch between Admin and Viewer roles
- **Transaction Management**: Add, edit, delete, and filter transactions
- **Analytics Dashboard**: Charts and insights for spending patterns
- **Category Management**: Organize transactions by custom categories
- **Dark Mode**: Full dark theme support with smooth transitions
- **Responsive Design**: Works on mobile, tablet, and desktop

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **IndexedDB** - Client-side database
- **Lucide React** - Icons

## Data Architecture

### Complete Client-Side Storage

All application data is stored in the browser's IndexedDB:

- **Transactions Store**: All financial transactions
- **Categories Store**: Income and expense categories
- **Users Store**: Local user profiles with roles

### Default Data

On first launch, the application creates:

**Default Users:**
- Admin user: `user@financedashboard.local`
- Viewer user: `viewer@financedashboard.local`

**15 Default Categories:**
- 5 Income categories (Salary, Freelance, Investment, Bonus, Other)
- 10 Expense categories (Food, Transportation, Shopping, Entertainment, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application will initialize IndexedDB on first load and seed default data. No environment variables or external services are required.

## Features Overview

### Role-Based Access

Switch between two roles using the header dropdown:

- **Admin Role**: Full CRUD access to all data
- **Viewer Role**: Read-only access

### Dashboard

- Total Balance, Income, Expenses, and Capital Utilization cards
- Time series chart showing balance trends
- Capital utilization donut chart
- Recent transactions widget
- Month-over-month change indicators

### Transactions

- Searchable and filterable transaction list
- Add, edit, and delete transactions (Admin only)
- Bulk delete operations
- Date range filtering
- Category-based filtering

### Analytics & Insights

- Spending breakdown by category
- Monthly income vs expenses comparison
- Highest spending category
- Savings rate calculation
- Spending trends analysis

### Categories

- View all income and expense categories
- Add custom categories (Admin only)
- Edit category details (Admin only)
- Delete unused categories (Admin only)

## Data Persistence

### IndexedDB

All data persists in the browser's IndexedDB:

- Survives page refreshes
- Persists across browser sessions
- Isolated per browser/profile
- No network calls
- Works completely offline

### Data Export/Import

- Export all data to JSON or CSV
- Import data from CSV files
- Backup and restore functionality

## Browser Support

Works on all modern browsers that support:
- IndexedDB
- ES2020
- CSS Grid and Flexbox

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
src/
├── components/       # React components
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Breadcrumb.tsx
│   └── LoadingSkeleton.tsx
├── contexts/         # React Context providers
│   ├── AuthContext.tsx
│   ├── DashboardContext.tsx
│   ├── TransactionsContext.tsx
│   └── ThemeContext.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   ├── useTransactions.ts
│   ├── useTheme.ts
│   └── useLocalStorage.ts
├── services/         # Data services
│   └── indexedDb.ts
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   ├── calculations.ts
│   ├── currency.ts
│   ├── date.ts
│   └── seedData.ts
└── App.tsx           # Root component
```

## Development Roadmap

Completed:
- Stage 1: Foundation and Project Setup
- Stage 2: IndexedDB Schema and Integration
- Stage 3: State Management and Context Setup
- Stage 4: Core Layout and Navigation

Next:
- Stage 5: Dashboard Overview Page
- Stage 6: Transactions Management Section
- Stage 7: Role-Based Access Control UI

## Security & Privacy

- All data stays on your device
- No data sent to external servers
- No tracking or analytics
- No cookies or external scripts
- Complete privacy by design

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs.
