# TASKS.md - Pet Spa Platform (WashPet)

## Phase 1: Foundation (Completed ✅)
- [x] **Project Setup**: Clone repo, install dependencies.
- [x] **Database (Basic)**: `bookings` table, RLS policies.
- [x] **Frontend (User)**: Landing page, `BookingForm`.
- [x] **Line Bot**: Integrate DeepSeek, deploy to Supabase Edge Functions.
- [x] **CI/CD**: `publish_pet_spa.py` for Lovable auto-publish.
- [x] **Auth**: Supabase Auth integration (Login/Register).
- [x] **User Dashboard**: View booking history.

## Phase 2: Provider Ecosystem (In Progress 🚧)
- [x] **Database Migration**: `providers` table created.
- [ ] **Storage Setup**: Create buckets for `licenses` and `portfolio`.
- [ ] **Frontend (Provider)**:
    - **Registration Page**: 
        - Fields: Bio, Experience, Service Area.
        - **Verification**: Upload License (KCT/TGA/PGA) & Police Record (良民證).
        - **Portfolio**: Upload Before/After photos.
    - Provider Dashboard (View incoming requests).
- [ ] **Logic**:
    - Status state machine (Pending -> Confirmed -> Completed).

## Phase 3: Operations & Growth (Planned 📅)
- [ ] **Admin Panel**: For platform owner to oversee all orders.
- [ ] **Payment**: Integrate Stripe or local payment (ECPay/Line Pay).
- [ ] **Reviews**: User rating system for providers.
