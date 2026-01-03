# Admin and Staff Routes

## 🔐 Admin Routes
*Requires `role === "admin"` or `role === "staff"` in registrations collection*

### Main Dashboard
- **`/admin`** - Admin control panel with all tools

### Settings & Configuration
- **`/admin/settings`** ⚙️ - Event configuration
  - Toggle leaderboard visibility
  - Control event settings

### Team Management  
- **`/admin/teams`** 👥 - Team management
  - **Create new participants/registrations** (fill all fields manually)
  - Create teams from registrations
  - Assign team leaders
  - Confirm payment status
  - View team details

### Judge Management
- **`/admin/judge-assignments`** 📋 - Judge assignment system
  - Assign judges to teams
  - Manage judging schedules
  - View assignment status

### Milestones & Judging
- **`/admin/milestones`** 📝 - Milestone overview
- **`/admin/milestones/[id]`** 🎯 - Individual milestone judging
  - Score teams on assigned milestones
  - Enter rubric scores
  - Add time bonuses
  - View real-time scoring

---

## 👔 Staff Routes
*Requires `role === "staff"` or `role === "admin"` in registrations collection*

### QR Scanner
- **`/staff/scanner`** 📱 - Multi-purpose QR code scanner
  - Check-in participants
  - Distribute swag items
  - Photobooth access control
  - Real-time attendance tracking

### Analytics Dashboard
- **`/staff/analytics`** 📊 - Event analytics
  - Check-in statistics
  - Swag distribution tracking
  - Photobooth usage stats
  - Export attendance data (CSV)
  - Real-time event metrics

---

## 🏆 Public Routes (No Authentication Required)

### Leaderboard
- **`/leaderboard`** - Team rankings and scores
  - Real-time score updates
  - Filter by milestone
  - Filter by classroom
  - Top 3 podium display
  - *Can be hidden by admins via settings*

---

## 📋 Participant Routes
*Requires authentication with `role === "participant"` or `role === "leader"`*

### Dashboard
- **`/dashboard`** - Participant home page
- **`/team`** - Team information
- **`/profile`** - User profile

### Registration & Team Creation
- **`/register`** - Event registration
- **`/create-team`** - Create new team
- **`/edit-team`** - Edit team details
- **`/view-team`** - View team information

### Hackathon Resources
- **`/hackathon/milestone_one`** - Milestone 1 details
- **`/hackathon/milestone_two`** - Milestone 2 details
- **`/hackathon/milestone_three`** - Milestone 3 details
- **`/hackathon/milestone_four`** - Milestone 4 details

### Information Pages
- **`/schedule`** - Event schedule
- **`/timeline`** - Event timeline
- **`/faq`** - Frequently asked questions
- **`/coc`** - Code of Conduct

---

## 🔑 Access Control Summary

| Role | Admin Panel | Staff Tools | Judging | Team Mgmt | Settings |
|------|------------|-------------|---------|-----------|----------|
| **Admin** | ✅ Full | ✅ Full | ✅ Yes | ✅ Yes | ✅ Yes |
| **Staff** | ✅ Limited | ✅ Full | ❌ No | ✅ View | ❌ No |
| **Leader** | ❌ No | ❌ No | ❌ No | ✅ Own Team | ❌ No |
| **Participant** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 📝 Notes

### Admin Settings Page Features:
1. **Leaderboard Visibility Control**
   - Toggle leaderboard on/off
   - Real-time updates for all users
   - Useful for hiding scores between milestones

### Staff vs Admin Access:
- **Staff** can access most tools but cannot:
  - Assign judges (admin only)
  - Access admin settings
  - Modify core configurations

- **Admin** has full system access including:
  - All staff capabilities
  - Judge assignment system
  - Event configuration settings
  - System-wide controls

### Security:
All routes check authentication on page load:
```typescript
getDoc(doc(db, "registrations", user.uid)).then((document) => {
  const response = document.data();
  if (response.role !== "admin" && response.role !== "staff") {
    alert("Admin access required");
    window.location.href = "/";
  }
});
```
