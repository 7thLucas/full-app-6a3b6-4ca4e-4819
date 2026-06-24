Build a production-quality web app prototype called “Mino Autopilot” for Omni HR.

Use agentic AI scaffold.

The product is an agentic HR operating layer that turns Omni HR from a system of record into a system of action. It should help HR teams detect issues, recommend actions, route approvals, and execute workflows safely across payroll, onboarding, compliance, retention, and performance.

The app must feel world-class, premium, simple, and extremely usable. Think Linear, Notion, Vercel, Rippling, and modern enterprise SaaS. Clean white interface, soft neutral background, strong typography, lots of whitespace, rounded cards, subtle shadows, calm blue accent color, minimal clutter, excellent empty states, and smooth micro-interactions.

Core concept:
Mino Autopilot is not just a chatbot. It is an agentic HR command center. The home screen should show “What HR should act on today” with prioritized agent-generated recommendations.

Main navigation:
1. Today
2. Agent Missions
3. Payroll Close
4. Onboarding
5. Compliance
6. Retention
7. Approvals
8. Audit Log
9. Settings

Core screens:

1. Today Dashboard
Create a beautiful dashboard with:
- Greeting: “Good morning, Sarah”
- Main headline: “7 HR actions need your attention today”
- Priority cards grouped by severity: Critical, Important, Suggested
- Each card should show:
  - Issue title
  - Short AI-generated explanation
  - Impact
  - Suggested next action
  - Confidence score
  - Required approval status
  - CTA buttons: Review, Approve, Ask Mino
Example cards:
- Payroll anomaly detected in Indonesia Ops
- 3 Singapore employees missing statutory documents
- Attrition risk cluster in Philippines Support
- 2 new hires blocked before day one
- 12 managers have not submitted performance reviews

2. Agent Missions
Create a mission control page where HR can launch agentic workflows.
Mission cards:
- Payroll Close Mission
- New Hire Launch Mission
- Compliance Watch Mission
- Attrition Prevention Mission
- Performance Calibration Mission
- Workforce Planning Mission

Each mission card should include:
- What it does
- Estimated time saved
- Risk level
- Last run
- Button: Launch Mission

When launched, show a step-by-step agent progress view:
- Reading HR data
- Checking policy
- Detecting anomalies
- Preparing recommendations
- Routing approvals
- Ready to execute

3. Payroll Close Mission
Create a flagship flow:
User clicks “Prepare payroll close”.
Mino analyzes multi-country payroll across Singapore, Indonesia, Malaysia, Philippines, and Hong Kong.

Show:
- Country-by-country payroll summary
- Headcount changes
- Salary variance
- Overtime variance
- Expense variance
- Leave impact
- Compliance flags
- Suggested explanation for Finance
- Approval checklist

Include a strong CTA:
“Approve payroll packet”

Also include a secondary CTA:
“Ask Mino to explain”

4. Onboarding Autopilot
Show new hires starting soon.
For each hire:
- Name
- Country
- Start date
- Manager
- Completion status
- Blockers
- Required documents
- Equipment status
- Training status

Agent should recommend next actions:
- Send reminder to IT
- Ask manager to complete first-week plan
- Request missing bank details
- Prepare welcome email

5. Compliance Watch
Show a clean compliance monitoring interface.
Include:
- Upcoming statutory deadlines
- Missing documents
- Country-specific risks
- Policy gaps
- Severity labels
- Owner
- Deadline
- Suggested remediation

Countries to include:
Singapore, Indonesia, Malaysia, Philippines, Hong Kong.

6. Retention Autopilot
Create a people-risk page.
Show team-level insights, not creepy individual surveillance.
Include:
- Risk clusters
- Engagement trend
- Leave pattern changes
- Manager changes
- Suggested intervention
- Recommended HR action plan

Example:
“Philippines Support shows elevated attrition risk. Leave usage increased 28%, engagement dropped 14%, and manager change happened 21 days ago. Suggested action: manager check-in plan plus HR pulse survey.”

7. Approvals
Create an approvals inbox.
Each approval item should show:
- Requested action
- Agent reasoning
- Data used
- Risk level
- Human approver
- Buttons: Approve, Reject, Request Changes

Important: make the product feel safe. Mino should never execute sensitive HR actions without approval.

8. Audit Log
Create a transparent audit trail.
Show:
- Timestamp
- Agent action
- Data accessed
- Reasoning summary
- Human approval
- Final action taken

This is critical for enterprise trust.

9. Ask Mino panel
Add a right-side AI assistant drawer available across the app.
The assistant should feel like an HR chief of staff.
Example prompts:
- “Why did payroll increase this month?”
- “Which onboarding tasks are blocked?”
- “What compliance risks are due this week?”
- “Prepare a summary for Finance”
- “Draft reminders for managers”

The assistant should answer with concise, structured responses and always include suggested next actions.

Agentic AI scaffold behavior:
Use agentic AI scaffold to create specialized HR agents:
- Payroll Agent
- Compliance Agent
- Onboarding Agent
- Retention Agent
- Performance Agent
- Approval Routing Agent
- Audit Agent

Each agent should have:
- Goal
- Inputs
- Reasoning summary
- Suggested action
- Required approval level
- Execution status

The scaffold should make the agents feel like they are coordinating behind the scenes, not acting randomly.

Data:
Use realistic dummy data for a 340-person company operating across Singapore, Indonesia, Malaysia, Philippines, and Hong Kong.
Create sample employees, teams, managers, payroll items, onboarding tasks, compliance documents, and approval records.
Do not require real integrations. Mock the backend and make the prototype feel realistic.

UI/UX requirements:
- World-class enterprise SaaS design
- Simple, clean, premium, modern
- Mobile responsive but optimize for desktop
- Use a left sidebar navigation
- Use a top command bar with search and “Ask Mino”
- Use cards, tables, status badges, and progress timelines
- Use calm colors: white, slate, soft blue, green for completed, amber for warning, red for critical
- Avoid clutter
- Prioritize readability
- Use beautiful spacing
- Use smooth transitions
- Make every screen feel demo-ready for investors and HR leaders

Homepage emotional goal:
The user should immediately feel:
“Omni does not just store HR data anymore. Omni runs HR operations safely with AI.”

Primary demo flow:
1. User opens Today Dashboard
2. Sees payroll anomaly and onboarding blocker
3. Clicks Payroll Close Mission
4. Mino runs agentic workflow
5. Mino produces payroll packet
6. User reviews reasoning and audit trail
7. User approves action
8. Mino marks it complete

Definition of done:
- Fully clickable prototype
- Beautiful dashboard
- Working navigation
- Agent Mission flow
- Payroll Close demo flow
- Ask Mino assistant drawer
- Approval safety layer
- Audit log
- Realistic mock data
- No broken buttons
- Investor-demo quality