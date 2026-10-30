import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'pnpm generate && PORT=4173 HOST=localhost pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 180_000
  }
})
