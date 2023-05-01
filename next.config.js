/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@solana/wallet-adapter-react-ui']);

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    HELIUS_API_KEY: process.env.NEXT_PUBLIC_REACT_APP_HELIUS_API_KEY,
  }
}

module.exports = withTM(nextConfig)
