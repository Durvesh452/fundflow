import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
<<<<<<< HEAD
    include: [
      '@creit.tech/stellar-wallets-kit',
      '@creit.tech/stellar-wallets-kit/modules/freighter',
      '@creit.tech/stellar-wallets-kit/modules/albedo',
      '@creit.tech/stellar-wallets-kit/modules/xbull',
      '@stellar/freighter-api',
      '@albedo-link/intent',
      '@creit.tech/xbull-wallet-connect',
    ],
=======
    include: ['@creit.tech/stellar-wallets-kit', '@stellar/freighter-api'],
>>>>>>> ba4b92ba0863a7789e2cf3c0a370979c31c80168
  },
})
