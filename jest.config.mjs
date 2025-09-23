// jest.config.mjs
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // ❌ REMOVE any '^next/navigation$': '<rootDir>/src/__mocks__/next/navigation.ts'
  },
}

export default createJestConfig(config)
