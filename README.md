# IPOT Customer QR Ordering App

A mobile application for customers to order food by scanning QR codes at restaurant tables. Built with Expo and TypeScript, following Clean Architecture and Domain-Driven Design principles.

## Pre-built apps (EAS)

Cloud builds (Android APK/AAB, iOS) are produced with [EAS Build](https://docs.expo.dev/build/introduction/).
- **Android APK**: [https://drive.google.com/file/d/1hEZu-_zoomyS5IHwLsFQA9mB6sad3S42/view?usp=sharing](https://drive.google.com/file/d/1hEZu-_zoomyS5IHwLsFQA9mB6sad3S42/view?usp=sharing)
- **iOS IPA**: Not Available since it needed the Apple Developer Account

## Features

- QR code scanning for table identification
- Browse restaurant menu with categories
- Add items to cart with customizations
- Submit orders with special requests
- Track order status in real-time

## Tech Stack

- **Framework**: Expo ~54 (TypeScript)
- **State Management**: 
  - TanStack Query (server state - menu, orders)
  - Zustand (client state - cart)
- **Architecture**: Clean Architecture + Domain-Driven Design + Atomic Design
- **Navigation**: Expo Router (file-based routing)
- **Testing**: Jest + React Native Testing Library

## Architecture

The project follows Clean Architecture with three main layers:

```
src/
├── domain/          # Business logic and entities
│   ├── entities/    # Core business models
│   ├── repositories/ # Repository interfaces
│   └── value-objects/ # Value objects (TableId, etc.)
├── data/            # Data layer
│   ├── api/         # API client and DTOs
│   ├── mappers/     # DTO to entity mappers
│   └── repositories/ # Repository implementations
├── presentation/    # UI layer
│   ├── components/  # Atomic design components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── screens/     # Screen components
│   ├── navigation/  # Navigation configuration
│   └── hooks/       # Custom React hooks
├── state/           # Global state (Zustand stores)
├── config/          # App configuration
└── utils/           # Utility functions
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd customer-qr-ordering
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env .env.local
# Edit .env.local with your API base URL if needed
```

4. Start the development server:
```bash
npm start
```

5. Run on a device:
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

## Running Tests

```bash
npm test
```

## Project Structure Details

### Domain Layer
Contains the core business logic, independent of frameworks:
- **Entities**: MenuItem, CartItem, Order, Restaurant
- **Repository Interfaces**: Define contracts for data access
- **Value Objects**: Immutable objects like TableId

### Data Layer
Handles data fetching and persistence:
- **Mock API**: Simulates backend with realistic delays
- **Mappers**: Transform API responses to domain entities
- **Repository Implementations**: Concrete implementations of domain interfaces

### Presentation Layer
React components organized by Atomic Design:
- **Atoms**: Basic building blocks (Button, Text, Badge)
- **Molecules**: Simple component combinations (MenuItemCard)
- **Organisms**: Complex UI sections (CartSummary)
- **Screens**: Full page components

## API Endpoints

The app uses a mock API with the following endpoints:

- `GET /api/v1/menu?table_id={id}` - Fetch menu for a table
- `GET /api/v1/categories` - List menu categories
- `POST /api/v1/orders` - Submit new order
- `GET /api/v1/orders/{id}` - Get order status
- `GET /api/v1/tables/{id}/status` - Get table status

## QR Code Format

Tables are identified by QR codes in the format:
```
ipot://table/{tableId}
```

Example: `ipot://table/T001`

## Development Workflow

This project follows a commit-as-you-go strategy with conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process, dependencies

## License

MIT
