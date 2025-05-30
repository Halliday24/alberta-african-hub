# African Community Platform Frontend

## Project Overview

### Purpose and Goals
The African Community Platform is a web application designed to connect members of the African community in Alberta. It aims to foster collaboration, provide resources, and create a space for discussions, events, and business networking.

### Key Features
- **User Authentication**: Secure login and registration using JWT.
- **Community Forum**: A platform for discussions and sharing ideas.
- **Business Directory**: A listing of African-owned businesses.
- **Resource Directory**: Access to community resources like churches and grocery stores.
- **Event Management**: Information about upcoming community events.
- **Search and Filter**: Advanced search and filtering options for posts, businesses, and resources.

### Technology Stack
- **Frontend Framework**: React (Create React App)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **API Client**: Axios
- **Routing**: React Router
- **Testing**: Jest and React Testing Library

---

## Project Structure

### Directory and File Breakdown
```
frontend/
├── public/                # Static assets
│   ├── index.html         # Main HTML file
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # Robots exclusion file
├── src/                   # Application source code
│   ├── components/        # Reusable React components
│   │   ├── AfricanCommunityPlatform.js
│   │   ├── Login.js
│   │   └── Register.js
│   ├── services/          # API and utility services
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── useAuth.js
│   │   └── usePosts.js
│   ├── App.css            # Global styles
│   ├── App.js             # Root component
│   ├── index.css          # Tailwind CSS imports
│   ├── index.js           # Application entry point
│   ├── reportWebVitals.js # Performance reporting
│   └── setupTests.js      # Test setup
├── package.json           # Project metadata and dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```

### Description of Key Files
- **`App.js`**: The root component that initializes the app and wraps it with the `AuthProvider`.
- **`index.js`**: Entry point for rendering the React app.
- **`components/`**: Contains reusable UI components like `Login`, `Register`, and `AfricanCommunityPlatform`.
- **`services/`**: Handles API calls and authentication logic.
- **`tailwind.config.js`**: Configures Tailwind CSS, including content paths.
- **`postcss.config.js`**: Configures PostCSS plugins for Tailwind and Autoprefixer.

---

## Component Architecture

### Component Hierarchy
- **`App.js`**: Root component
  - **`AfricanCommunityPlatform.js`**: Main layout and navigation
    - **`Login.js`**: Login modal
    - **`Register.js`**: Registration modal

### Core UI Components
- **`Login`**
  - Props: `onClose`, `switchToRegister`
  - Handles user login and displays error messages.
- **`Register`**
  - Props: `onClose`, `switchToLogin`
  - Handles user registration and password validation.
- **`AfricanCommunityPlatform`**
  - Manages navigation, data fetching, and rendering of different sections (e.g., forum, businesses).

---

## Styling Approach

### CSS Strategy
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Global Styles**: Defined in `index.css` and `App.css`.

### Responsiveness
- Tailwind's responsive utilities (e.g., `sm:`, `md:`, `lg:`) are used for mobile-first design.

### Best Practices
- Consistent use of Tailwind's utility classes.
- Avoid inline styles; use Tailwind for all styling needs.

---

## State Management

### Local vs Global State
- **Local State**: Managed within components (e.g., form inputs, modals).
- **Global State**: Managed using Context API for authentication and user data.

### Data Flow
- Data is fetched via services in `src/services/` and passed down as props to components.

---

## Routing

### Library Used
- **React Router**: Handles navigation between different sections of the app.

### Route Configuration
- Routes are dynamically rendered based on the active tab in `AfricanCommunityPlatform`.

---

## API Integration

### API Client
- **Axios**: Configured in `src/services/api.js` with interceptors for authentication.

### Endpoints
- Defined in `src/services/index.js` for modularity and reusability.

---

## Authentication

### Strategy
- **JWT**: Tokens are stored in `localStorage` and attached to API requests via Axios interceptors.

### Session Management
- User sessions are validated by fetching the profile on app load.

---

## Error Handling and Logging

### Error Boundaries
- Errors are caught and displayed using state variables in components.

### Logging
- Errors are logged to the console for debugging.

---

## Testing

### Libraries Used
- **Jest**: Test runner.
- **React Testing Library**: For testing React components.

### Test Structure
- Tests are located alongside components (e.g., `App.test.js`).

### Sample Test
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

## Build and Deployment

### Build Configuration
- **React Scripts**: Handles build and optimization.

### Deployment
- Can be deployed to platforms like Netlify or Vercel.

---

## Developer Guidelines

### Coding Standards
- Follow React and Tailwind CSS best practices.
- Use meaningful variable and function names.

### Running the Project Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

### Contributing
- Create a new branch for features or bug fixes.
- Submit a pull request with a detailed description.

---

## Common Pitfalls / Tips

### Gotchas
- Ensure `tailwind.config.js` and `postcss.config.js` are correctly configured.
- Restart the development server after making changes to configuration files.

### Performance Tips
- Use Tailwind's `@apply` directive for reusable styles.
- Optimize API calls by caching data where possible.
