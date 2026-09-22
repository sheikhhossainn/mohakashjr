# Testing Guide — Mohakash Jr

Guidelines for running and writing tests for Mohakash Jr.

## Running Tests

```bash
# Unit tests (Zustand state store, rank progression, and decoupled services)
npm test

# TypeScript typechecking
npm run lint
```

## Testing Checklist
- [ ] Offline functionality verified (airplane mode).
- [ ] Local SQLite queries & migrations pass.
- [ ] Quiz scoring & XP calculations compute deterministically.
- [ ] Bangla text renders properly without clipping.
