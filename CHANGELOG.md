# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Shipped code has been changed from ES2015 to ES2021. Node.js >=16 is required.

### Added

- ESM builds.
- Export `NodeBase` interface.

## [2.0.2] - 2022-10-31

### Fixed

- Parse bold formatting properly with various punctuation suffixes (PR: [#35](https://github.com/pocka/slack-message-parser/pull/35)).

## [2.0.1] - 2022-03-13

### Fixed

- Removed unnecessary files from published tarball ([557cf72](https://github.com/pocka/slack-message-parser/commit/557cf72c14511d2450ee283a58376974e51c4f49)).

## [2.0.0] - 2022-03-13

### Changed

- Change TypeScript typing for the return type of `parse` function from `Node` to `Root`. Since `Node` has been including `Root`, this is breaking only when you obtain `Node` interface type by inferencing the return type of `parse` function. (PR: [#27](https://github.com/pocka/slack-message-parser/pull/27)).

## [1.1.0] - 2021-05-25

### Added

- Add `source` property to all node types (Issue: [#29](https://github.com/pocka/slack-message-parser/issues/29)).

## [1.0.7] - 2020-12-10

### Fixed

- Add more disallowed characters to emoji regex (PR: [#28](https://github.com/pocka/slack-message-parser/pull/28)).

## [1.0.6] - 2019-11-08

### Fixed

- Fix the parser treats other special characters as emoji name (Issue: [#22](https://github.com/pocka/slack-message-parser/issues/22), PR: [#23](https://github.com/pocka/slack-message-parser/pull/23)).

## [1.0.5] - 2019-08-29

### Fixed

- Add missing delimiters (Issue: [#7](https://github.com/pocka/slack-message-parser/issues/7), PR: [#15](https://github.com/pocka/slack-message-parser/pull/15)).
- Treat spaces as part of URLs (Issue: [#13](https://github.com/pocka/slack-message-parser/issues/13), PR: [#14](https://github.com/pocka/slack-message-parser/pull/14)).

## [1.0.4] - 2019-06-03

### Fixed

- Fix emoji sequence parsing (Issue: [#6](https://github.com/pocka/slack-message-parser/issues/6), PR: [#8](https://github.com/pocka/slack-message-parser/pull/8)).

## [1.0.3] - 2019-04-20

### Fixed

- Treat comma and dot as separator (Issue: [#4](https://github.com/pocka/slack-message-parser/issues/4), PR: [#5](https://github.com/pocka/slack-message-parser/pull/5)).

[Unreleased]: https://github.com/pocka/slack-message-parser/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/pocka/slack-message-parser/compare/v2.0.1...v2.0.2
