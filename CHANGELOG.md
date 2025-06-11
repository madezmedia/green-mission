# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced search functionality across multiple fields
- Dynamic category filtering with live member counts
- Advanced filter panel with Featured/Showcase toggle
- Proper badge display system for all card instances
- Business Tags integration with predefined options
- Organization management with multi-org support

### Fixed
- Badge label display issues in member cards
- Category filtering not pulling live data
- Business Tags not showing in member cards
- Directory Spotlight badge implementation

### Changed
- Updated member data transformation to include all fields
- Improved search to include business tags and certifications
- Enhanced category extraction from live member data

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Green Mission platform
- Business directory with member profiles
- Clerk authentication integration
- Airtable multi-base integration
- Stripe subscription management
- Member dashboard with CRUD operations
- Responsive design with light/dark themes
- Business listing management system
- Organization-based access control

### Security
- Implemented webhook verification for Stripe and Clerk
- Added environment variable validation
- Secured API endpoints with proper authentication

---

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes