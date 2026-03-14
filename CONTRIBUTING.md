# Contributing to Steam Analytics Dashboard

Thank you for your interest in contributing to the Steam Analytics Dashboard! 🎮

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, browser)

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
6. **Push to the branch** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/steam-analytics-dashboard.git
cd steam-analytics-dashboard

# Install dependencies
npm install

# Set up Convex
npx convex dev

# Configure Steam API token
npx convex env set STEAM_ACCESS_TOKEN "your_token"

# Run development server
npm run dev
```

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting (Prettier/ESLint)
- Write meaningful commit messages
- Keep components focused and reusable
- Add comments for complex logic

### Testing

Before submitting a PR:
- Test all view modes (grid and table)
- Verify game detail pages work correctly
- Check responsive design on different screen sizes
- Ensure no console errors
- Test with real Steam data

### Areas for Contribution

Some ideas for contributions:

**Features:**
- Sortable table columns
- Search/filter functionality
- More chart types (line, bar, area)
- Export data to CSV
- Favorite games feature
- Dark/light theme toggle
- More time ranges (7 days, 30 days, all time)

**Improvements:**
- Performance optimizations
- Better error handling
- Loading states
- Accessibility improvements
- Mobile responsiveness
- Unit tests
- E2E tests

**Documentation:**
- API documentation
- Component documentation
- More examples
- Video tutorials

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions focused and professional

## Questions?

Feel free to open an issue for any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
