export type RsvpStatus = 'pending' | 'yes' | 'no' | 'revoked';

export type ActivityAction =
  | 'page_opened'
  | 'page_returned'
  | 'rsvp_yes'
  | 'rsvp_no'
  | 'rsvp_changed'
  | 'section_viewed'
  | 'gift_viewed'
  | 'gift_claimed'
  | 'gift_unclaimed'
  | 'gift_claim_lost'
  | 'external_link';

export interface Guest {
  id: string;
  slug: string;
  name: string;
  relationship: string | null;
  personalised_message: string | null;
  rsvp_status: RsvpStatus;
  rsvp_at: string | null;
  opened_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  guest_id: string;
  action: ActivityAction;
  metadata: Record<string, unknown> | null;
  user_agent: string | null;
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price_estimate: number | null;
  image_url: string | null;
  purchase_link: string | null;
  claimable: boolean;
  claimed_by: string | null;
  claimed_at: string | null;
  marked_received: boolean;
  display_order: number;
  created_at: string;
}

export type GiftCategory =
  | 'beauty'
  | 'switzerland'
  | 'content'
  | 'wardrobe'
  | 'cash';
