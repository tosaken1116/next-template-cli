# Create Template Next.js cli

## Usage

```
npx create-template-next@latest
# or
yarn create template-next
# or
pnpm create template-next
# or
bunx create-template-next
```

## Default `create-next-app` Options

### Project Name

```bash
? What is your project name? ›
```

### Typescript or Javascript

```bash
? Would you like to use Typescript? … No / Yes
```

### Use `src` Directory

```bash
? Would you like to use `src/` directory? … No / Yes
```

### Use `app` router

```bash
? Would you like to use AppRouter? … No / Yes
```

### Custom Import Alias

```bash
? Would you like to customize the default import alias? … No / Yes
```

## Additional Options

### use Storybook

[Storybook](https://storybook.js.org/)

```bash
? Would you like to use Storybook? › No / Yes
```

### Select Lint Tool

[ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

[Biome](https://biomejs.dev/)

```bash
? Which lint tool would you like to use? › - Use arrow-keys. Return to submit.
❯   ESLint + Prettier
    Biome
    None
```

### Select Test Tool

[Jest](https://jestjs.io/)

[Vitest](https://vitest.dev/)

```bash
? Which test tool would you like to use? › - Use arrow-keys. Return to submit.
❯   Jest
    Vitest
    None
```

### Select Generate Tool

[Hygen](https://www.hygen.io/)

[scaffdog](https://scaff.dog/)

```bash
? Which code generator would you like to use? › - Use arrow-keys. Return to submit.
❯   Hygen
    scaffdog
    None
```

### Select Project Size

```bash
? Which project size would you like to use? › - Use arrow-keys. Return to submit.
❯   Small
    Medium
    Large
```

### Select Package Manager

```bash
? Which package tool would you like to use? › - Use arrow-keys. Return to submit.
❯   npm
    Yarn
    pnpm
    bun
```

## CommandLine Options

```bash
Usage: create-template-next <project-directory> [options]

Options:
  -V, --version                        output the version number
  --ts, --typescript

    Initialize as a TypeScript project. (default)

  --js, --javascript

    Initialize as a JavaScript project.

  --tailwind

    Initialize with Tailwind CSS config. (default)

  --eslint

    Initialize with eslint config.

  --app

    Initialize as an App Router project.

  --src-dir

    Initialize inside a `src/` directory.

  --import-alias <alias-to-configure>

    Specify import alias to use (default "@/*").

  --storybook

      Initialize with Storybook.

  --jest

      Initialize with Jest.

  --vitest

      Initialize with Vitest.

  --hygen

      Initialize with Hygen.

  --scaffdog

      Initialize with Scaffdog.

  --small

      Initialize with small project size.

  --medium

      Initialize with medium project size. (default)

  --large

      Initialize with large project size.

  --npm

      Initialize with npm.

  --yarn

      Initialize with Yarn. (default)

  --pnpm

      Initialize with pnpm.

  --bun

      Initialize with bun.

  -h, --help                           display help for command

```
