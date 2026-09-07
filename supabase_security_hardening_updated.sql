-- ============================================================
-- YARDLY AUTOMOTIVE — PRODUCTION DATABASE SECURITY HARDENING
-- UPDATED VERSION
-- ============================================================
-- Purpose:
--   1. Secure application views with security_invoker where appropriate.
--   2. Keep RLS enabled on every public table.
--   3. Remove unsafe client-side access to audit/payment event data.
--   4. Prevent public exposure of auction bidder identity/email.
--   5. Keep customer-facing inquiry data separate from internal staff notes.
--   6. Add trusted database audit logging for important table changes.
--   7. Preserve staff/admin workflows and user-owned data access.
--
-- IMPORTANT:
--   Run this in Supabase SQL Editor as a privileged database role.
--   Take a database backup/snapshot first.
--
-- DESIGN ASSUMPTIONS:
--   - Yardly public visitors may browse inventory/auctions.
--   - Auction bidders are authenticated users.
--   - Payment and payment-event writes are performed by trusted
--     server-side/webhook code, not directly by browser clients.
--   - Audit logs are written by trusted database triggers.
--   - Guest submission workflows should be implemented through a
--     trusted endpoint/function with anti-spam/rate limiting. This
--     script intentionally does NOT grant anon unrestricted INSERT
--     access to sensitive tables.
-- ============================================================


-- ============================================================
-- 0. ENABLE RLS ON ALL KNOWN PUBLIC TABLES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.seller_profiles enable row level security;
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
alter table public.vehicle_history enable row level security;
alter table public.audit_logs enable row level security;


-- ============================================================
-- 1. SECURE PUBLIC INVENTORY VIEW
-- ============================================================
-- Keep security_invoker=true so the view respects vehicles RLS.
-- VIN is intentionally omitted from the public view.
-- Internal verification fields are also omitted.
-- Staff can query the base vehicles table directly under staff RLS.

drop view if exists public.available_inventory;

create view public.available_inventory
with (security_invoker = true)
as
select
    v.id,
    v.stock_number,
    v.make,
    v.model,
    v.variant,
    v.trim,
    v.year,
    v.condition,
    v.body_type,
    v.drivetrain,
    v.drive_type,
    v.transmission,
    v.fuel_type,
    v.engine,
    v.engine_cc,
    v.engine_size,
    v.color,
    v.exterior_color,
    v.interior_color,
    v.doors,
    v.seats,
    v.mileage,
    v.price,
    v.sale_price,
    v.monthly_payment,
    v.currency,
    v.title,
    v.description,
    v.status,
    v.is_featured,
    v.featured,
    v.location,
    v.slug,
    v.dealer_name,
    v.created_at,
    (
        select vi.image_url
        from public.vehicle_images vi
        where vi.vehicle_id = v.id
        order by vi.is_primary desc, vi.display_order asc, vi.sort_order asc
        limit 1
    ) as primary_image
from public.vehicles v
where v.status in ('active', 'available');

revoke all on public.available_inventory from anon, authenticated;
grant select on public.available_inventory to anon, authenticated, service_role;


-- ============================================================
-- 2. INQUIRIES VIEWS
-- ============================================================
-- Keep the existing compatibility view for authenticated/staff use,
-- but remove it from anonymous access.
-- Create a separate public-safe view without staff_notes/assigned_to.

drop view if exists public.inquiries;

create view public.inquiries
with (security_invoker = true)
as
select
    id,
    vehicle_id,
    user_id,
    buyer_id,
    seller_id,
    name,
    email,
    phone,
    subject,
    message,
    source,
    status,
    assigned_to,
    staff_notes,
    created_at,
    updated_at
from public.vehicle_inquiries;

revoke all on public.inquiries from anon;
grant select on public.inquiries to authenticated, service_role;
revoke insert, update, delete on public.inquiries from anon, authenticated;


drop view if exists public.inquiries_public;

create view public.inquiries_public
with (security_invoker = true)
as
select
    id,
    vehicle_id,
    user_id,
    buyer_id,
    seller_id,
    name,
    email,
    phone,
    subject,
    message,
    source,
    status,
    created_at,
    updated_at
from public.vehicle_inquiries;

revoke all on public.inquiries_public from anon, authenticated;
grant select on public.inquiries_public to authenticated, service_role;


-- ============================================================
-- 3. RLS POLICIES — PROFILES
-- ============================================================

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id or public.has_role('staff'));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id or public.has_role('staff'));


-- ============================================================
-- 4. BUYER / SELLER PROFILES
-- ============================================================

drop policy if exists "Users view own buyer profile" on public.buyer_profiles;
create policy "Users view own buyer profile"
on public.buyer_profiles
for select
using (auth.uid() = id or public.has_role('staff'));

drop policy if exists "Users update own buyer profile" on public.buyer_profiles;
create policy "Users update own buyer profile"
on public.buyer_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users insert own buyer profile" on public.buyer_profiles;
create policy "Users insert own buyer profile"
on public.buyer_profiles
for insert
with check (auth.uid() = id);


drop policy if exists "Users view own seller profile" on public.seller_profiles;
create policy "Users view own seller profile"
on public.seller_profiles
for select
using (auth.uid() = id or public.has_role('staff'));

drop policy if exists "Users update own seller profile" on public.seller_profiles;
create policy "Users update own seller profile"
on public.seller_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users insert own seller profile" on public.seller_profiles;
create policy "Users insert own seller profile"
on public.seller_profiles
for insert
with check (auth.uid() = id);


-- ============================================================
-- 5. VEHICLES & MEDIA
-- ============================================================

drop policy if exists "Public can view active vehicles" on public.vehicles;
create policy "Public can view active vehicles"
on public.vehicles
for select
using (
    status in ('active', 'available', 'reserved')
    or (
        auth.uid() is not null
        and (auth.uid() = seller_id or auth.uid() = created_by)
    )
    or public.has_role('staff')
);

drop policy if exists "Staff can manage vehicles" on public.vehicles;
create policy "Staff can manage vehicles"
on public.vehicles
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


drop policy if exists "Public can view vehicle images" on public.vehicle_images;
create policy "Public can view vehicle images"
on public.vehicle_images
for select
using (true);

drop policy if exists "Staff can manage vehicle images" on public.vehicle_images;
create policy "Staff can manage vehicle images"
on public.vehicle_images
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


drop policy if exists "Public can view vehicle features" on public.vehicle_features;
create policy "Public can view vehicle features"
on public.vehicle_features
for select
using (true);

drop policy if exists "Staff can manage vehicle features" on public.vehicle_features;
create policy "Staff can manage vehicle features"
on public.vehicle_features
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


-- ============================================================
-- 6. FAVORITES
-- ============================================================

drop policy if exists "Users manage own favorites" on public.favorites;
create policy "Users manage own favorites"
on public.favorites
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 7. INQUIRIES & TEST DRIVES
-- ============================================================

drop policy if exists "Anyone can create inquiries" on public.vehicle_inquiries;
create policy "Anyone can create inquiries"
on public.vehicle_inquiries
for insert
with check (
    (
        auth.uid() is not null
        and (
            user_id is null
            or buyer_id is null
            or auth.uid() in (user_id, buyer_id)
        )
    )
    or public.has_role('staff')
);

drop policy if exists "Users can view relevant inquiries" on public.vehicle_inquiries;
create policy "Users can view relevant inquiries"
on public.vehicle_inquiries
for select
using (
    (
        auth.uid() is not null
        and auth.uid() in (user_id, buyer_id, seller_id)
    )
    or public.has_role('staff')
);

drop policy if exists "Staff can update inquiries" on public.vehicle_inquiries;
create policy "Staff can update inquiries"
on public.vehicle_inquiries
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));

drop policy if exists "Staff can delete inquiries" on public.vehicle_inquiries;
create policy "Staff can delete inquiries"
on public.vehicle_inquiries
for delete
using (public.has_role('staff'));


drop policy if exists "Anyone create test drive requests" on public.test_drive_requests;
create policy "Anyone create test drive requests"
on public.test_drive_requests
for insert
with check (
    auth.uid() is not null
    and (user_id is null or auth.uid() = user_id)
);

drop policy if exists "Users view own test drive requests" on public.test_drive_requests;
create policy "Users view own test drive requests"
on public.test_drive_requests
for select
using (auth.uid() = user_id or public.has_role('staff'));

drop policy if exists "Staff manage test drive requests" on public.test_drive_requests;
create policy "Staff manage test drive requests"
on public.test_drive_requests
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));


-- ============================================================
-- 8. INSPECTIONS & RESERVATIONS
-- ============================================================

drop policy if exists "Anyone create inspection requests" on public.inspection_requests;
create policy "Anyone create inspection requests"
on public.inspection_requests
for insert
with check (
    auth.uid() is not null
    and (
        buyer_id is null
        or seller_id is null
        or auth.uid() in (buyer_id, seller_id)
    )
);

drop policy if exists "Users view relevant inspection requests" on public.inspection_requests;
create policy "Users view relevant inspection requests"
on public.inspection_requests
for select
using (
    (
        auth.uid() is not null
        and auth.uid() in (buyer_id, seller_id)
    )
    or public.has_role('staff')
);

drop policy if exists "Staff update inspection requests" on public.inspection_requests;
create policy "Staff update inspection requests"
on public.inspection_requests
for update
using (
    public.has_role('staff')
    or auth.uid() = seller_id
)
with check (
    public.has_role('staff')
    or auth.uid() = seller_id
);

drop policy if exists "Staff delete inspection requests" on public.inspection_requests;
create policy "Staff delete inspection requests"
on public.inspection_requests
for delete
using (public.has_role('staff'));


drop policy if exists "Anyone create reservations" on public.reservations;
create policy "Anyone create reservations"
on public.reservations
for insert
with check (
    auth.uid() is not null
    and (user_id is null or auth.uid() = user_id)
);

drop policy if exists "Users view own reservations" on public.reservations;
create policy "Users view own reservations"
on public.reservations
for select
using (user_id = auth.uid() or public.has_role('staff'));

drop policy if exists "Staff manage reservations" on public.reservations;
create policy "Staff manage reservations"
on public.reservations
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));

drop policy if exists "Staff delete reservations" on public.reservations;
create policy "Staff delete reservations"
on public.reservations
for delete
using (public.has_role('staff'));


-- ============================================================
-- 9. PAYMENTS — TRUSTED SERVER/STAFF WRITE MODEL
-- ============================================================

drop policy if exists "Users view own payments" on public.payments;
create policy "Users view own payments"
on public.payments
for select
using (
    user_id = auth.uid()
    or public.has_role('staff')
);

-- Remove direct browser INSERT access.
drop policy if exists "Authenticated or staff insert payments" on public.payments;
drop policy if exists "Staff insert payments" on public.payments;

-- Only staff can update payment records through the authenticated API.
drop policy if exists "Staff manage payments" on public.payments;
create policy "Staff manage payments"
on public.payments
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));

-- No client-side DELETE policy.
drop policy if exists "Users delete payments" on public.payments;
drop policy if exists "Staff delete payments" on public.payments;


-- ============================================================
-- 10. PAYMENT EVENTS — TRUSTED WRITE MODEL
-- ============================================================

drop policy if exists "Staff view payment events" on public.payment_events;
create policy "Staff view payment events"
on public.payment_events
for select
using (public.has_role('staff'));

drop policy if exists "Staff insert payment events" on public.payment_events;
drop policy if exists "Users insert payment events" on public.payment_events;

drop policy if exists "Staff update payment events" on public.payment_events;
drop policy if exists "Staff delete payment events" on public.payment_events;


-- ============================================================
-- 11. SELLER / TRADE-IN / IMPORT REQUESTS
-- ============================================================
-- Anonymous browser INSERT is deliberately NOT granted by this script.
-- Use a trusted Edge Function/server endpoint with validation, CAPTCHA
-- and rate limiting for guest submissions.

drop policy if exists "Anyone submit seller listing" on public.seller_listings;
create policy "Authenticated submit seller listing"
on public.seller_listings
for insert
with check (
    auth.uid() is not null
);

drop policy if exists "Staff manage seller listings" on public.seller_listings;
create policy "Staff manage seller listings"
on public.seller_listings
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


drop policy if exists "Anyone insert trade-ins" on public.trade_in_requests;
create policy "Authenticated insert trade-ins"
on public.trade_in_requests
for insert
with check (
    auth.uid() is not null
    and (user_id is null or user_id = auth.uid())
);

drop policy if exists "Users manage own trade-ins" on public.trade_in_requests;
create policy "Users manage own trade-ins"
on public.trade_in_requests
for select
using (user_id = auth.uid() or public.has_role('staff'));

drop policy if exists "Staff update trade-ins" on public.trade_in_requests;
create policy "Staff update trade-ins"
on public.trade_in_requests
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));


drop policy if exists "Anyone insert imports" on public.import_requests;
create policy "Authenticated insert imports"
on public.import_requests
for insert
with check (
    auth.uid() is not null
    and (user_id is null or user_id = auth.uid())
);

drop policy if exists "Users manage own imports" on public.import_requests;
create policy "Users manage own imports"
on public.import_requests
for select
using (user_id = auth.uid() or public.has_role('staff'));

drop policy if exists "Staff update imports" on public.import_requests;
create policy "Staff update imports"
on public.import_requests
for update
using (public.has_role('staff'))
with check (public.has_role('staff'));


-- ============================================================
-- 12. AUCTIONS
-- ============================================================

drop policy if exists "Public view live auctions" on public.auctions;
create policy "Public view live auctions"
on public.auctions
for select
using (true);

drop policy if exists "Staff manage auctions" on public.auctions;
create policy "Staff manage auctions"
on public.auctions
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


-- ============================================================
-- 13. AUCTION BIDS — PRIVATE BASE TABLE + SAFE PUBLIC VIEW
-- ============================================================

-- Remove public access to raw bidder records.
drop policy if exists "Public view auction bids" on public.auction_bids;

-- Bidders may see their own bids; staff may see all bids.
drop policy if exists "Users view own auction bids" on public.auction_bids;
create policy "Users view own auction bids"
on public.auction_bids
for select
using (
    buyer_id = auth.uid()
    or public.has_role('staff')
);

drop policy if exists "Users place auction bids" on public.auction_bids;
create policy "Users place auction bids"
on public.auction_bids
for insert
with check (
    auth.uid() is not null
    and auth.uid() = buyer_id
);

drop policy if exists "Staff manage auction bids" on public.auction_bids;
create policy "Staff manage auction bids"
on public.auction_bids
for delete
using (public.has_role('staff'));

-- Public-safe auction bid view.
-- This view intentionally contains NO buyer_id, buyer_name or buyer_email.
drop view if exists public.public_auction_bids;

create view public.public_auction_bids
with (security_barrier = true)
as
select
    auction_id,
    amount,
    created_at
from public.auction_bids;

revoke all on public.public_auction_bids from anon, authenticated;
grant select on public.public_auction_bids to anon, authenticated, service_role;

-- Remove direct anonymous/raw access to auction_bids.
revoke select on public.auction_bids from anon;


-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================

drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications"
on public.notifications
for select
using (user_id = auth.uid());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Staff insert notifications" on public.notifications;
create policy "Staff insert notifications"
on public.notifications
for insert
with check (public.has_role('staff'));

drop policy if exists "Users insert notifications" on public.notifications;


-- ============================================================
-- 15. VEHICLE HISTORY
-- ============================================================

drop policy if exists "Staff view vehicle history" on public.vehicle_history;
create policy "Staff view vehicle history"
on public.vehicle_history
for select
using (public.has_role('staff'));

drop policy if exists "Staff manage vehicle history" on public.vehicle_history;
create policy "Staff manage vehicle history"
on public.vehicle_history
for all
using (public.has_role('staff'))
with check (public.has_role('staff'));


-- ============================================================
-- 16. AUDIT LOGS — ADMIN READ, NO CLIENT WRITE
-- ============================================================

drop policy if exists "Admin view audit logs" on public.audit_logs;
create policy "Admin view audit logs"
on public.audit_logs
for select
using (
    public.has_role('admin')
    or public.has_role('super_admin')
);

drop policy if exists "Staff insert audit logs" on public.audit_logs;
drop policy if exists "Staff update audit logs" on public.audit_logs;
drop policy if exists "Staff delete audit logs" on public.audit_logs;

-- Explicitly prevent client-side mutation through RLS.
-- Trusted SECURITY DEFINER audit trigger below can still insert.


-- ============================================================
-- 17. HARDEN has_role()
-- ============================================================
-- The existing function already uses SECURITY DEFINER and fixes the
-- search_path to public. Recreate it with fully qualified references
-- and an explicit search_path. This keeps role checks predictable.

create or replace function public.has_role(required_role user_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and is_active = true
          and (
              role = required_role
              or role = 'admin'
              or role = 'yard_admin'
              or role = 'super_admin'
              or (
                  required_role = 'staff'
                  and role in ('admin', 'yard_admin', 'super_admin')
              )
          )
    );
$function$;

revoke execute on function public.has_role(user_role) from public;
grant execute on function public.has_role(user_role) to anon, authenticated, service_role;


-- ============================================================
-- 18. TRUSTED GENERIC AUDIT LOGGER
-- ============================================================
-- This trigger records INSERT/UPDATE/DELETE operations performed
-- against selected application tables.
--
-- The function is SECURITY DEFINER so ordinary users do not need
-- INSERT permission on audit_logs.
--
-- The audit record stores OLD/NEW row data. Because audit_logs is
-- admin-only, this remains protected by RLS.

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
    insert into public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        created_at
    )
    values (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        coalesce(
            case when TG_OP <> 'DELETE'
                 then (to_jsonb(NEW)->>'id')::uuid end,
            case when TG_OP <> 'INSERT'
                 then (to_jsonb(OLD)->>'id')::uuid end
        ),
        case when TG_OP in ('UPDATE', 'DELETE')
             then to_jsonb(OLD) else null end,
        case when TG_OP in ('INSERT', 'UPDATE')
             then to_jsonb(NEW) else null end,
        now()
    );

    return coalesce(NEW, OLD);
end;
$function$;

revoke execute on function public.audit_row_change() from public;


-- ============================================================
-- 19. INSTALL AUDIT TRIGGERS
-- ============================================================
-- Only tables that contain an "id" UUID column are included here.
-- Payment raw responses and other sensitive fields are captured in
-- the protected audit_logs table.

drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles
after insert or update or delete on public.profiles
for each row execute function public.audit_row_change();

drop trigger if exists audit_buyer_profiles on public.buyer_profiles;
create trigger audit_buyer_profiles
after insert or update or delete on public.buyer_profiles
for each row execute function public.audit_row_change();

drop trigger if exists audit_seller_profiles on public.seller_profiles;
create trigger audit_seller_profiles
after insert or update or delete on public.seller_profiles
for each row execute function public.audit_row_change();

drop trigger if exists audit_vehicles on public.vehicles;
create trigger audit_vehicles
after insert or update or delete on public.vehicles
for each row execute function public.audit_row_change();

drop trigger if exists audit_vehicle_inquiries on public.vehicle_inquiries;
create trigger audit_vehicle_inquiries
after insert or update or delete on public.vehicle_inquiries
for each row execute function public.audit_row_change();

drop trigger if exists audit_inspection_requests on public.inspection_requests;
create trigger audit_inspection_requests
after insert or update or delete on public.inspection_requests
for each row execute function public.audit_row_change();

drop trigger if exists audit_test_drive_requests on public.test_drive_requests;
create trigger audit_test_drive_requests
after insert or update or delete on public.test_drive_requests
for each row execute function public.audit_row_change();

drop trigger if exists audit_reservations on public.reservations;
create trigger audit_reservations
after insert or update or delete on public.reservations
for each row execute function public.audit_row_change();

drop trigger if exists audit_payments on public.payments;
create trigger audit_payments
after insert or update or delete on public.payments
for each row execute function public.audit_row_change();

drop trigger if exists audit_payment_events on public.payment_events;
create trigger audit_payment_events
after insert or update or delete on public.payment_events
for each row execute function public.audit_row_change();

drop trigger if exists audit_seller_listings on public.seller_listings;
create trigger audit_seller_listings
after insert or update or delete on public.seller_listings
for each row execute function public.audit_row_change();

drop trigger if exists audit_auctions on public.auctions;
create trigger audit_auctions
after insert or update or delete on public.auctions
for each row execute function public.audit_row_change();

drop trigger if exists audit_auction_bids on public.auction_bids;
create trigger audit_auction_bids
after insert or update or delete on public.auction_bids
for each row execute function public.audit_row_change();

drop trigger if exists audit_trade_in_requests on public.trade_in_requests;
create trigger audit_trade_in_requests
after insert or update or delete on public.trade_in_requests
for each row execute function public.audit_row_change();

drop trigger if exists audit_import_requests on public.import_requests;
create trigger audit_import_requests
after insert or update or delete on public.import_requests
for each row execute function public.audit_row_change();


-- ============================================================
-- 20. LEAST-PRIVILEGE GRANTS
-- ============================================================
-- Keep SELECT on public-safe views.
-- Remove destructive table privileges from anonymous users.
-- Remove TRUNCATE from authenticated users.
--
-- We deliberately do NOT revoke all SELECT/INSERT privileges from
-- authenticated because RLS policies depend on these grants and the
-- Yardly application needs them for normal operation.

revoke all on public.audit_logs from anon, authenticated;
revoke select on public.audit_logs from anon, authenticated;

grant select on public.audit_logs to service_role;

revoke truncate on all tables in schema public from anon, authenticated;
revoke delete, update on all tables in schema public from anon;


-- Sensitive payment/event tables: no direct browser mutation.
revoke insert, update, delete on public.payments from anon, authenticated;
revoke insert, update, delete on public.payment_events from anon, authenticated;

-- Audit logs: no direct browser mutation.
revoke insert, update, delete on public.audit_logs from anon, authenticated;

-- Raw auction bids: no anonymous read.
revoke select on public.auction_bids from anon;

-- Internal compatibility inquiry view: no anonymous read.
revoke all on public.inquiries from anon;


-- ============================================================
-- 21. VERIFICATION QUERIES
-- ============================================================

-- A. Every public table should have RLS enabled.
select
    schemaname,
    tablename,
    rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- B. This should return zero rows.
select
    schemaname,
    tablename
from pg_tables
where schemaname = 'public'
  and rowsecurity = false
order by tablename;

-- C. Check the important policies.
select
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- D. Check views and their security options.
select
    n.nspname as schema_name,
    c.relname as view_name,
    c.reloptions
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'v'
order by c.relname;

-- E. Check audit triggers.
select
    event_object_table as table_name,
    trigger_name,
    event_manipulation,
    action_statement
from information_schema.triggers
where event_object_schema = 'public'
  and trigger_name like 'audit_%'
order by event_object_table, trigger_name;

-- F. Check sensitive table grants.
select
    table_name,
    grantee,
    privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
  and table_name in (
      'audit_logs',
      'payments',
      'payment_events',
      'auction_bids'
  )
order by table_name, grantee, privilege_type;


-- ============================================================
-- END OF UPDATED YARDLY AUTOMOTIVE SECURITY HARDENING SCRIPT
-- ============================================================
