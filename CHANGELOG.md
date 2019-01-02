# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.5] - 2019-01-02
### Fixed
- Travis CI config no longer cleans up the git repository before deploy

## [0.1.4] - 2019-01-02
### Fixed
- Files key now uses `dist/\*\*/\*` glob

## [0.1.3] - 2019-01-02
### Changed
- Different email for author in package.json
### Fixed
- Added files key to package.json to allow dist folder to be pushed to npm

## [0.1.2] - 2018-10-30
### Added
- Config can get service account from environment variable (useful for CI environments)
### Fixed
- Renamed CHANGELOD.md to CHANGELOG.md (this file)

## [0.1.1] - 2018-10-30
### Changed
- Artificial version bump for new NPM token in Travis config

## [0.1.0] - 2018-10-30
### Added
- Initial code