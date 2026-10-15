# Example expert seed (fictional)

Made-up data for one expert, **Marcus Hale (Example)** (`marcus.hale@example.test`), that flows from Your Roster through Light-Lux to Aegis Eval. Nothing here is real and nothing here is secret: the scripts read each app's own settings when they run.

| File | Runs in | What it adds |
| --- | --- | --- |
| `seed-yr.cjs` | Your Roster (`the-roster`, component `web`) | A people list "Example (Fictional) · Do Not Send" with Marcus, and the engagement "Procurement Judgment (Example)" |
| `aegis.py` | Aegis Eval (`aegis-eval`, component `api`), as `python3 aegis.py go` | Two draft questions in the project "Procurement Judgment (Example)" under the demonstration organization |
| `seed-ll.cjs` | Light-Lux (`borbor`, component `api`), as `node seed-ll.cjs <AEGPROJ> '<AEGOUT>'` | Marcus's account, an approved and delivered expert session, and a closed survey with his answers |
| `frames/` | | The four window pictures `seed-ll.cjs` downloads |

Each script writes once; running it again changes nothing. The source lives in the Light-Lux repo at `apps/server/scripts/example-expert/`.
