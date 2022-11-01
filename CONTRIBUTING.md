# Development guide

## Prerequisites

- Deno v1.26.x
- Node.js v16 (to publish to NPM)

## Commands

Project specific commands.
Please refer to `deno help` or [Deno's manual](https://deno.land/manual@v1.26.2/introduction) for other tasks.

### Setup git hooks

Optional but recommended, run this command or copy the files under `.githooks` into `.git/hooks`.

```sh
$ git config core.hooksPath .githooks
```

This command configures these git hooks:

- (pre-commit) Run `deno fmt --check` to check files are properly formatted.
- (pre-commit) Run `deno lint`.
- (pre-commit) Run `deno test --doc` to run unit tests and type check.
- (pre-commit) Run `deno check scripts/build_npm.ts` to run type check for build script.

See the contents of each files to see what will be executed.

If your work directory has unstaged files, some checking process may fail.
To commit without those unstaged files, stash them before commit.

### Run unit tests

```sh
# This also performs type checking
$ deno test
```

To see test coverage:

```sh
# `coverage/` is ignored in .gitingore
# You can also use other than `coverage/` (e.g. `cov/`)
$ deno test --coverage=coverage/
$ deno coverage coverage/ --exclude=tests --exclude=_test
```
