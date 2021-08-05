module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [0],
    'body-max-line-length': [0]
  },
  ignores: [
    commit => {
      // wip: commits
      return /^wip(:\s(.|\n)+)?$/.test(commit.trim())
    },
    commit => {
      // Release commits (Release 1.1.0, Release 1.1.0-beta.1)
      return /^Release \d+\.\d+\.\d+(?:-.+)?$/.test(commit.trim())
    }
  ]
}
