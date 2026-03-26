# Contributing to vue3-colorful

Thank you for your interest in contributing to vue3-colorful! This guide will help you get started.

## Development Setup

This project is **TSX-only**. Please do not add Vue SFC files (`.vue`); components should be implemented with `defineComponent` and render functions in `.tsx` files.

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/vue3-colorful.git
   cd vue3-colorful
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

   To preview the demo site locally:

   ```bash
   pnpm vite --config vite.config.example.ts
   ```

## Development Workflow

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write your code following the existing style
   - Add tests for new features
   - Update documentation if needed

3. **Run quality checks**

   ```bash
   # Type checking
   pnpm type-check

   # Linting
   pnpm lint

   # Formatting
   pnpm format

   # Tests
   pnpm test:run
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Use `pnpm` for scripts and dependency management
- Keep component implementations in `.tsx` files only
- Do not introduce Vue SFC files (`.vue`)
- Write meaningful commit messages
- Add JSDoc comments for public APIs

## Testing

- Write tests for new features
- Ensure all tests pass before submitting
- Aim for high test coverage

## Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description
- Include reproduction steps
- Add relevant labels

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
