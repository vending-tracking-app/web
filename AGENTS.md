# Agent Guidelines for Vending Tracking App

## UI Component Library

### Radix UI Themes

This project uses [Radix UI Themes](https://www.radix-ui.com/themes) as the primary UI component library. **Always prefer Radix components over custom implementations or other libraries.**

### Styling

- Use Radix's built-in props for styling (e.g., `gap`, `p`, `m`, `size`)
- For custom styling, use the `className` prop with CSS modules
- Avoid inline styles unless absolutely necessary

### Best Practices

1. **Always check Radix Themes documentation first** before creating custom components
2. Use semantic component names from Radix (e.g., `<Container>` not `<div className="container">`)
3. Leverage Radix's responsive props (e.g., `<Flex direction={{ initial: 'column', md: 'row' }}>`)
4. Use Radix's theming system for colors, spacing, and typography
5. Keep layouts simple and composable using `<Flex>` and `<Box>`

## Resources

- [Radix Themes Documentation](https://www.radix-ui.com/themes/docs)
- [Radix Themes Playground](https://www.radix-ui.com/themes/playground)
- [Component Examples](https://www.radix-ui.com/themes/docs/components)

