/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000" // development
        : "https://BLAHBLAHBLAH.com", // production
  },
};
