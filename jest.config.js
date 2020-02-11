module.exports = {
  "moduleNameMapper": {
    "^@/(.+)": "<rootDir>/$1"
  },
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  "testMatch": [
    "**/test/**/*.test.ts"
  ]
};
