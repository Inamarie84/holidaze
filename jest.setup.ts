// jest.setup.ts
import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Provide defaults for tests so env.ts doesn't throw
process.env.NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://v2.api.noroff.dev'
process.env.NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'test-key'
