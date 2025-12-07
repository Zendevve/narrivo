# Testing Strategy

## Test Levels

### Unit Tests
- **Scope:** Pure functions, utilities, algorithms
- **Examples:** File matching, metadata extraction, sync calculations
- **Runner:** Jest

### Integration Tests
- **Scope:** Components interacting with stores/services
- **Examples:** LibraryScreen with booksStore, player controls
- **Runner:** Jest + React Testing Library

### E2E Tests (Future)
- **Scope:** Full user flows on device
- **Tool:** Detox (when implemented)
- **Examples:** Import file → Play → Read-Along flow

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Coverage Goals

| Area | Target |
|------|--------|
| Utilities (`/utils`) | 80%+ |
| Services (`/services`) | 70%+ |
| Stores (`/store`) | 70%+ |
| Components | Focus on critical paths |

## Test Philosophy (MCAF)

1. **Prefer integration over unit** — Test real user flows
2. **No mocking internals** — Use real stores/services when possible
3. **Meaningful assertions** — Every test verifies actual behavior
4. **Cover edge cases** — Especially for file matching and sync

## Test Naming

```typescript
describe('matchBooks', () => {
  it('returns exact match when title and author are identical', () => {})
  it('returns fuzzy match when similarity > 0.7', () => {})
  it('returns null when no match found', () => {})
})
```
