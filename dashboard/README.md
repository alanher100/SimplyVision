# SimplyVision: Dashboard

This folder documents the Dashboard section of SimplyVision, an AI-assisted basketball video analysis platform built by BoldCorp for Simply Basketball.

**Branch:** `feature/SV-66-dashboard`
**Jira Epic:** SV-5 (SimplyVision)
**Owner:** Aishah Pervaiz
**Status:** Planning. No code yet, since the team is still finalizing the frontend, backend, and database stack.

The Figma mockup includes these Dashboard frames: Dashboard, Dashboard - Profile Menu, Dashboard - Delete Confirm, Dashboard - Error, Dashboard - Empty State, Dashboard - Admin (Terence), and Dashboard - Staff (Videographer).

---

## SV-66: View Recent Footage on Dashboard

**User Story:** As a Simply Basketball staff member, I want to see recently uploaded and processed footage on the dashboard so that I can quickly find the game videos I need to work on.

**Acceptance Criteria:**
- The dashboard displays a Recent Footage list after login.
- Each row shows the game name, date, and processing status.
- Status badges show Processing, Needs Review, Approved, or Failed.
- The newest footage appears first.
- Users can open a footage item from the list.
- An empty state with an Upload Footage button appears when no footage exists.

**Subtasks:**
- Design Recent Footage list component
- Create backend endpoint to fetch recent footage
- Display footage rows with game name, date, and status
- Add empty state message and Upload button
- Test Recent Footage list with sample data

---

## SV-74: View Footage Processing Status on Dashboard

**User Story:** As a Simply Basketball staff member, I want to see the processing status of each video and a summary of how many videos are in each status so that I know which footage is ready, needs review, or has failed.

**Acceptance Criteria:**
- The dashboard displays summary cards for Footage Uploaded, AI Processing, Awaiting Review, and Approved.
- Each summary card shows the correct count for its status.
- Counts update when a video's status changes.
- Each footage item displays its current status as a colored badge.
- A failed video displays an error notification with a Retry option.
- Selecting Retry restarts processing for that video.
- Users can see which footage still needs staff review.

**Subtasks:**
- Build summary count cards for each status
- Create backend query for footage status counts
- Build error notification with Retry option
- Create Needs Review panel for AI-flagged results
- Test status counts and error notification

---

## SV-82: Access Games, Players, Statistics, and Video Results from Dashboard

**User Story:** As a Simply Basketball staff member, I want quick access to Games, Players, Statistics, and Video Results from the dashboard so that I can reach the information I need in one click.

**Acceptance Criteria:**
- The dashboard displays shortcut tiles for Games, Players, Statistics, and Video Results.
- Each tile shows a title and a short description.
- Selecting a tile opens the matching page.
- The sidebar navigation links to Dashboard, Upload Footage, AI Processing, Candidate Clips, Editor Review, and Video Library.
- The sidebar highlights the page the user is currently on.
- Users can return to the dashboard from any page using the sidebar.

**Subtasks:**
- Build shortcut tile component for dashboard
- Link each shortcut tile to its page route
- Build sidebar navigation menu
- Add active page highlight to sidebar
- Test dashboard and sidebar navigation

---

## SV-90: Role-Based Dashboard, Profile Menu, and Delete Confirmation

**User Story:** As an admin or Simply Basketball staff member, I want a dashboard that fits my role, with a profile menu and confirmation before footage is deleted, so that I only see the tools I need and don't remove footage by accident.

**Acceptance Criteria:**
- Admin users see an Admin Dashboard with user management options to add, update, or remove users.
- Staff users such as videographers see a Staff Dashboard without user management.
- The dashboard shown after login matches the user's role.
- The profile menu offers My Profile, Settings, and Sign Out.
- Selecting Sign Out ends the session and returns the user to the login page.
- Selecting Delete on footage opens a confirmation dialog with Cancel and Delete options.
- Confirming Delete removes the footage, and canceling leaves it unchanged.
- When no footage exists, the dashboard shows an empty state with an Upload Footage button.

**Subtasks:**
- Add role check after login
- Build Admin Dashboard view
- Build Staff Dashboard view
- Build profile menu with My Profile, Settings, and Sign Out
- Build delete confirmation dialog

---

## Notes

- All four stories are under the SimplyVision Epic (SV-5) in Jira and are in To Do.
- Sprints and story points will be assigned after the team reviews the stories together.
- Implementation will begin once the team finalizes the tech stack.
