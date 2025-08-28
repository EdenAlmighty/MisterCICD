# Sass Setup Documentation

This project uses Sass for styling with a well-organized structure and modern best practices.

## File Structure

```
src/styles/
├── main.scss          # Main entry point - imports all other files
├── _variables.scss    # CSS custom properties and Sass variables
├── _mixins.scss       # Reusable Sass mixins
├── _base.scss         # Base styles and resets
├── _components.scss   # Component styles (buttons, cards, forms, etc.)
├── _utilities.scss    # Utility classes
└── README.md          # This file
```

## Usage

### CSS Custom Properties (Variables)

The project uses CSS custom properties for theming and consistency:

```scss
// Using CSS custom properties
.my-element {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

### Sass Variables

For use in Sass functions and mixins:

```scss
// Using Sass variables
.my-element {
  color: $primary-color;
  @include button-variant($primary-color, white, $primary-dark);
}
```

### Mixins

#### Responsive Design
```scss
.my-component {
  padding: 1rem;
  
  @include mobile {
    padding: 0.5rem;
  }
  
  @include desktop-up {
    padding: 2rem;
  }
}
```

#### Flexbox Helpers
```scss
.centered-container {
  @include flex-center;
}

.flex-between {
  @include flex-between;
}
```

#### Button Variants
```scss
.custom-button {
  @include button-variant($primary-color, white, $primary-dark);
}
```

### Utility Classes

The project includes utility classes for common styling needs:

```html
<!-- Spacing -->
<div class="p-md m-lg">Content</div>

<!-- Flexbox -->
<div class="d-flex justify-center align-center">Centered content</div>

<!-- Text -->
<h1 class="text-center text-primary">Title</h1>

<!-- Responsive -->
<div class="d-none d-block-mobile-up">Hidden on mobile</div>
```

### Component Classes

#### Buttons
```html
<button class="btn btn--primary">Primary Button</button>
<button class="btn btn--secondary btn--lg">Large Secondary Button</button>
<button class="btn btn--outline">Outline Button</button>
```

#### Cards
```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Card Title</h3>
  </div>
  <div class="card__content">
    <p>Card content goes here</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>
```

#### Forms
```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-input" />
  <div class="form-error">Error message</div>
</div>
```

#### Alerts
```html
<div class="alert alert--success">Success message</div>
<div class="alert alert--error">Error message</div>
<div class="alert alert--warning">Warning message</div>
<div class="alert alert--info">Info message</div>
```

## Adding New Styles

### For Component-Specific Styles

Create a new file in the styles directory and import it in `main.scss`:

```scss
// src/styles/_my-component.scss
.my-component {
  @include card;
  
  &__title {
    font-size: var(--font-size-xl);
    color: var(--primary-color);
  }
}
```

Then add to `main.scss`:
```scss
@import 'my-component';
```

### For Vue Component Styles

In your Vue component, you can use scoped styles with Sass:

```vue
<template>
  <div class="my-vue-component">
    <h2>My Component</h2>
  </div>
</template>

<style lang="scss" scoped>
.my-vue-component {
  @include card;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-md);
  }
}
</style>
```

## Best Practices

1. **Use CSS custom properties** for theming and design tokens
2. **Use Sass variables** for calculations and mixins
3. **Leverage mixins** for reusable patterns
4. **Use utility classes** for quick styling
5. **Keep component styles** in the `_components.scss` file
6. **Use BEM methodology** for component class naming
7. **Import new files** in `main.scss` to maintain organization

## Color Palette

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

## Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
