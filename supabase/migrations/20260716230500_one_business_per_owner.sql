-- A user owns exactly one business. A race in the "ensure business on first
-- login" path could insert duplicates; dedupe, then enforce uniqueness so the
-- app's .maybeSingle() lookups are always safe and upserts are idempotent.

-- Keep the earliest business per owner, delete the rest. (Children cascade,
-- but at this point duplicates have no locations/screens.)
delete from businesses a
using businesses b
where a.owner_user_id = b.owner_user_id
  and (a.created_at > b.created_at
       or (a.created_at = b.created_at and a.ctid > b.ctid));

alter table businesses
  add constraint businesses_owner_user_id_key unique (owner_user_id);
