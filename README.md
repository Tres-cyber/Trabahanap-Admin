# Trabahanap Admin

This is a monorepo containing both the frontend and backend code for the Trabahanap Admin application.

## Project Structure

```
trabahanap-admin/
├── packages/
│   ├── frontend/     # React + Vite frontend application
│   └── backend/      # Backend application (to be implemented)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the frontend development server:
```bash
npm run dev:frontend
```

To build the frontend:
```bash
npm run build:frontend
```

## Available Scripts

### Root Workspace
- `npm run dev:frontend` - Start the frontend development server
- `npm run build:frontend` - Build the frontend application
- `npm run test:frontend` - Run frontend tests

### Frontend Package
- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## License

[Your License Here]
