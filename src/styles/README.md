# Chess Game - Sass Architecture

This document outlines the organized Sass architecture for the React Chess application.

## 📁 File Structure

```
src/styles/
├── index.scss          # Main entry point - imports all component styles
├── _variables.scss     # Sass variables (colors, sizes, spacing, etc.)
├── _mixins.scss        # Reusable Sass mixins
└── README.md          # This documentation
```

## 🎨 Variables (`_variables.scss`)

### Colors
- **Chess Board**: `$chess-light-square`, `$chess-dark-square`, `$chess-highlight`
- **UI Elements**: `$modal-overlay`, `$modal-hover`, `$button-primary`

### Sizes
- **Board**: `$board-size` (50rem), `$tile-size` (6.25rem)
- **Pieces**: `$piece-size` (5rem)
- **Modals**: `$modal-width`, `$modal-height`

### Spacing
- Consistent spacing scale: `$spacing-xs` through `$spacing-xxl`

### Typography
- Font sizes: `$font-size-sm` through `$font-size-xl`

### Layout
- Breakpoints, grid settings

## 🔧 Mixins (`_mixins.scss`)

### Layout Mixins
- `@include flex-center` - Center content with flexbox
- `@include flex-column` - Vertical flex layout
- `@include chess-grid` - Chess board grid layout

### Positioning Mixins
- `@include absolute-center` - Center absolutely positioned elements

### Component Mixins
- `@include tile-base` - Base tile styling

### Interaction Mixins
- `@include clickable` - Hover and active states
- `@include grab-cursor` - Drag cursor states

## 📝 Usage Examples

### Using Variables
```scss
.my-component {
  background-color: $chess-dark-square;
  padding: $spacing-md;
  border-radius: $border-radius-sm;
}
```

### Using Mixins
```scss
.tile {
  @include tile-base;
  @include clickable;
}
```

## 🎯 Benefits

1. **Consistency**: Centralized variables ensure consistent styling
2. **Maintainability**: Easy to update colors, sizes, and spacing globally
3. **Reusability**: Mixins reduce code duplication
4. **Scalability**: Organized structure supports future growth
5. **Developer Experience**: Clear naming and documentation

## 🔄 @use vs @import Strategy

### Modern Sass Architecture
- **All files** now use `@use` for proper module system
- **Internal partials** (`_variables.scss`, `_mixins.scss`) use `@use` for encapsulation
- **Component files** use `@use` for modern Sass syntax

### Why This Approach?
- **Modern Sass**: `@use`/`@forward` provides better encapsulation and namespace control
- **Build Compatibility**: Works with Next.js CSS modules processing
- **Future-Proof**: Aligns with Sass best practices

### Migration Complete
```scss
// ✅ New way (all files - current)
@use 'variables' as *;
@use 'mixins' as *;
```

## 🎮 Chess-Specific Features

- **Board Grid**: Automated 8x8 grid generation with `$chess-grid-*` variables
- **Piece Styling**: Consistent piece sizing and interaction states
- **Highlight System**: Move highlighting with customizable colors
- **Modal System**: Reusable modal components
- **Responsive Design**: Breakpoint system ready for mobile optimization