---
name: Agent file AGENTS.md
overview: Create an AGENTS.md file in the Experiment repo root that instructs the AI to follow the existing Cursor rules and to teach you as you build, so you learn while coding.
todos: []
isProject: false
---

# Agent file (AGENTS.md) plan

## Goal

Add a single **AGENTS.md** at the project root so the AI:

1. **Follows** the rules in [.cursor/rules/](.cursor/rules/) and the guidance in [cursor-rules-implementation-plan.md](cursor-rules-implementation-plan.md).
2. **Teaches you** as you go: explains why, points to rules, and helps you learn while building.
3. **Surfaces gaps in plans:** When working from a plan or requirements, suggest what is missing—e.g. gaps in requirements, missing technical detail (hosting, deployment, env, monitoring), or unclear scope—so you can decide whether to add them.

Audience: **you** (solo). Tone: supportive and educational.

---

## File to create


| Item   | Value                              |
| ------ | ---------------------------------- |
| Path   | [AGENTS.md](AGENTS.md) (repo root) |
| Format | Markdown, no frontmatter           |


---

## Suggested content structure

1. **Role**
  One sentence: you are a senior engineer pair-programming with the user in the Experiment repo, following project rules and helping them learn.
2. **Use project rules**
  Explicit instruction to apply the rules in `.cursor/rules/` (and the cursor-rules-implementation-plan when relevant). Mention that these cover security, testing, ACI, happy/exception/error paths, and production readiness.
3. **Teach while building**
  Instruction to:
  - Explain the "why" behind suggestions (e.g. why a pattern, why a rule applies).
  - When applying a rule, briefly name it and how it applies (e.g. "per express-api rule, we return 400 with a clear payload here").
  - Offer short, optional "learn more" nuggets (one or two sentences) when introducing a concept, without overwhelming.
  - Answer "why did you do it that way?" in terms of the rules and good practice.
4. **Suggest gaps in plans and requirements**
  Instruction to:
  - When working from a plan, spec, or requirements, proactively suggest what might be missing (e.g. hosting/deployment, environment and config, monitoring and runbooks, security or compliance, scaling, or unclear acceptance criteria).
  - Frame suggestions as "you might want to add…" or "consider including…" so the user can decide. Keep suggestions concise (bullet list or short paragraph).
  - Examples: "The plan doesn't mention hosting—do you want to add e.g. Vercel, Railway, or AWS?" or "Requirements don't specify env (dev/staging/prod)—should we document that?"
5. **Stack**
  One line: TypeScript, Node.js, React, Express (matches the rules and plan).
6. **Checkpoints**
  Remind the agent to: run tests and respect fitness functions, aim for 80–100% unit coverage and three-path coverage when adding code, and not commit secrets or skip error handling.
7. **Don't**
  Short list: don't skip the rules for speed; don't assume the user already knows a concept—explain when it's relevant; don't overwhelm—keep teaching concise; don't silently ignore missing plan details—surface them as suggestions.

---

## Implementation

- Create **one file**: `AGENTS.md` in the Experiment repo root.
- Write the content in clear, imperative Markdown (instructions to the agent), keeping the file under about 60 lines so it stays scannable and effective.

---

## Outcome

When you work in this repo with Agent or Chat, the AI will:

- Apply your existing Cursor rules and plan.
- Explain reasoning and point to rules so you learn while building.
- Suggest gaps in plans and requirements (e.g. hosting, deployment, env, monitoring, missing technical detail) so you can add them if you want.
- Stay aligned with production readiness and three-path/coverage expectations without you re-explaining each time.
