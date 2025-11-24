# 🚀 Evola - SaaS Base CMS Platform

A modern, full-featured SaaS Content Management System built with React, Vite, and Tailwind CSS. Evola provides a comprehensive platform for managing services, orders, and user interactions with a beautiful, responsive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.8-cyan.svg)](https://tailwindcss.com/)

## ✨ Features

- 🎨 **Modern UI/UX** - Built with Tailwind CSS and DaisyUI for beautiful, responsive designs
- 🔐 **Authentication System** - Complete user authentication and authorization
- 👤 **Multi-Role Support** - Admin, Seller, and Buyer role management
- 📊 **Admin Dashboard** - Comprehensive admin panel for platform management
- 🛍️ **Service Marketplace** - Browse, purchase, and manage services
- 💬 **Real-time Messaging** - Socket.io powered conversation system
- 📦 **Order Management** - Complete order tracking and management system
- 🔔 **Notifications** - Real-time notification system
- ⭐ **Save Items** - Bookmark and save favorite services
- 📈 **Analytics & Charts** - Visual data representation with Recharts
- 🎭 **Smooth Animations** - Framer Motion for delightful user experience
- 📱 **Fully Responsive** - Mobile-first design approach

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **Vite 6.1.0** - Lightning-fast build tool
- **React Router DOM 7.2.0** - Client-side routing
- **Tailwind CSS 4.0.8** - Utility-first CSS framework
- **DaisyUI 5.0.13** - Tailwind CSS component library

### State Management & Data Fetching
- **TanStack React Query 5.71.10** - Powerful data synchronization
- **React Hook Form 7.58.1** - Performant form validation

### UI Components & Icons
- **Lucide React 0.536.0** - Beautiful icon library
- **React Icons 5.5.0** - Popular icon packs
- **Framer Motion 12.23.12** - Animation library

### Charts & Visualization
- **Recharts 3.1.2** - Composable charting library
- **Chart.js 4.5.0** - Simple yet flexible charting

### Real-time & Utilities
- **Socket.io Client 4.8.1** - Real-time bidirectional communication
- **SweetAlert2 11.17.2** - Beautiful alert/modal library
- **React Quill 2.0.0** - Rich text editor
- **React DatePicker 8.4.0** - Date selection component

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** for version control

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nrbnayon/evola-saas-base-cms.git
   cd evola-saas-base-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 📁 Project Structure

```
evola-saas-base-cms/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, and other assets
│   ├── components/        # Reusable UI components
│   ├── Layouts/           # Layout components (Header, Footer, etc.)
│   ├── Pages/             # Page components
│   │   ├── AccountSettings/    # User account settings
│   │   ├── AdminPages/         # Admin dashboard pages
│   │   ├── AllServices/        # Services listing
│   │   ├── Authentication/     # Login, Register, etc.
│   │   ├── BuyerPages/         # Buyer-specific pages
│   │   ├── ConversationPage/   # Messaging interface
│   │   ├── HomePage/           # Landing page components
│   │   ├── ManageOrder/        # Order management
│   │   ├── Notification/       # Notifications page
│   │   ├── OrderPage/          # Order details
│   │   ├── SaveItems/          # Saved/bookmarked items
│   │   ├── SellerProfile/      # Seller profile pages
│   │   ├── Services/           # Service management
│   │   └── Shared/             # Shared page components
│   ├── Routers/           # Route configuration
│   ├── App.jsx            # Main App component
│   ├── App.css            # App-specific styles
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
├── vercel.json            # Vercel deployment config
└── README.md              # Project documentation
```

## 🎯 Key Features Breakdown

### Authentication System
- User registration and login
- Password recovery
- Role-based access control (Admin, Seller, Buyer)
- Protected routes

### Admin Dashboard
- User management
- Service management
- Order oversight
- Platform analytics
- System configurations

### Service Marketplace
- Browse available services
- Service search and filtering
- Detailed service pages
- Service reviews and ratings

### Order Management
- Place orders
- Track order status
- Order history
- Invoice generation

### Messaging System
- Real-time chat
- Order-related conversations
- Notification alerts

## 🎨 Styling

This project uses a modern styling approach:
- **Tailwind CSS 4.0** for utility-first styling
- **DaisyUI** for pre-built components
- **Framer Motion** for animations
- Custom CSS for specific styling needs

## 🔧 Configuration

### Vite Configuration
The project uses Vite for blazing-fast development and optimized builds. Configuration can be modified in `vite.config.js`.

### ESLint Configuration
Code quality is maintained using ESLint with React-specific rules. See `eslint.config.js` for details.

## 🚢 Deployment

### Deploy to Vercel

This project is optimized for Vercel deployment:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment to any static hosting service.

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_SOCKET_URL=your_socket_server_url
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Follow the ESLint configuration
- Use functional components with hooks
- Maintain consistent naming conventions
- Write clean, self-documenting code
- Add comments for complex logic

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nayon**
- GitHub: [@nrbnayon](https://github.com/nrbnayon)
- Project Link: [https://github.com/nrbnayon/evola-saas-base-cms](https://github.com/nrbnayon/evola-saas-base-cms)

## 🙏 Acknowledgments

- React Team for the amazing framework
- Vite Team for the blazing-fast build tool
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

<div align="center">
  Made with ❤️ by Nayon
  
  ⭐ Star this repo if you find it helpful!
</div>
