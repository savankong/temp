// Your Roster: the made-up expert Marcus Hale (Example) on a people list nobody sends to, and his engagement.
// No account or signup row, so Your Roster's metrics don't count him. Writes once; a second run changes nothing.
const { Client } = require(require.resolve("pg", { paths: [process.cwd(), "/workspace", "/app"] }));
const D = {"IDS":{"engagement":"ab99430a-e071-4b85-82ca-b125cef9af27","list":"4a2e7372-768d-4204-8eee-0f83b410a041","member":"2e610ca4-ec1e-406e-8a7d-cbe0b8ccd441","llUser":"765c6a1a-c4c3-42d2-ad4c-ac8e4e062731","session":"3797dc8b-ec71-4955-a4c7-cd2de35a6002","survey":"522b30ec-3c03-42a8-aaef-632b4cabf33d","items":["4e365772-382b-495f-8417-2549633e2601","236a5b99-f2c4-4bb2-a21b-8787af509917","f01064c7-f741-4c0f-aaa9-f6d098e65829"],"recipient":"9fefc29a-2ae6-4bd6-a333-d04466b90381"},"MARCUS":{"name":"Marcus Hale (Example)","email":"marcus.hale@example.test","roster":"example:marcus-hale","type":"former_government"},"ENGAGEMENT":{"title":"Procurement Judgment (Example)","buyer":"Example Lab (Fictional)","role":"Reviewer","deployment_key":"example-procurement"},"LIST_NAME":"Example (Fictional) · Do Not Send"};
(async () => {
  const u = new URL(process.env.DATABASE_URL); u.searchParams.delete("sslmode");
  const c = new Client({ connectionString: u.toString(), ssl: /localhost|127\.0\.0\.1/.test(u.host) ? false : { rejectUnauthorized: false } });
  await c.connect();
  const q = (s, p) => c.query(s, p).then((r) => r.rows);
  try {
    await q("BEGIN");
    const admin = (await q("SELECT id FROM users WHERE lower(email) = 'savan@yourroster.ai' LIMIT 1"))[0]?.id ?? null;
    const I = D.IDS, E = D.ENGAGEMENT, M = D.MARCUS;
    const e = await q(`INSERT INTO engagements (id, buyer_name, deployment_key, title, scope, status, starts_on, ends_on, created_by)
      VALUES ($1,$2,$3,$4,$5,'active','2026-10-13','2026-11-13',$6) ON CONFLICT (id) DO NOTHING RETURNING id`,
      [I.engagement, E.buyer, E.deployment_key, E.title, "Example data (fictional): experts grade AI answers on FAR Part 15 source selection, in Light-Lux, for Aegis Eval.", admin]);
    const l = await q("INSERT INTO people_lists (id, name, created_by) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING RETURNING id", [I.list, D.LIST_NAME, admin]);
    const m = await q("INSERT INTO people_list_members (id, list_id, full_name, email, current_federal) VALUES ($1,$2,$3,$4,false) ON CONFLICT (id) DO NOTHING RETURNING id", [I.member, I.list, M.name, M.email]);
    await q("COMMIT");
    console.log("SEED engagement", e.length ? "made" : "already there", "· list", l.length ? "made" : "already there", "· member", m.length ? "made" : "already there");
  } catch (err) { await q("ROLLBACK").catch(() => {}); console.log("SEED error", err.message); process.exitCode = 1; }
  await c.end();
})();
