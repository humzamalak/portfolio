---
description: Write a field-note draft from drafts/<slug>/source.md
argument-hint: <slug>
---

Write a draft field note from the chats in `drafts/$ARGUMENTS/source.md`.

Rules:

1. Read `drafts/$ARGUMENTS/source.md` and `content/notes/_template.md`. Read 1 or 2 published notes in `content/notes/` if there are any, and match their voice.
2. Write `content/notes/$ARGUMENTS.md`. Use the template frontmatter. Set `status: draft` and `date` to today. Do not add a `medium:` line.
3. Write as Humza, in the first person, for engineers and hiring managers. Use plain, direct sentences. Explain the problem, what I tried, what worked, and what I would do again. Aim for 800 to 1,500 words.
4. Use only facts that are in the source. Do not invent numbers, dates, company names or results. If something important is missing, add an HTML comment `<!-- TODO: ... -->` in the text.
5. Do not include anything marked `[REDACTED:...]`. Do not include names of employers, clients, colleagues, internal systems, hostnames or account IDs. Use general words, for example "a fintech client".
6. Code blocks must be short and must run. Remove secrets, real hostnames and account IDs from them.
7. Links: use only public URLs from the source or official docs. Link the official docs for each tool you name.
8. After you write the file, run `npm run build` and `npm run check:links`. Then list each TODO and each claim that I must check before I publish.
