-- ─── Guests ────────────────────────────────────────────────────
create table guests (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  relationship        text,
  personalised_message text,
  rsvp_status         text not null default 'pending'
                        check (rsvp_status in ('pending', 'yes', 'no')),
  rsvp_at             timestamptz,
  opened_at           timestamptz,
  created_at          timestamptz not null default now()
);

-- ─── Activity log ──────────────────────────────────────────────
create table activity_log (
  id         uuid primary key default gen_random_uuid(),
  guest_id   uuid not null references guests(id) on delete cascade,
  action     text not null
               check (action in (
                 'page_opened',
                 'page_returned',
                 'rsvp_yes',
                 'rsvp_no',
                 'rsvp_changed',
                 'section_viewed',
                 'gift_viewed',
                 'gift_claimed',
                 'gift_unclaimed',
                 'gift_claim_lost',
                 'external_link'
               )),
  metadata   jsonb,
  user_agent text,
  created_at timestamptz not null default now()
);

create index activity_log_guest_idx  on activity_log(guest_id, created_at desc);
create index activity_log_action_idx on activity_log(action);

-- ─── Gifts ─────────────────────────────────────────────────────
create table gifts (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text,
  category       text,
  price_estimate numeric,
  image_url      text,
  purchase_link  text,
  claimable      boolean not null default true,
  claimed_by     uuid references guests(id) on delete set null,
  claimed_at     timestamptz,
  marked_received boolean not null default false,
  display_order  int not null default 0,
  created_at     timestamptz not null default now()
);

create index gifts_claimed_by_idx on gifts(claimed_by);
create index gifts_claimable_idx  on gifts(claimable, claimed_by);
