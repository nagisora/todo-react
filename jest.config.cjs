module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^../utils/supabase$": "<rootDir>/utils/__mocks__/supabase.js"
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@supabase/supabase-js)/)',
  ],
}