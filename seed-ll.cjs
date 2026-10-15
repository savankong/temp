// Light-Lux: one made-up expert (Marcus Hale, Example) with a reviewed, delivered session and a closed survey.
// Usage: node seed-ll.js [aegisProjectId aegisOutcomeJson]. Writes once; a second run changes nothing.
const { Client } = require(require.resolve("pg", { paths: [process.cwd(), "/app/apps/server", "/app"] }));
const crypto = require("crypto");
const D = {"IDS":{"engagement":"ab99430a-e071-4b85-82ca-b125cef9af27","list":"4a2e7372-768d-4204-8eee-0f83b410a041","member":"2e610ca4-ec1e-406e-8a7d-cbe0b8ccd441","llUser":"765c6a1a-c4c3-42d2-ad4c-ac8e4e062731","session":"3797dc8b-ec71-4955-a4c7-cd2de35a6002","survey":"522b30ec-3c03-42a8-aaef-632b4cabf33d","items":["4e365772-382b-495f-8417-2549633e2601","236a5b99-f2c4-4bb2-a21b-8787af509917","f01064c7-f741-4c0f-aaa9-f6d098e65829"],"recipient":"9fefc29a-2ae6-4bd6-a333-d04466b90381"},"MARCUS":{"name":"Marcus Hale (Example)","email":"marcus.hale@example.test","roster":"example:marcus-hale","type":"former_government"},"ENGAGEMENT":{"title":"Procurement Judgment (Example)","buyer":"Example Lab (Fictional)","role":"Reviewer","deployment_key":"example-procurement"},"LIST_NAME":"Example (Fictional) · Do Not Send","SURVEY":{"id":"522b30ec-3c03-42a8-aaef-632b4cabf33d","title":"Procurement Judgment Check (Example)","discipline":"acquisition","pay_cents":7500,"intro":"Example survey with made-up answers, for the team to follow one expert from Your Roster to Aegis Eval. Nothing here is real."},"ITEMS":[{"id":"4e365772-382b-495f-8417-2549633e2601","position":1,"kind":"single_select","prompt":"How long did you work in federal contracting?","options":["Under 5 years","5 to 10 years","10 to 20 years","Over 20 years"],"benchmark":false,"criteria":[]},{"id":"236a5b99-f2c4-4bb2-a21b-8787af509917","position":2,"kind":"long_text","benchmark":true,"options":null,"prompt":"In a FAR Part 15 best value tradeoff, the contracting officer wants to add an evaluation factor after proposals have come in. What has to happen, and why?","criteria":["Says every factor and significant subfactor, and their relative importance, must be stated in the solicitation (FAR 15.304(d)).","Says adding or changing a factor needs an amendment to the solicitation (FAR 15.206).","Says offerors must get a chance to revise their proposals after the amendment.","Doesn't suggest that a note to the file is enough on its own."]},{"id":"f01064c7-f741-4c0f-aaa9-f6d098e65829","position":3,"kind":"long_text","benchmark":true,"options":null,"prompt":"When does past performance have to be evaluated in a negotiated competitive acquisition, and how is an offeror with no record rated?","criteria":["Says it must be evaluated when the buy is expected to exceed the simplified acquisition threshold (FAR 15.304(c)(3)).","Says the contracting officer may decide it isn't appropriate, and must document why.","Says an offeror with no relevant record can't be rated favorably or unfavorably (FAR 15.305(a)(2)(iv))."]}],"ANSWERS":[{"item_id":"4e365772-382b-495f-8417-2549633e2601","json":"10 to 20 years"},{"item_id":"236a5b99-f2c4-4bb2-a21b-8787af509917","text":"You can't just add it. FAR 15.304(d) says the factors and significant subfactors, and how important each one is relative to the others, have to be in the solicitation, because that's what offerors write their proposals to. If the evaluation needs a new factor, you amend the solicitation under 15.206 and give every offeror in the competition a chance to revise. Evaluating against a factor nobody was told about is the classic protest ground, and a memo to the file doesn't fix it."},{"item_id":"f01064c7-f741-4c0f-aaa9-f6d098e65829","text":"Past performance has to be evaluated in negotiated competitive buys expected to go over the simplified acquisition threshold, 15.304(c)(3). The contracting officer can decide it isn't appropriate for a particular buy, but has to document why. An offeror without a relevant record gets a neutral rating: under 15.305(a)(2)(iv) they can't be rated favorably or unfavorably on past performance."}],"TRANSCRIPT":[[4000,15000,"Okay, item fourteen. The question asks what a best value tradeoff has to say about evaluation factors, and whether you can add one after proposals come in."],[19000,38000,"Model A lists price and non-price factors, which is right, but then it says you can add a factor after receipt if you document why. You can't."],[41000,60000,"FAR 15.304(d): the factors and their relative importance go in the solicitation. Changing them means an amendment, and everyone gets to revise."],[63000,88000,"So A's second sentence is wrong. It also never mentions past performance, so I'll mark that one not addressed rather than fail."],[92000,118000,"Model B. Shorter, and it gets the amendment point right, with the right cite. But it says past performance is optional for every acquisition."],[120000,140000,"That's only true below the simplified acquisition threshold. Above it, you evaluate it unless the contracting officer documents why not."],[143000,158000,"So B fails that criterion. Overall, B is the closer answer. I'll give A a two and B a four."]],"frames":[{"t":2000,"file":"f1.jpg"},{"t":40000,"file":"f2.jpg"},{"t":90000,"file":"f3.jpg"},{"t":142000,"file":"f4.jpg"}],"meta":{"sha256":"d4ac60e20917ff8144ea846a9d2c5d341dd184e66819962ff618c643ceb1a530","questions":2,"answers":2}};
(async () => {
  const u = new URL(process.env.DATABASE_URL); u.searchParams.delete("sslmode");
  const c = new Client({ connectionString: u.toString(), ssl: /localhost|127\.0\.0\.1/.test(u.host) ? false : { rejectUnauthorized: false } });
  await c.connect();
  const q = (s, p) => c.query(s, p).then((r) => r.rows);
  const [projectId, outcome] = process.argv.slice(2);
  try {
    await q("BEGIN");
    const reviewer = (await q("SELECT id FROM users WHERE lower(email) = ANY($1) ORDER BY created_at LIMIT 1", [(process.env.SEED_REVIEWER || "savan@yourroster.ai").split(",")]))[0];
    if (!reviewer) throw new Error("No reviewer account");
    const R = reviewer.id, I = D.IDS, M = D.MARCUS, E = D.ENGAGEMENT;
    const had = (await q("SELECT 1 FROM expert_sessions WHERE id = $1", [I.session])).length > 0;
    if (!had) {
      await q("INSERT INTO users (id, email, name, signup_via, signup_detail, created_at) VALUES ($1,$2,$3,'your_roster','Example data (fictional)', '2026-10-13T13:55:00Z')", [I.llUser, M.email, M.name]);
      await q("INSERT INTO expert_links (user_id, roster_user_id, roster_email, expert_type, linked_at) VALUES ($1,$2,$3,$4,'2026-10-13T13:56:00Z')", [I.llUser, M.roster, M.email, M.type]);
      await q("INSERT INTO expert_type_changes (user_id, old_type, new_type, changed_at) VALUES ($1, NULL, $2, '2026-10-13T13:56:00Z')", [I.llUser, M.type]);
      const att = { personal_device: true, personal_accounts: true, not_government_network: true, outside_official_duties: true, no_sensitive_information: true };
      await q(`INSERT INTO expert_sessions (id, user_id, roster_user_id, expert_type, engagement_id, engagement_title, engagement_role,
        aegis_deployment_key, consent_version, attestations, consent_at, window_label, status, started_at, ended_at, submitted_at,
        review_status, reviewed_by, reviewed_at, review_note, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'2026-10-03',$9,'2026-10-13T13:57:00Z','Aegis Eval · Item 14 (Example)','submitted',
        '2026-10-13T14:00:00Z','2026-10-13T14:02:45Z','2026-10-13T14:05:00Z','approved',$10,'2026-10-14T16:20:00Z',
        'Clear reasoning with the regulation cited, and the scores match the rubric. (Example review.)','2026-10-13T13:57:00Z')`,
        [I.session, I.llUser, M.roster, M.type, I.engagement, E.title, E.role, E.deployment_key, JSON.stringify(att), R]);
      for (const [s, e, t] of D.TRANSCRIPT)
        await q("INSERT INTO expert_session_segments (session_id, speaker, text, start_ms, end_ms, source) VALUES ($1,'me',$2,$3,$4,'microphone')", [I.session, t, s, e]);
      for (const f of D.frames) {
        const res = await fetch(`${process.env.SEED_FRAMES || "https://raw.githubusercontent.com/savankong/temp/main/frames"}/${f.file}`);
        if (!res.ok || !/jpeg/.test(res.headers.get("content-type") || "")) throw new Error("Couldn't fetch the picture " + f.file + " (" + res.status + "). Check https://github.com/savankong/temp/tree/main/frames");
        const b = Buffer.from(await res.arrayBuffer());
        await q("INSERT INTO expert_session_frames (session_id, t_ms, content_type, sha256, bytes, created_at) VALUES ($1,$2,'image/jpeg',$3,$4,'2026-10-13T14:00:00Z'::timestamptz + make_interval(secs => $2::int / 1000.0))", [I.session, f.t, crypto.createHash("sha256").update(b).digest("hex"), b]);
      }
      await q("INSERT INTO dataset_deliveries (session_id, session_ref, roster_user_id, engagement_id, recipient, delivered_by, delivered_at) VALUES ($1,$1,$2,$3,$4,$5,'2026-10-14T16:30:00Z')", [I.session, M.roster, I.engagement, E.buyer, R]);
      const S = D.SURVEY;
      await q("INSERT INTO surveys (id, title, intro, status, pay_cents, discipline, voice, created_by, created_at, updated_at) VALUES ($1,$2,$3,'draft',$4,$5,true,$6,'2026-10-14T15:00:00Z','2026-10-14T15:00:00Z')", [S.id, S.title, S.intro, S.pay_cents, S.discipline, R]);
      for (const it of D.ITEMS)
        await q("INSERT INTO survey_items (id, survey_id, position, kind, prompt, options, required, benchmark, criteria) VALUES ($1,$2,$3,$4,$5,$6,true,$7,$8)", [it.id, S.id, it.position, it.kind, it.prompt, it.options ? JSON.stringify(it.options) : null, it.benchmark, JSON.stringify(it.criteria)]);
      await q("UPDATE surveys SET status = 'open', opened_at = '2026-10-14T15:10:00Z' WHERE id = $1", [S.id]);
      await q(`INSERT INTO survey_recipients (id, survey_id, list_ref, list_name, full_name, email, token_hash, invited_at, emailed_at, opened_at, consented_at, consent_version, submitted_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,'2026-10-14T15:10:00Z','2026-10-14T15:10:00Z','2026-10-14T15:31:00Z','2026-10-14T15:32:00Z','surveys-lightlux-2026-10-14','2026-10-14T15:44:00Z')`,
        [I.recipient, S.id, I.list, D.LIST_NAME, M.name, M.email, crypto.randomBytes(32).toString("hex")]);
      for (const a of D.ANSWERS)
        await q("INSERT INTO survey_item_answers (recipient_id, item_id, value_text, value_json, answered_at) VALUES ($1,$2,$3,$4,'2026-10-14T15:40:00Z')", [I.recipient, a.item_id, a.text ?? null, a.json ? JSON.stringify(a.json) : null]);
      await q("UPDATE surveys SET status = 'closed', closed_at = '2026-10-14T17:00:00Z', updated_at = '2026-10-14T17:00:00Z' WHERE id = $1", [S.id]);
      console.log("SEED made Marcus Hale (Example): session", I.session, "survey", S.id);
    } else console.log("SEED already there");
    if (projectId && (await q("SELECT 1 FROM survey_aegis_sends WHERE survey_id = $1", [D.SURVEY.id])).length === 0) {
      await q("INSERT INTO survey_aegis_sends (survey_id, method, aegis_project_id, question_count, answer_count, sha256, outcome, created_by, created_at) VALUES ($1,'api',$2,$3,$4,$5,$6,$7,now())",
        [D.SURVEY.id, projectId, D.meta.questions, D.meta.answers, D.meta.sha256, outcome || "{}", R]);
      console.log("SEED recorded the Aegis send to project", projectId);
    }
    await q("COMMIT");
  } catch (e) { await q("ROLLBACK").catch(() => {}); console.log("SEED error", e.message); process.exitCode = 1; }
  await c.end();
})();
