export type Role = "DIRECTOR" | "STAFF" | "PARENT";
export type Membership = { kitaId: string; role: Role };
/** Only pass memberships obtained from a verified server session and database. */
export function requireRole(memberships: readonly Membership[], kitaId: string, allowed: readonly Role[]) {
 const membership = memberships.find(m=>m.kitaId===kitaId);
 if(!membership || !allowed.includes(membership.role)) throw new Error("FORBIDDEN");
 return membership;
}

