# KYC Database Migration Guide

## Overview
The KYC system now requires additional columns in the `users` table to store NID, license plate, and KYC status.

## Steps to Run the Migration

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Click on **SQL Editor** in the left sidebar
- Click **New Query**

### 2. Copy and Paste the Migration SQL
Copy the SQL below and paste it into the SQL editor:

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS nid VARCHAR(30),
ADD COLUMN IF NOT EXISTS license_plate VARCHAR(30),
ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending','approved','rejected','resubmit_requested'));

CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);
```

### 3. Execute the Query
Click the **Run** button (or press `Ctrl+Enter`)

You should see a success message indicating the columns were added.

## What This Does

- **nid**: Stores the user's National ID number
- **license_plate**: Stores the driver's license plate (for drivers only)
- **kyc_status**: Tracks the KYC verification status:
  - `pending` — Application submitted, waiting for review
  - `approved` — User verified and approved
  - `rejected` — Application rejected
  - `resubmit_requested` — Admin asked for additional info

## After Migration

Once the migration is complete:

1. **New registrations** will have their KYC data saved
2. **Admin panel** will show pending KYC requests
3. **Admins can**:
   - Approve submissions
   - Reject submissions with a reason
   - Request resubmission if info is incomplete
4. **Users will**:
   - See their submitted details
   - Be notified when approval status changes
   - Be able to resubmit if requested by admin

## Troubleshooting

**"Column already exists"** — This is fine, the migration uses `IF NOT EXISTS` so it's safe to run multiple times.

**No changes visible** — Try refreshing your browser and logging out/in again.

**NID still shows as "—"** — Make sure the columns were created successfully, then test with a new registration.
