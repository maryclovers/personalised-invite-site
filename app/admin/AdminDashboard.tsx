'use client';
import { useState, useEffect } from 'react';

type RsvpStatus = 'pending' | 'yes' | 'no';

interface Guest {
  id: string;
  slug: string;
  name: string;
  relationship: string | null;
  rsvp_status: RsvpStatus;
  rsvp_at: string | null;
  opened_at: string | null;
  created_at: string;
}

interface ActivityEntry {
  id: string;
  guest_id: string;
  guest_name: string;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface GiftAdmin {
  id: string;
  name: string;
  category: string | null;
  price_estimate: number | null;
  purchase_link: string | null;
  claimable: boolean;
  is_claimed: boolean;
  claimed_by_name: string | null;
  claimed_at: string | null;
  marked_received: boolean;
}

interface AdminData {
  guests: Guest[];
  activity: ActivityEntry[];
  gifts: GiftAdmin[];
}

const STATUS_COLOR: Record<RsvpStatus, string> = {
  yes: 'bg-emerald-500',
  no: 'bg-red-400',
  pending: 'bg-yellow-400',
};

const STATUS_LABEL: Record<RsvpStatus, string> = {
  yes: 'Coming',
  no: 'Can\'t make it',
  pending: 'No reply',
};

const ACTION_LABELS: Record<string, string> = {
  page_opened: 'Opened invite',
  page_returned: 'Returned to invite',
  rsvp_yes: 'Said yes',
  rsvp_no: 'Said no',
  rsvp_changed: 'Changed RSVP',
  section_viewed: 'Viewed section',
  gift_viewed: 'Viewed gift',
  gift_claimed: 'Claimed a gift',
  gift_unclaimed: 'Unclaimed a gift',
  gift_claim_lost: 'Lost a claim race',
  external_link: 'Clicked a link',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 p-5 rounded-xl bg-card border border-border">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-display text-3xl text-foreground">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

function OverviewTab({ data }: { data: AdminData }) {
  const yes = data.guests.filter((g) => g.rsvp_status === 'yes');
  const no = data.guests.filter((g) => g.rsvp_status === 'no');
  const pending = data.guests.filter((g) => g.rsvp_status === 'pending');
  const claimable = data.gifts.filter((g) => g.claimable);
  const claimed = claimable.filter((g) => g.is_claimed);

  return (
    <div className="flex flex-col gap-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Coming" value={yes.length} />
        <StatCard label="Gifts claimed" value={`${claimed.length}/${claimable.length}`} />
      </div>

      {/* Who's coming */}
      {yes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirmed guests</p>
          <div className="flex flex-col gap-0">
            {yes.map((g) => (
              <div key={g.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-foreground text-sm">{g.name}</span>
                  {g.relationship && <span className="text-muted-foreground text-xs">{g.relationship}</span>}
                </div>
                {g.rsvp_at && <span className="text-muted-foreground text-xs">{fmt(g.rsvp_at)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Recent activity</p>
        <div className="flex flex-col gap-0">
          {data.activity.slice(0, 30).map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-foreground text-sm truncate">{a.guest_name}</span>
                <span className="text-muted-foreground text-xs">
                  {ACTION_LABELS[a.action] ?? a.action}
                  {a.action === 'section_viewed' && a.metadata?.section
                    ? ` — ${a.metadata.section}`
                    : ''}
                  {a.action === 'rsvp_changed' && a.metadata?.from && a.metadata?.to
                    ? ` (${a.metadata.from} → ${a.metadata.to})`
                    : ''}
                </span>
              </div>
              <span className="text-muted-foreground text-xs shrink-0">{fmt(a.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuestsTab({ data }: { data: AdminData }) {
  const [selected, setSelected] = useState<string>(data.guests[0]?.id ?? '');

  const guest = data.guests.find((g) => g.id === selected);
  const timeline = data.activity
    .filter((a) => a.guest_id === selected)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="flex gap-6 min-h-[60vh]">
      {/* Sidebar */}
      <div className="w-48 shrink-0 flex flex-col gap-1">
        {data.guests.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
              selected === g.id
                ? 'bg-card border border-border text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[g.rsvp_status]}`} />
            <span className="text-sm truncate">{g.name}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {guest && (
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-2xl text-foreground">{guest.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[guest.rsvp_status]}`} />
              <span className="text-muted-foreground text-sm">{STATUS_LABEL[guest.rsvp_status]}</span>
              {guest.opened_at && (
                <span className="text-muted-foreground text-xs">· First opened {fmt(guest.opened_at)}</span>
              )}
            </div>
          </div>

          {timeline.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet.</p>
          ) : (
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {timeline.map((a) => (
                <div key={a.id} className="flex gap-4 pb-4 relative">
                  <div className="w-4 h-4 rounded-full border-2 border-border bg-background shrink-0 mt-0.5 relative z-10" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-foreground text-sm">
                      {ACTION_LABELS[a.action] ?? a.action}
                      {a.action === 'section_viewed' && a.metadata?.section
                        ? ` — ${a.metadata.section}`
                        : ''}
                      {a.action === 'rsvp_changed' && a.metadata?.from && a.metadata?.to
                        ? ` (${a.metadata.from} → ${a.metadata.to})`
                        : ''}
                    </span>
                    <span className="text-muted-foreground text-xs">{fmt(a.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GiftsTab({ data }: { data: AdminData }) {
  const claimable = data.gifts.filter((g) => g.claimable);
  const nonClaimable = data.gifts.filter((g) => !g.claimable);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Claimable gifts — {claimable.filter((g) => g.is_claimed).length}/{claimable.length} claimed
        </p>
        <div className="flex flex-col gap-0">
          {claimable.map((g) => (
            <div key={g.id} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${g.is_claimed ? 'bg-emerald-500' : 'bg-border'}`} />
                <span className="text-foreground text-sm truncate">{g.name}</span>
                {g.price_estimate && (
                  <span className="text-muted-foreground text-xs">£{g.price_estimate}</span>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                {g.is_claimed ? (
                  <>
                    <span className="text-emerald-400 text-xs font-medium">{g.claimed_by_name}</span>
                    {g.claimed_at && <span className="text-muted-foreground text-[10px]">{fmt(g.claimed_at)}</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">unclaimed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {nonClaimable.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Cash & open gifts</p>
          <div className="flex flex-col gap-0">
            {nonClaimable.map((g) => (
              <div key={g.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <span className="w-2 h-2 rounded-full shrink-0 bg-gold/50" />
                <span className="text-muted-foreground text-sm">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'guests' | 'gifts'>('overview');
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Failed to load. Are you logged in?</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'guests', label: 'Guests' },
    { id: 'gifts', label: 'Gifts' },
  ];

  return (
    <div className="min-h-screen bg-background px-6 py-10 max-w-3xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl text-foreground">Admin</h1>
          <p className="text-muted-foreground text-xs">Birthday dinner · 18 Jun 2026</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-card border border-border rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === t.id
                  ? 'bg-background text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab data={data} />}
        {tab === 'guests' && <GuestsTab data={data} />}
        {tab === 'gifts' && <GiftsTab data={data} />}
      </div>
    </div>
  );
}
