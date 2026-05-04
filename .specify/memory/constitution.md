<!--
SYNC IMPACT REPORT
Version change: (none) → 1.0.0
Added sections:
  - Core Principles (I–V)
  - Quality Standards
  - Development Workflow
  - Governance
Modified principles: N/A (initial version)
Removed sections: N/A (initial version)
Templates requiring updates:
  - .specify/templates/plan-template.md       ✅ Aligned — Constitution Check section derives gates from this file
  - .specify/templates/spec-template.md       ✅ Aligned — mandatory sections (User Scenarios, Requirements, Success Criteria) match Principles I–IV
  - .specify/templates/tasks-template.md      ✅ Aligned — user-story phasing and TDD markers match Principles III–IV
  - .specify/templates/checklist-template.md  ✅ Aligned — generic structure, no principle-specific changes required
Deferred TODOs: None
Follow-up: Add project-specific technology stack and compliance constraints once decided
-->

# Africom Web Constitution

## Core Principles

### I. Specification-First Development

Every feature MUST begin with a written specification before any implementation work starts.
The specification MUST define user scenarios, functional requirements, and measurable success
criteria. Implementation without an approved specification is prohibited. Specifications are
owned artifacts — they MUST be kept current as understanding evolves.

### II. User-Centric Design

Every requirement MUST be expressed in terms of user value and outcome, not technical
implementation detail. Features without clear, testable user scenarios MUST NOT proceed to
planning. Success criteria MUST be technology-agnostic and verifiable by a non-technical
stakeholder.

### III. Test-Driven Implementation

Tests MUST be written and verified to fail before implementation begins. The
Red-Green-Refactor cycle is mandatory for all functional code. Acceptance scenarios
defined in the specification are the authoritative source for test cases — no
implementation is complete until its acceptance scenarios pass.

### IV. Incremental & Independent Delivery

Each user story MUST be independently implementable, testable, and deployable as a
standalone MVP increment. User stories MUST NOT create blocking implementation
dependencies on one another. Every story MUST deliver observable user value on its own.

### V. Simplicity & Maintainability

Solutions MUST use the simplest approach that satisfies the stated requirements. YAGNI
(You Aren't Gonna Need It) applies at all times. Any introduced complexity MUST be
justified and documented in the plan's Complexity Tracking section. Abstraction is
permitted only when duplication creates a clear maintenance burden.

## Quality Standards

- All specifications MUST pass the Specification Quality Checklist before proceeding to planning.
- All plans MUST include a Constitution Check gate before Phase 0 research.
- Functional requirements MUST be testable and unambiguous — vague language ("should", "might")
  is not acceptable in requirements.
- Success criteria MUST include at least one quantitative metric (time, rate, count, or percentage).
- Every feature branch MUST have a corresponding spec file before any code is committed.

## Development Workflow

Feature development follows the Specify Kit workflow in order:

1. `/speckit-specify` — write and validate the feature specification
2. `/speckit-clarify` — resolve ambiguities (max 3 clarification questions)
3. `/speckit-plan` — produce the implementation plan and design artifacts
4. `/speckit-tasks` — generate dependency-ordered, story-grouped tasks
5. `/speckit-implement` — execute tasks, story by story, with checkpoints

All changes MUST be committed to a dedicated feature branch following sequential naming:
`NNN-feature-name` (e.g., `001-user-auth`). Spec artifacts live under
`specs/NNN-feature-name/`. The `CLAUDE.md` context file MUST be kept current with the
active plan so that all agents have up-to-date project context.

## Governance

This constitution supersedes all other development practices and guidelines for this
project. Amendments require:

1. A documented rationale for the change (scope, security, or quality driven).
2. A version increment following semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change.
   - **MINOR**: New principle or section added, or materially expanded guidance.
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements.
3. Consistency propagation: all dependent templates MUST be reviewed and updated if needed.
4. Update to `LAST_AMENDED_DATE` on the version line below.

All feature planning reviews MUST verify compliance with this constitution before
proceeding. Deviations from any principle MUST be documented in the plan's Complexity
Tracking section with justification.

**Version**: 1.0.0 | **Ratified**: 2026-05-04 | **Last Amended**: 2026-05-04
