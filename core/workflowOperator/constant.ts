import { Actions, GenTool, Packages, Scripts, Workflows } from "../../types";

export const scripts: Scripts<Workflows> = {
    lighthouse: {
        small: {},
        medium: {},
        large: {},
    },
    lint: {
        small: {
            "ci:lint": "npm-run-all lint:*",
        },
        medium: {
            "ci:lint": "npm-run-all lint:*",
        },
        large: {
            "ci:lint": "npm-run-all lint:*",
        },
    },
    test: {
        small: {
            "ci:test": "npm-run-all test:*",
        },
        medium: {
            "ci:test": "npm-run-all test:*",
        },
        large: {
            "ci:test": "npm-run-all test:*",
        },
    },
    "code-diff": {
        small: {},
        medium: {},
        large: {},
    },
    "bundle-size": {
        small: {},
        medium: {},
        large: {},
    },
    "install-dependencies": {
        small: {},
        medium: {},
        large: {},
    },
    build: {
        small: {},
        medium: {},
        large: {},
    },
    "useless-modules": {
        small: {},
        medium: {},
        large: {},
    },
} as const;

export const needActionsPaths: Record<Workflows, Actions[]> = {
    lighthouse: ["cache-build", "pull-request-comment"],
    lint: [],
    test: [],
    "code-diff": ["pull-request-comment"],
    "bundle-size": ["cache-build", "pull-request-comment"],
    "install-dependencies": ["cache-module"],
    build: ["cache-build"],
    "useless-modules": ["pull-request-comment"],
} as const;

export const workflowDependencies: Record<Workflows, Workflows[]> = {
    lighthouse: ["build"],
    lint: ["install-dependencies"],
    test: ["install-dependencies"],
    "code-diff": [],
    "bundle-size": ["build"],
    "install-dependencies": [],
    build: ["install-dependencies"],
    "useless-modules": ["install-dependencies"],
} as const;

export const WORKFLOW_BASE = `
name: CI

on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

permissions:
  id-token: write
  contents: write
  pull-requests: write
  actions: read

jobs:
`;
export const LIGHT_HOUSE = `  lighthouse:
      if: github.event_name == 'pull_request'
      needs: build
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Use Cached Dependencies
          uses: actions/cache@v4
          with:
              path: "**/node_modules"
              key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        - name: Use Cached Build
          uses: actions/cache@v4
          with:
              path: "**/.next"
              key: \${{ runner.os }}-npm-build-\${{ github.sha }}

        - name: Run Lighthouse
          id: lighthouse
          uses: treosh/lighthouse-ci-action@v10
          with:
              uploadArtifacts: true
              temporaryPublicStorage: true
              configPath: ./lighthouserc.json
        - name: Create Lighthouse Comment
          id: light-house-comment
          uses: actions/github-script@v5
          with:
              github-token: \${{secrets.GITHUB_TOKEN}}
              script: |
                    const results = \${{steps.lighthouse.outputs.manifest}}
                    const links = \${{steps.lighthouse.outputs.links}}
                    const mark = (value) => {
                    if (value >= 0.9) {
                        return '🟢';
                    } else if (value >= 0.5) {
                        return '🟡';
                    } else {
                        return '🔴';
                    }
                    };
                    const body = \`
                    # Lighthouse Report
                    | URL | Performance | Accessibility | Best Practices | SEO | PWA | Details |
                    | --- | ----------- | ------------- | -------------- | --- | --- | ------- |
                    \${results.map((result) => \`| \${result.url} | \${mark(result.summary.performance)}\${Math.trunc(result.summary.performance * 100)} | \${mark(result.summary.accessibility)}\${Math.trunc(result.summary.accessibility * 100)} | \${mark(result.summary['best-practices'])}\${Math.trunc(result.summary['best-practices'] * 100)} | \${mark(result.summary.seo)}\${Math.trunc(result.summary.seo * 100)} | \${mark(result.summary.pwa)}\${Math.trunc(result.summary.pwa * 100)} | :pencil: [result](\${links[result.url]}) |\`).join('\\n')}
                    \`;

                    core.setOutput("body", body)
        - name: Comment to Pull Request
          uses: ./.github/actions/pull-request-comment
          with:
                includes-comment: "<!-- __LIGHTHOUSE -->"
                comment-body: \${{steps.light-house-comment.outputs.body}}
`;

export const BUNDLE_ANALYZE = `  bundle-analysis:
      needs: build
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Use Cached Build
          uses: actions/cache@v4
          with:
              path: "**/node_modules"
              key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        - name: cache build
          uses: ./.github/actions/cache-build

        - name: Analyze bundle
          run: npx -p nextjs-bundle-analysis report

        - name: Upload bundle
          uses: actions/upload-artifact@v3
          with:
              name: bundle
              path: .next/analyze/__bundle_analysis.json

        - name: Download base branch bundle stats
          uses: dawidd6/action-download-artifact@v3
          if: success() && github.event.number
          with:
              workflow: ci.yml
              branch: \${{ github.event.pull_request.base.ref }}
              path: .next/analyze/base/bundle
              repo: \${{ github.repository }}
              github_token: \${{ secrets.GITHUB_TOKEN }}
              name: bundle

        - name: Compare with base branch bundle
          if: success() && github.event.number
          run: ls -laR .next/analyze/base && npx -p nextjs-bundle-analysis compare
        - name: Comment to Pull Request
          uses: ./.github/actions/pull-request-comment
          with:
              includes-comment: "<!-- __NEXTJS_BUNDLE -->"
              comment-body: $(cat .next/analyze/__bundle_analysis_comment.txt)

`;

export const BUILD = `  build:
      needs: install-dependencies
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: build
          uses: ./.github/actions/cache-build
`;

export const TEST = `  test:
      needs: install-dependencies
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2

        - name: Use Cached Dependencies
          uses: actions/cache@v4
          with:
              path: "**/node_modules"
              key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        - name: Use Cached Test Result
          uses: actions/cache@v4
          with:
              path: "**/.test_cache"
              key: \${{ runner.os }}-npm-test-\${{ github.base_ref}}
        - name: Get number of CPU cores
          id: cpu-cores
          uses: SimenB/github-actions-cpu-cores@v2
        - name: Test
          run: npm run test:unit --max-workers \${{ steps.cpu-cores.outputs.count }}

`;

export const LINT = `  lint:
      needs: install-dependencies
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2

        - name: Use Cached Dependencies
          uses: actions/cache@v4
          with:
              path: "**/node_modules"
              key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        - name: Lint
          run: npm run lint

`;

export const INSTALL_DEPENDENCIES = `  install-dependencies:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: install modules
          uses: ./.github/actions/cache-module
`;

export const CODE_DIFF = `  report-diff:
      if: github.event_name == 'pull_request'
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Get PR Diff
          id: diff
          run: |
              git fetch origin \${{ github.base_ref }}
              git diff --numstat origin/\${{ github.base_ref }} > diff.txt
              TOTAL_LINES=$(awk '{ added += $1; removed += $2 } END { print added+removed }' diff.txt)
              echo "total-lines=$TOTAL_LINES" >> $GITHUB_OUTPUT

        - name: Create Diff Comment
          uses: actions/github-script@v3
          id: diff-comment
          with:
              github-token: \${{secrets.GITHUB_TOKEN}}
              script: |
                const totalLines = \${{ steps.diff.outputs.total-lines }};
                const warning = \`> [!WARNING]\\n> The code changes are nearly 400 lines. Reviewers, please review carefully.\\n> Reviewees, try to keep changes under 300 lines.\`;
                const caution =\`> [!CAUTION]\\n> The code changes exceed 400 lines. This amount of changes may increase the risk of bugs.\\n> Reviewees might find it easier to review if the pull request is split.\`;
                const body = \`**Total Lines Changed:** \${totalLines}
                \${totalLines > 400 ? caution : totalLines > 300 ? warning:""}
                \`
                core.setOutput("body", body)
        - name: Comment to Pull Request
          uses: ./.github/actions/pull-request-comment
          with:
              includes-comment: "<!-- __DIFF -->"
              comment-body: \${{steps.diff-comment.outputs.body}}
`;

export const USELESS_MODULES = `  report-useless-modules:
      needs: install-dependencies
      if: github.event_name == 'pull_request'
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Use Cached Dependencies
          uses: actions/cache@v4
          with:
            path: '**/node_modules'
            key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        - name: Analyze modules
          id: useless-modules
          run: |
            echo "result=$(npx depcheck . --skip-missing --json)" >> $GITHUB_OUTPUT
        - name: Create Useless Modules Comment
          id: useless-modules-comment
          uses: actions/github-script@v3
          with:
            github-token: \${{secrets.GITHUB_TOKEN}}
            script: |
              const json = \${{steps.useless-modules.outputs.result}};
              const isUselessModuleEmpty = json.dependencies.length === 0;
              const uselessModulesComment = isUselessModuleEmpty ? 'useless modules not found✨' : \`> [!CAUTION]\\n> The following modules are not used in the code. Please remove them.\\n> \${json.dependencies.map((module) => \`- \${module}\`).join('\\n> ')}\`;
              core.setOutput("body", uselessModulesComment)
        - name: report useless modules
          uses: ./.github/actions/pull-request-comment
          with:
            includes-comment: '<!-- __USELESS_MODULES -->'
            comment-body: \${{steps.useless-modules-comment.outputs.body}}
`;
export const workflowContents: Record<Workflows, string> = {
    lighthouse: LIGHT_HOUSE,
    lint: LINT,
    test: TEST,
    "code-diff": CODE_DIFF,
    "bundle-size": BUNDLE_ANALYZE,
    "install-dependencies": INSTALL_DEPENDENCIES,
    build: BUILD,
    "useless-modules": USELESS_MODULES,
} as const;
