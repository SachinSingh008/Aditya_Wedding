CREATE TABLE public.wedding_guest_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(btrim(guest_name)) BETWEEN 2 AND 120),
  mobile_number text NOT NULL UNIQUE CHECK (mobile_number ~ '^\+?[0-9]{10,15}$'),
  attendees smallint NOT NULL CHECK (attendees BETWEEN 1 AND 12),
  attendance_status text NOT NULL CHECK (attendance_status IN ('accepts', 'declines', 'unsure')),
  selected_events text[] NOT NULL DEFAULT '{}',
  blessing_message text NOT NULL DEFAULT '' CHECK (char_length(blessing_message) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT wedding_guest_rsvps_valid_events CHECK (
    selected_events <@ ARRAY['akhand-ashtayam', 'tilak', 'matkor', 'wedding']::text[]
  )
);
GRANT INSERT ON public.wedding_guest_rsvps TO anon;
GRANT ALL ON public.wedding_guest_rsvps TO service_role;
ALTER TABLE public.wedding_guest_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can submit wedding RSVPs"
  ON public.wedding_guest_rsvps
  FOR INSERT
  TO anon
  WITH CHECK (true);