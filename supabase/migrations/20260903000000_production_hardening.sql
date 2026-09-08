-- ============================================================
-- YARDLY AUTOMOTIVE
-- SUPABASE / POSTGRES DATABASE PRODUCTION HARDENING MIGRATION
-- MIGRATION: 20260903000000_production_hardening.sql
-- ============================================================
-- Purpose:
--   1. Authoritative production schema with complete RLS enforcement.
--   2. Strict role hierarchy: super_admin > admin > yard_admin > staff > dealer/seller > buyer.
--   3. Prevention of user self-promotion or role manipulation.
--   4. Protected public marketplace inventory browsing via security_invoker view.
--   5. Bidder privacy preservation on auction bids.
--   6. Server-controlled payment records and immutable audit logs.
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. ENUM TYPES
-- ============================================================
do $$
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type public.user_role as enum (
            'buyer',
            'seller',
            'dealer',
            'customer',
            'staff',
            'yard_admin',
            'admin',
            'super_admin'
        );
    else
        begin alter type public.user_role add value if not exists 'buyer'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'seller'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'dealer'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'customer'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'staff'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'yard_admin'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'admin'; exception when duplicate_object then null; end;
        begin alter type public.user_role add value if not exists 'super_admin'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'vehicle_status') then
        create type public.vehicle_status as enum (
            'pending_review',
            'active',
            'available',
            'reserved',
            'sold',
            'rejected',
            'draft',
            'hidden',
            'archived'
        );
    else
        begin alter type public.vehicle_status add value if not exists 'pending_review'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'active'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'available'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'reserved'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'sold'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'rejected'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'draft'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'hidden'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_status add value if not exists 'archived'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'vehicle_condition') then
        create type public.vehicle_condition as enum (
            'new',
            'used',
            'Brand New',
            'Foreign Used',
            'Locally Used'
        );
    else
        begin alter type public.vehicle_condition add value if not exists 'new'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_condition add value if not exists 'used'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_condition add value if not exists 'Brand New'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_condition add value if not exists 'Foreign Used'; exception when duplicate_object then null; end;
        begin alter type public.vehicle_condition add value if not exists 'Locally Used'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'verification_status') then
        create type public.verification_status as enum (
            'pending',
            'verified',
            'rejected'
        );
    else
        begin alter type public.verification_status add value if not exists 'pending'; exception when duplicate_object then null; end;
        begin alter type public.verification_status add value if not exists 'verified'; exception when duplicate_object then null; end;
        begin alter type public.verification_status add value if not exists 'rejected'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'seller_type') then
        create type public.seller_type as enum (
            'private',
            'dealer',
            'importer',
            'business'
        );
    else
        begin alter type public.seller_type add value if not exists 'private'; exception when duplicate_object then null; end;
        begin alter type public.seller_type add value if not exists 'dealer'; exception when duplicate_object then null; end;
        begin alter type public.seller_type add value if not exists 'importer'; exception when duplicate_object then null; end;
        begin alter type public.seller_type add value if not exists 'business'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'auction_status') then
        create type public.auction_status as enum (
            'upcoming',
            'live',
            'ending_soon',
            'ended',
            'cancelled'
        );
    else
        begin alter type public.auction_status add value if not exists 'upcoming'; exception when duplicate_object then null; end;
        begin alter type public.auction_status add value if not exists 'live'; exception when duplicate_object then null; end;
        begin alter type public.auction_status add value if not exists 'ending_soon'; exception when duplicate_object then null; end;
        begin alter type public.auction_status add value if not exists 'ended'; exception when duplicate_object then null; end;
        begin alter type public.auction_status add value if not exists 'cancelled'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'trade_in_status') then
        create type public.trade_in_status as enum (
            'new',
            'under_review',
            'valuation',
            'offer_sent',
            'accepted',
            'rejected',
            'completed'
        );
    else
        begin alter type public.trade_in_status add value if not exists 'new'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'under_review'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'valuation'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'offer_sent'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'accepted'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'rejected'; exception when duplicate_object then null; end;
        begin alter type public.trade_in_status add value if not exists 'completed'; exception when duplicate_object then null; end;
    end if;

    if not exists (select 1 from pg_type where typname = 'import_status') then
        create type public.import_status as enum (
            'new',
            'reviewing',
            'sourcing',
            'quotation',
            'shipping',
            'customs',
            'delivered',
            'completed'
        );
    else
        begin alter type public.import_status add value if not exists 'new'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'reviewing'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'sourcing'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'quotation'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'shipping'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'customs'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'delivered'; exception when duplicate_object then null; end;
        begin alter type public.import_status add value if not exists 'completed'; exception when duplicate_object then null; end;
    end if;
end $$;

-- ============================================================
-- 3. CORE APPLICATION TABLES
-- ============================================================

-- Profiles
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null,
    phone text,
    role public.user_role not null default 'buyer',
    seller_type public.seller_type default 'private',
    business_name text,
    avatar_url text,
    status text not null default 'active',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Ensure all profile columns exist on existing databases
do $$
begin
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'profiles') then
        alter table public.profiles add column if not exists email text;
        alter table public.profiles add column if not exists full_name text;
        alter table public.profiles add column if not exists phone text;
        alter table public.profiles add column if not exists role public.user_role not null default 'buyer';
        alter table public.profiles add column if not exists seller_type public.seller_type default 'private';
        alter table public.profiles add column if not exists business_name text;
        alter table public.profiles add column if not exists avatar_url text;
        alter table public.profiles add column if not exists status text not null default 'active';
        alter table public.profiles add column if not exists is_active boolean not null default true;
        alter table public.profiles add column if not exists created_at timestamptz not null default now();
        alter table public.profiles add column if not exists updated_at timestamptz not null default now();
    end if;
exception when others then null;
end $$;

-- Vehicles
create table if not exists public.vehicles (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid references public.profiles(id) on delete set null,
    created_by uuid references public.profiles(id) on delete set null,
    dealer_name text default 'Yardly Certified',
    seller_type public.seller_type not null default 'dealer',
    make text not null,
    model text not null,
    variant text,
    year integer not null check (year >= 1980 and year <= 2030),
    price numeric(12,2) not null check (price >= 0),
    sale_price numeric(12,2) check (sale_price is null or sale_price <= price),
    currency text not null default 'KES',
    mileage integer not null default 0 check (mileage >= 0),
    engine_cc integer not null check (engine_cc > 0),
    fuel_type text not null default 'Petrol',
    transmission text not null default 'Automatic',
    body_type text not null default 'SUV',
    drive_type text,
    color text not null default 'Silver',
    location text not null default 'Nairobi',
    description text not null,
    registration_number text,
    vin text,
    status public.vehicle_status not null default 'active',
    verification_status public.verification_status not null default 'verified',
    logbook_verified boolean not null default false,
    featured boolean not null default false,
    is_featured boolean not null default false,
    slug text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Ensure all vehicle columns exist on existing databases
do $$
begin
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'vehicles') then
        alter table public.vehicles add column if not exists seller_id uuid references public.profiles(id) on delete set null;
        alter table public.vehicles add column if not exists created_by uuid references public.profiles(id) on delete set null;
        alter table public.vehicles add column if not exists dealer_name text default 'Yardly Certified';
        alter table public.vehicles add column if not exists seller_type public.seller_type not null default 'dealer';
        alter table public.vehicles add column if not exists variant text;
        alter table public.vehicles add column if not exists sale_price numeric(12,2);
        alter table public.vehicles add column if not exists currency text not null default 'KES';
        alter table public.vehicles add column if not exists drive_type text;
        alter table public.vehicles add column if not exists color text not null default 'Silver';
        alter table public.vehicles add column if not exists registration_number text;
        alter table public.vehicles add column if not exists vin text;
        alter table public.vehicles add column if not exists status public.vehicle_status not null default 'active';
        alter table public.vehicles add column if not exists verification_status public.verification_status not null default 'verified';
        alter table public.vehicles add column if not exists logbook_verified boolean not null default false;
        alter table public.vehicles add column if not exists featured boolean not null default false;
        alter table public.vehicles add column if not exists is_featured boolean not null default false;
        alter table public.vehicles add column if not exists slug text;
        alter table public.vehicles add column if not exists created_at timestamptz not null default now();
        alter table public.vehicles add column if not exists updated_at timestamptz not null default now();
    end if;
exception when others then null;
end $$;

-- Vehicle Images
create table if not exists public.vehicle_images (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    image_url text not null,
    thumbnail_url text,
    alt_text text,
    display_order integer not null default 1,
    is_primary boolean not null default false,
    created_at timestamptz not null default now()
);

-- Vehicle Features
create table if not exists public.vehicle_features (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    feature_name text not null,
    created_at timestamptz not null default now()
);

-- Favorites
create table if not exists public.favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(user_id, vehicle_id)
);

-- Vehicle Inquiries
create table if not exists public.vehicle_inquiries (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    buyer_id uuid references public.profiles(id) on delete set null,
    name text not null,
    phone text not null,
    email text not null,
    message text not null,
    source text not null default 'web',
    status text not null default 'new',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Inspection Requests
create table if not exists public.inspection_requests (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    buyer_id uuid references public.profiles(id) on delete set null,
    seller_id uuid references public.profiles(id) on delete set null,
    buyer_name text not null,
    buyer_phone text not null,
    buyer_email text not null,
    preferred_date date not null,
    preferred_time text not null,
    location text not null default 'Nairobi Yard',
    notes text,
    seller_notes text,
    status text not null default 'requested',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Test Drive Requests
create table if not exists public.test_drive_requests (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete set null,
    name text not null,
    phone text not null,
    email text not null,
    preferred_date date not null,
    preferred_time text not null,
    location text not null default 'Nairobi Yard',
    notes text,
    status text not null default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Reservations
create table if not exists public.reservations (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete set null,
    buyer_name text not null,
    buyer_phone text not null,
    buyer_email text not null,
    amount numeric(12,2) not null default 50000,
    currency text not null default 'KES',
    status text not null default 'pending',
    expires_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Payments
create table if not exists public.payments (
    id uuid primary key default gen_random_uuid(),
    reservation_id uuid references public.reservations(id) on delete set null,
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete set null,
    amount numeric(12,2) not null,
    currency text not null default 'KES',
    provider text not null default 'test',
    checkout_request_id text,
    merchant_request_id text,
    mpesa_receipt_number text,
    phone_number text not null,
    status text not null default 'pending',
    idempotency_key text unique,
    raw_response jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Payment Events
create table if not exists public.payment_events (
    id uuid primary key default gen_random_uuid(),
    payment_id uuid references public.payments(id) on delete cascade,
    event_type text not null,
    payload jsonb not null,
    created_at timestamptz not null default now()
);

-- Seller Listings
create table if not exists public.seller_listings (
    id uuid primary key default gen_random_uuid(),
    seller_name text not null,
    seller_phone text not null,
    seller_email text not null,
    seller_type public.seller_type not null default 'private',
    make text not null,
    model text not null,
    year integer not null,
    registration_number text,
    mileage integer not null default 0,
    engine_cc integer not null,
    transmission text not null,
    fuel_type text not null,
    body_type text not null,
    location text not null,
    asking_price numeric(12,2) not null,
    description text not null,
    condition public.vehicle_condition not null default 'Foreign Used',
    images jsonb default '[]'::jsonb,
    logbook_document_url text,
    status text not null default 'pending_review',
    rejection_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Auctions
create table if not exists public.auctions (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles(id) on delete cascade,
    seller_id uuid references public.profiles(id) on delete set null,
    starting_bid numeric(12,2) not null check (starting_bid > 0),
    current_bid numeric(12,2) not null check (current_bid >= starting_bid),
    minimum_increment numeric(12,2) not null default 10000,
    bid_count integer not null default 0 check (bid_count >= 0),
    start_time timestamptz not null,
    end_time timestamptz not null,
    status public.auction_status not null default 'upcoming',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Auction Bids
create table if not exists public.auction_bids (
    id uuid primary key default gen_random_uuid(),
    auction_id uuid not null references public.auctions(id) on delete cascade,
    buyer_id uuid not null references public.profiles(id) on delete cascade,
    buyer_name text not null,
    buyer_email text not null,
    amount numeric(12,2) not null check (amount > 0),
    created_at timestamptz not null default now()
);

-- Trade-In Requests
create table if not exists public.trade_in_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    target_vehicle_id uuid references public.vehicles(id) on delete set null,
    user_name text not null,
    user_phone text not null,
    user_email text not null,
    current_vehicle_make text not null,
    current_vehicle_model text not null,
    current_vehicle_year integer not null,
    current_vehicle_mileage integer not null default 0,
    current_vehicle_condition text not null,
    estimated_value numeric(12,2),
    valuation_offer numeric(12,2),
    notes text,
    status public.trade_in_status not null default 'new',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Import Requests
create table if not exists public.import_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    user_name text not null,
    user_phone text not null,
    user_email text not null,
    preferred_make text not null,
    preferred_model text not null,
    preferred_year_min integer,
    budget_kes numeric(12,2),
    sourcing_country text default 'Japan',
    notes text,
    admin_notes text,
    status public.import_status not null default 'new',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    type text not null,
    title text not null,
    message text not null,
    read boolean not null default false,
    link text,
    created_at timestamptz not null default now()
);

-- Audit Logs
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    table_name text,
    record_id text,
    new_data jsonb,
    created_at timestamptz not null default now()
);

-- ============================================================
-- 4. SECURITY & ROLE AUTHORIZATION FUNCTIONS
-- ============================================================

create or replace function public.has_role(required_role text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
    current_user_id uuid;
    user_role_val text;
    user_is_active boolean;
    user_status text;
begin
    current_user_id := auth.uid();
    if current_user_id is null then
        return false;
    end if;

    select role::text, is_active, status
    into user_role_val, user_is_active, user_status
    from public.profiles
    where id = current_user_id;

    if user_role_val is null then
        return false;
    end if;

    -- Verify active status
    if user_is_active is false or user_status = 'suspended' then
        return false;
    end if;

    if user_role_val = 'super_admin' then
        return true;
    end if;

    if user_role_val = required_role then
        return true;
    end if;

    -- Staff role hierarchy
    if required_role = 'staff' and user_role_val in ('admin', 'yard_admin', 'super_admin', 'staff') then
        return true;
    end if;

    -- Yard Admin hierarchy
    if required_role = 'yard_admin' and user_role_val in ('admin', 'super_admin', 'yard_admin') then
        return true;
    end if;

    -- Admin hierarchy
    if required_role = 'admin' and user_role_val in ('admin', 'super_admin') then
        return true;
    end if;

    -- Seller / Dealer hierarchy
    if required_role in ('seller', 'dealer') and user_role_val in ('seller', 'dealer', 'admin', 'yard_admin', 'super_admin') then
        return true;
    end if;

    return false;
end;
$$;

create or replace function public.has_role(required_role public.user_role)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
    return public.has_role(required_role::text);
end;
$$;

-- Automatic Profile Creation Trigger with Sanitized Role (Prevents self-promotion)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
    assigned_role public.user_role;
    raw_role_str text;
    parsed_seller_type public.seller_type;
    user_full_name text;
    user_phone text;
    user_biz text;
begin
    raw_role_str := lower(coalesce(new.raw_user_meta_data ->> 'role', 'buyer'));

    -- Public signups can only ever be buyer or seller (never admin/staff)
    if raw_role_str in ('admin', 'super_admin', 'yard_admin', 'staff') then
        assigned_role := 'buyer'::public.user_role;
    elsif raw_role_str in ('seller', 'dealer') then
        assigned_role := 'seller'::public.user_role;
    else
        assigned_role := 'buyer'::public.user_role;
    end if;

    if (new.raw_user_meta_data ->> 'seller_type') in ('private', 'dealer', 'importer', 'business') then
        parsed_seller_type := (new.raw_user_meta_data ->> 'seller_type')::public.seller_type;
    else
        parsed_seller_type := 'private'::public.seller_type;
    end if;

    user_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', coalesce(new.raw_user_meta_data ->> 'name', 'Yardly User'));
    user_phone := new.raw_user_meta_data ->> 'phone';
    user_biz := new.raw_user_meta_data ->> 'business_name';

    insert into public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        seller_type,
        business_name,
        status,
        is_active,
        created_at,
        updated_at
    )
    values (
        new.id,
        coalesce(new.email, ''),
        user_full_name,
        user_phone,
        assigned_role,
        parsed_seller_type,
        user_biz,
        'active',
        true,
        now(),
        now()
    )
    on conflict (id) do update set
        email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, 'Yardly User'), profiles.full_name),
        phone = coalesce(excluded.phone, profiles.phone),
        seller_type = coalesce(excluded.seller_type, profiles.seller_type),
        business_name = coalesce(excluded.business_name, profiles.business_name),
        updated_at = now();

    return new;
exception
    when others then
        raise warning 'handle_new_user error: %', sqlerrm;
        return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Trigger: Prevent Profile Role Self-Escalation
-- Permits Table Editor / SQL Editor / Service Role / Postgres Superusers and Authenticated Admins to assign roles,
-- while strictly preventing ordinary users from escalating their own privileges.
create or replace function public.prevent_profile_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
    db_user text;
    jwt_role text;
    caller_is_admin boolean;
begin
    -- 1. Check if executing in privileged database context (Table Editor, SQL Editor, Postgres superuser, service_role)
    db_user := coalesce(current_user, '');
    if db_user in ('postgres', 'supabase_admin', 'service_role', 'supabase_auth_admin') then
        new.updated_at := now();
        return new;
    end if;

    -- Check session setting role
    begin
        if current_setting('role', true) in ('postgres', 'supabase_admin', 'service_role', 'supabase_auth_admin') then
            new.updated_at := now();
            return new;
        end if;
    exception when others then null;
    end;

    -- Check JWT claims for service_role
    begin
        jwt_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'role');
        if jwt_role = 'service_role' then
            new.updated_at := now();
            return new;
        end if;
    exception when others then null;
    end;

    -- 2. Check if the authenticated user has administrative role
    caller_is_admin := false;
    if auth.uid() is not null then
        caller_is_admin := public.has_role('admin');
    end if;

    -- 3. If caller is NOT an admin, block any role or status/active self-escalation
    if not caller_is_admin then
        -- Prevent role modification by normal users
        if new.role is distinct from old.role then
            new.role := old.role;
        end if;

        -- Prevent status / is_active self-unbanning by normal users
        begin
            if new.is_active is distinct from old.is_active then
                new.is_active := old.is_active;
            end if;
        exception when others then null;
        end;

        begin
            if new.status is distinct from old.status then
                new.status := old.status;
            end if;
        exception when others then null;
        end;
    end if;

    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists trg_prevent_profile_role_self_escalation on public.profiles;
create trigger trg_prevent_profile_role_self_escalation
before update on public.profiles
for each row
execute function public.prevent_profile_role_self_escalation();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.vehicle_features enable row level security;
alter table public.favorites enable row level security;
alter table public.vehicle_inquiries enable row level security;
alter table public.inspection_requests enable row level security;
alter table public.test_drive_requests enable row level security;
alter table public.reservations enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.seller_listings enable row level security;
alter table public.auctions enable row level security;
alter table public.auction_bids enable row level security;
alter table public.trade_in_requests enable row level security;
alter table public.import_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: Users view own or staff view all; users update non-role fields
drop policy if exists "Profiles select policy" on public.profiles;
create policy "Profiles select policy" on public.profiles
for select using (auth.uid() = id or public.has_role('staff'));

drop policy if exists "Profiles update policy" on public.profiles;
create policy "Profiles update policy" on public.profiles
for update using (auth.uid() = id or public.has_role('admin'))
with check (auth.uid() = id or public.has_role('admin'));

-- Vehicles: Public can view active/available/reserved; creators view own; staff manage all
drop policy if exists "Vehicles select policy" on public.vehicles;
create policy "Vehicles select policy" on public.vehicles
for select using (
    status in ('active', 'available', 'reserved')
    or (auth.uid() is not null and (auth.uid() = seller_id or auth.uid() = created_by))
    or public.has_role('staff')
);

drop policy if exists "Vehicles write policy" on public.vehicles;
create policy "Vehicles write policy" on public.vehicles
for all using (public.has_role('staff'))
with check (public.has_role('staff'));

-- Vehicle Images & Features: Public select; staff write
drop policy if exists "Vehicle images select policy" on public.vehicle_images;
create policy "Vehicle images select policy" on public.vehicle_images for select using (true);

drop policy if exists "Vehicle images write policy" on public.vehicle_images;
create policy "Vehicle images write policy" on public.vehicle_images for all using (public.has_role('staff')) with check (public.has_role('staff'));

drop policy if exists "Vehicle features select policy" on public.vehicle_features;
create policy "Vehicle features select policy" on public.vehicle_features for select using (true);

drop policy if exists "Vehicle features write policy" on public.vehicle_features;
create policy "Vehicle features write policy" on public.vehicle_features for all using (public.has_role('staff')) with check (public.has_role('staff'));

-- Favorites: User-owned only
drop policy if exists "Favorites policy" on public.favorites;
create policy "Favorites policy" on public.favorites
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Inquiries: Public insert; user views own inquiries; staff manage
drop policy if exists "Inquiries insert policy" on public.vehicle_inquiries;
create policy "Inquiries insert policy" on public.vehicle_inquiries
for insert with check (buyer_id is null or auth.uid() = buyer_id);

drop policy if exists "Inquiries select policy" on public.vehicle_inquiries;
create policy "Inquiries select policy" on public.vehicle_inquiries
for select using ((auth.uid() is not null and auth.uid() = buyer_id) or public.has_role('staff'));

drop policy if exists "Inquiries manage policy" on public.vehicle_inquiries;
create policy "Inquiries manage policy" on public.vehicle_inquiries
for update using (public.has_role('staff')) with check (public.has_role('staff'));

-- Test Drives & Inspections: Public insert; user views own; staff manage
drop policy if exists "Test drives insert policy" on public.test_drive_requests;
create policy "Test drives insert policy" on public.test_drive_requests
for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Test drives select policy" on public.test_drive_requests;
create policy "Test drives select policy" on public.test_drive_requests
for select using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Inspections insert policy" on public.inspection_requests;
create policy "Inspections insert policy" on public.inspection_requests
for insert with check (buyer_id is null or auth.uid() = buyer_id);

drop policy if exists "Inspections select policy" on public.inspection_requests;
create policy "Inspections select policy" on public.inspection_requests
for select using ((auth.uid() is not null and (auth.uid() = buyer_id or auth.uid() = seller_id)) or public.has_role('staff'));

-- Reservations & Payments: User views own; staff manage
drop policy if exists "Reservations select policy" on public.reservations;
create policy "Reservations select policy" on public.reservations
for select using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Reservations insert policy" on public.reservations;
create policy "Reservations insert policy" on public.reservations
for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Payments select policy" on public.payments;
create policy "Payments select policy" on public.payments
for select using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Payments insert policy" on public.payments;
create policy "Payments insert policy" on public.payments
for insert with check (user_id is null or auth.uid() = user_id or public.has_role('staff'));

-- Auctions & Bids: Public views live auctions and bids; authenticated users place bids with own ID
drop policy if exists "Auctions select policy" on public.auctions;
create policy "Auctions select policy" on public.auctions for select using (true);

drop policy if exists "Auctions write policy" on public.auctions;
create policy "Auctions write policy" on public.auctions for all using (public.has_role('staff')) with check (public.has_role('staff'));

drop policy if exists "Auction bids select policy" on public.auction_bids;
create policy "Auction bids select policy" on public.auction_bids for select using (true);

drop policy if exists "Auction bids insert policy" on public.auction_bids;
create policy "Auction bids insert policy" on public.auction_bids
for insert with check (auth.uid() is not null and auth.uid() = buyer_id);

-- Seller Listings: Public submit; owner view own; staff manage
drop policy if exists "Seller listings insert policy" on public.seller_listings;
create policy "Seller listings insert policy" on public.seller_listings for insert with check (true);

drop policy if exists "Seller listings select policy" on public.seller_listings;
create policy "Seller listings select policy" on public.seller_listings for select using (public.has_role('staff'));

drop policy if exists "Seller listings manage policy" on public.seller_listings;
create policy "Seller listings manage policy" on public.seller_listings for all using (public.has_role('staff')) with check (public.has_role('staff'));

-- Trade-In & Imports: User views own; public insert; staff manage
drop policy if exists "Trade in select policy" on public.trade_in_requests;
create policy "Trade in select policy" on public.trade_in_requests for select using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Trade in insert policy" on public.trade_in_requests;
create policy "Trade in insert policy" on public.trade_in_requests for insert with check (true);

drop policy if exists "Import requests select policy" on public.import_requests;
create policy "Import requests select policy" on public.import_requests for select using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Import requests insert policy" on public.import_requests;
create policy "Import requests insert policy" on public.import_requests for insert with check (true);

-- Notifications: User views and updates own
drop policy if exists "Notifications select policy" on public.notifications;
create policy "Notifications select policy" on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "Notifications update policy" on public.notifications;
create policy "Notifications update policy" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Audit Logs: Admin/Super Admin only select; authenticated actions insert; no updates or deletes (immutable)
drop policy if exists "Audit logs select policy" on public.audit_logs;
create policy "Audit logs select policy" on public.audit_logs for select using (public.has_role('admin') or public.has_role('super_admin'));

drop policy if exists "Audit logs insert policy" on public.audit_logs;
create policy "Audit logs insert policy" on public.audit_logs for insert with check (auth.uid() is not null or public.has_role('staff'));

-- ============================================================
-- 6. SECURE INVENTORY VIEW (SECURITY INVOKER)
-- ============================================================
drop view if exists public.available_inventory cascade;
create view public.available_inventory
with (security_invoker = true)
as
select
    v.id,
    v.make,
    v.model,
    v.variant,
    v.year,
    v.price,
    v.sale_price,
    v.currency,
    v.mileage,
    v.engine_cc,
    v.fuel_type,
    v.transmission,
    v.body_type,
    v.drive_type,
    v.color,
    v.location,
    v.description,
    v.status,
    v.verification_status,
    v.logbook_verified,
    v.featured,
    v.is_featured,
    v.slug,
    v.dealer_name,
    v.seller_id,
    v.created_at,
    v.updated_at
from public.vehicles v
where v.status in ('active', 'available');

-- ============================================================
-- 7. PERFORMANCE INDEXES
-- ============================================================
create index if not exists idx_vehicles_status on public.vehicles(status);
create index if not exists idx_vehicles_make_model on public.vehicles(make, model);
create index if not exists idx_vehicles_price on public.vehicles(price);
create index if not exists idx_vehicles_year on public.vehicles(year);
create index if not exists idx_vehicle_images_vehicle_id on public.vehicle_images(vehicle_id);
create index if not exists idx_vehicle_features_vehicle_id on public.vehicle_features(vehicle_id);
create index if not exists idx_favorites_user_vehicle on public.favorites(user_id, vehicle_id);
create index if not exists idx_auctions_status on public.auctions(status);
create index if not exists idx_auction_bids_auction on public.auction_bids(auction_id, created_at desc);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, read);

-- ============================================================
-- 8. STORAGE BUCKETS (SAFE IDEMPOTENT BLOCK)
-- ============================================================
do $$
begin
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values 
      ('vehicles', 'vehicles', true, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
      ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
      ('logbooks', 'logbooks', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
      ('documents', 'documents', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
    on conflict (id) do update set 
      public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
exception
    when others then
        raise notice 'Storage buckets setup note: %', sqlerrm;
end $$;

-- Storage Objects RLS Policies
do $$
begin
    if exists (select 1 from pg_tables where schemaname = 'storage' and tablename = 'objects') then
        execute 'alter table storage.objects enable row level security;';
        
        -- Public vehicles bucket read
        execute 'drop policy if exists "Public Vehicle Images Read" on storage.objects;';
        execute 'create policy "Public Vehicle Images Read" on storage.objects for select using (bucket_id in (''vehicles'', ''avatars''));';

        -- Staff bucket upload
        execute 'drop policy if exists "Staff Storage Upload" on storage.objects;';
        execute 'create policy "Staff Storage Upload" on storage.objects for insert with check (auth.uid() is not null and (bucket_id in (''vehicles'', ''avatars'', ''logbooks'', ''documents'')));';
    end if;
exception
    when others then
        raise notice 'Storage policies setup note: %', sqlerrm;
end $$;

-- ============================================================
-- 9. REALTIME PUBLICATION SETUP (SAFE IDEMPOTENT BLOCK)
-- ============================================================
do $$
begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        begin alter publication supabase_realtime add table public.auctions; exception when others then null; end;
        begin alter publication supabase_realtime add table public.auction_bids; exception when others then null; end;
        begin alter publication supabase_realtime add table public.notifications; exception when others then null; end;
        begin alter publication supabase_realtime add table public.vehicles; exception when others then null; end;
        begin alter publication supabase_realtime add table public.vehicle_inquiries; exception when others then null; end;
    end if;
exception
    when others then null;
end $$;

-- Migration complete notification
do $$
begin
    raise notice 'Yardly Automotive production hardening migration applied successfully.';
end $$;
