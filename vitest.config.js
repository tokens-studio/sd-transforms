import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/integration/**/*.test.[jt]s?(x)'],
    globals: true,
    // Right now, integration tests register SD transforms on the SD class
    // so running test files in parallel would cause them to influence one another
    // We can probably fix this in the future by registering on the SD instance instead.
    fileParallelism: false,
  },
});
