# Categories Management Feature

## Overview
A comprehensive categories management system for the Personal Finance Tracker application that allows users to create, edit, and delete transaction categories with visual customization options.

## Features

### 🎯 Core Functionality
- **Create Categories**: Add new income and expense categories
- **Edit Categories**: Modify existing category details
- **Delete Categories**: Remove categories with confirmation
- **Visual Filtering**: Filter by All, Income, or Expense categories
- **Transaction Count**: Display number of transactions per category

### 🎨 Visual Customization
- **Color Selection**: Choose from 10 predefined colors or custom colors
- **Icon Selection**: Pick from 20 predefined emoji icons
- **Category Type**: Distinguish between Income and Expense categories
- **Live Preview**: See how your category will look before saving

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Toast notifications for actions
- **Confirmation Dialogs**: Safe deletion with confirmation

## Backend Implementation

### Models
- `Category` model with fields for name, description, icon, color, type, and user association
- Support for hierarchical categories (parent-child relationships)
- Transaction count tracking

### API Endpoints
- `GET /api/transactions/categories/` - List all categories
- `POST /api/transactions/categories/` - Create new category
- `PUT /api/transactions/categories/{id}/` - Update category
- `DELETE /api/transactions/categories/{id}/` - Delete category

### Default Categories
20 pre-configured categories are automatically created for new users:
- **Income Categories**: Salary, Freelance, Investment, Business, Other Income
- **Expense Categories**: Food & Dining, Transportation, Housing, Healthcare, Entertainment, Shopping, Travel, Education, Utilities, Insurance, Taxes, Debt Payment, Gifts & Donations, Personal Care, Other Expenses

## Frontend Implementation

### Components
- `Categories.jsx` - Main categories page with grid layout
- `CategoryModal.jsx` - Create/edit category modal with form validation
- `DeleteConfirmModal.jsx` - Reusable delete confirmation modal

### API Service
- `categories.js` - Complete CRUD operations for categories
- Error handling and response processing
- Authentication token management

### Navigation
- Added "Categories" link to main navigation
- Integrated with existing routing system

## Usage

### Accessing Categories
1. Log in to your account
2. Click "Categories" in the main navigation
3. View all your categories in a responsive grid layout

### Creating a Category
1. Click "Add Category" button
2. Fill in the category details:
   - **Name**: Required, max 100 characters
   - **Description**: Optional, max 500 characters
   - **Type**: Choose Income or Expense
   - **Color**: Select from predefined colors
   - **Icon**: Choose from emoji icons
3. Preview your category in real-time
4. Click "Create Category" to save

### Editing a Category
1. Click the edit (pencil) icon on any category card
2. Modify the details as needed
3. Click "Update Category" to save changes

### Deleting a Category
1. Click the delete (trash) icon on any category card
2. Confirm deletion in the popup dialog
3. Category will be permanently removed

### Filtering Categories
- Use the filter tabs to view:
  - **All Categories**: Complete list
  - **Income**: Only income categories
  - **Expense**: Only expense categories

## Technical Details

### Dependencies
- React with hooks for state management
- React Router for navigation
- React Hot Toast for notifications
- Heroicons for UI icons
- Tailwind CSS for styling

### Security
- User-specific categories (users can only see their own categories)
- Authentication required for all operations
- CSRF protection enabled

### Performance
- Optimized queries with transaction counts
- Lazy loading for large category lists
- Efficient state management

## Management Commands

### Create Default Categories
```bash
# For all users
python manage.py create_default_categories

# For specific user
python manage.py create_default_categories --user user@example.com
```

## Future Enhancements
- Category hierarchy (subcategories)
- Category templates
- Bulk category operations
- Category import/export
- Category usage analytics
- Custom color picker
- Category icons from icon libraries

## Files Created/Modified

### Backend
- `transactions/models.py` - Category model
- `transactions/views.py` - CategoryViewSet
- `transactions/serializers.py` - CategorySerializer
- `transactions/urls.py` - Category endpoints
- `transactions/management/commands/create_default_categories.py` - Default categories command

### Frontend
- `src/pages/categories/Categories.jsx` - Main categories page
- `src/components/categories/CategoryModal.jsx` - Category form modal
- `src/components/common/DeleteConfirmModal.jsx` - Delete confirmation
- `src/api/categories.js` - Categories API service
- `src/App.jsx` - Added categories route
- `src/components/layout/Header.jsx` - Added categories navigation
- `src/index.css` - Added utility classes

This feature provides a solid foundation for transaction categorization and can be easily extended with additional functionality as needed. 