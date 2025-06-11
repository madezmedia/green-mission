# Contributing to Green Mission 🌱

Thank you for your interest in contributing to Green Mission! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Guidelines](#issue-guidelines)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ and pnpm installed
- Git configured with your GitHub credentials
- A GitHub account
- Basic understanding of Next.js, TypeScript, and React

### First-time Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/green-mission.git
   cd green-mission
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/madezmedia/green-mission.git
   ```

## 💻 Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
# Add your API keys and configuration
```

### 3. Setup Airtable (Optional)

```bash
tsx scripts/setup-green-mission-airtable.ts
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Contributing Guidelines

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

Examples:
- `feature/advanced-search-filters`
- `fix/badge-display-issue`
- `docs/api-documentation`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code restructuring
- `test` - Testing
- `chore` - Maintenance

Examples:
```
feat(search): add advanced filtering options
fix(badge): correct badge positioning on mobile
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, documented code
- Follow existing code style
- Add tests if applicable
- Update documentation as needed

### 3. Test Your Changes

```bash
pnpm lint          # Check code style
pnpm build         # Ensure it builds successfully
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template
4. Link related issues
5. Request review from maintainers

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Screenshots attached (if UI changes)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript mode
- Define proper types for all props and functions
- Avoid `any` types
- Use meaningful variable names

### React Components

```typescript
// Good
interface MemberCardProps {
  member: Member
  layout?: "grid" | "list"
}

export default function MemberCard({ member, layout = "grid" }: MemberCardProps) {
  // Component logic
}

// Use proper TypeScript types
const [members, setMembers] = useState<Member[]>([])
```

### File Organization

- Keep components small and focused
- Use descriptive file names
- Group related files in directories
- Export from index files when appropriate

### Styling

- Use Tailwind CSS classes
- Follow shadcn/ui patterns
- Implement responsive design
- Use CSS custom properties for themes

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, include:

1. **Clear title** describing the issue
2. **Environment details** (browser, OS, Node version)
3. **Steps to reproduce** the bug
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots** if applicable
7. **Error messages** or console logs

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug

**Environment**
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 118]
- Node.js: [e.g., 18.17.0]

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable, add screenshots

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Before Submitting

1. Check existing issues and discussions
2. Consider if it fits the project's goals
3. Think about implementation complexity
4. Consider backward compatibility

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Screenshots, mockups, or examples
```

## 📚 Development Resources

### Key Files to Understand

- `CLAUDE.md` - Development guidance and architecture
- `lib/airtable/green-mission-client.ts` - Data layer
- `components/directory/` - Member directory components
- `app/api/` - API endpoints
- `types/index.ts` - TypeScript definitions

### Helpful Commands

```bash
# Code formatting
pnpm lint

# Type checking
pnpm build

# Database scripts
tsx scripts/seed-airtable.ts

# Business ID management
pnpm generate-business-ids
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- Bug fixes and improvements
- Performance optimizations
- Accessibility enhancements
- Mobile responsiveness
- Test coverage

### Medium Priority
- New features from roadmap
- Documentation improvements
- Code refactoring
- UI/UX enhancements

### Ideas for New Contributors
- Fix typos in documentation
- Improve error handling
- Add loading states
- Enhance form validation
- Update dependencies

## 📞 Getting Help

- **Questions**: Start a [GitHub Discussion](https://github.com/madezmedia/green-mission/discussions)
- **Bugs**: Create a [GitHub Issue](https://github.com/madezmedia/green-mission/issues)
- **Security**: Email security@madezmedia.com

## 🏆 Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Invited to join our contributors team
- Eligible for special badges

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Green Mission better! 🌱💚