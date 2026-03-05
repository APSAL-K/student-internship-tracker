# Testing Guide - Internship Tracker

## Quick Start Testing

### 1. Sign In with Demo Account
- Go to `/login`
- Use one of these demo accounts:
  - **Student**: `student@test.com` / `demo123`
  - **Coordinator**: `coordinator@test.com` / `demo123`
  - **Admin**: `admin@test.com` / `demo123`
- Or click demo account buttons on login page

### 2. Create New Account (Signup Flow)
- Go to `/signup`
- Follow 5-step process:
  1. Enter email (must be unique), password (min 6 chars), name
  2. Fill personal details (phone, address, city, country, DOB, gender)
  3. Enter education info (degree, institution, year, major, GPA)
  4. Add experience (job title, company, duration, skills)
  5. Upload resume (PDF) - optional
- Account automatically created and logged in
- Redirected to dashboard

### 3. View Profile
- Click profile menu in top navbar (your name + avatar)
- Select "My Profile"
- View profile with all information
- See profile completion percentage

### 4. Edit Profile
- On `/profile` page, click "Edit Profile" button
- Update any section:
  - Personal Information
  - Education
  - Professional Experience
  - Resume
- Click "Save Changes" to update
- Changes persist in localStorage

### 5. Theme Toggle
- Click Sun/Moon icon in navbar top-right
- Switch between dark and light modes
- Theme persists on browser reload

### 6. Dashboard
- View different dashboards based on role:
  - **Student**: Applications, pending count, approved count
  - **Coordinator/Admin**: Internship metrics, approval rates
- Charts display sample data
- Recent activity shown for coordinators

### 7. Logout
- Click profile menu in navbar
- Select "Logout"
- Redirected to login page
- Session cleared

## Test Cases

### Authentication
- [ ] Can login with valid credentials
- [ ] Shows error with invalid email
- [ ] Shows error with wrong password
- [ ] Password min 6 characters enforced on signup
- [ ] Email uniqueness validated on signup
- [ ] Passwords match validation on signup
- [ ] Demo accounts work with correct password
- [ ] Session persists on page reload

### Profile Management
- [ ] All personal fields editable
- [ ] Education fields editable
- [ ] Experience fields editable
- [ ] Can upload PDF resume
- [ ] Can download uploaded resume
- [ ] Profile completion % updates correctly
- [ ] Changes saved to localStorage
- [ ] Profile data visible on dashboard

### Theme
- [ ] Can toggle between light/dark
- [ ] Theme persists on page reload
- [ ] No hydration issues on initial load
- [ ] All text readable in both themes

### Navigation
- [ ] Navbar appears when logged in
- [ ] Navbar hidden when not logged in
- [ ] Profile menu opens/closes
- [ ] Can access profile from menu
- [ ] Sidebar works on mobile
- [ ] Links route correctly

### Data Persistence
- [ ] User data survives page refresh
- [ ] All profile fields persisted
- [ ] Resume data encoded as base64
- [ ] Theme preference saved
- [ ] Session token valid after refresh
- [ ] Clear localStorage removes all data

## Browser DevTools Debugging

### Check localStorage
```javascript
// View all auth data
console.log(JSON.parse(localStorage.getItem('auth_state')))

// Check theme
console.log(localStorage.getItem('theme'))

// Clear all
localStorage.clear()
```

### Redux DevTools
- Install Redux DevTools browser extension
- View action history in devtools
- Time-travel debugging available
- See state changes on each action

### Console
- Check for errors/warnings
- Verify login/logout actions
- Monitor API calls (if backend added later)

## Common Issues & Solutions

### "Redux context value not found"
- Ensure user is wrapped in `<Provider>` from Redux
- Check `store/provider.tsx` is in layout

### Theme not persisting
- Ensure `next-themes` is installed
- Check `ThemeScript` is in `<head>`
- Verify `suppressHydrationWarning` on `<html>`

### Profile not updating
- Check browser localStorage isn't full
- Verify updateProfile action dispatched
- Check Redux state in devtools

### Blank dashboard
- Verify `useAuthPersist()` called in components
- Check localStorage for auth_state
- Ensure user exists after login

## Performance Notes

- Multi-step form validates before proceeding to next step
- Profile completion % calculated client-side
- No unnecessary re-renders with React hooks
- localStorage synced on every change
- Theme script runs before React hydration

## Demo Data Notes

- In-memory user storage (not persisted to disk)
- Demo accounts reset on server restart
- Sample charts use hardcoded data
- No actual email sending
- Resumes stored as base64 in memory
