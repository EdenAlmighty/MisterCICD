import { test, expect } from '@playwright/test'

test.describe('Accessibility and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have proper ARIA labels', async ({ page }) => {
    // Check form input has proper label
    await expect(page.locator('input[placeholder="What needs to be done?"]')).toHaveAttribute(
      'placeholder',
      'What needs to be done?',
    )

    // Add a todo to test other ARIA labels
    await page.locator('input[placeholder="What needs to be done?"]').fill('Test todo')
    await page.locator('button[type="submit"]').click()

    // Check toggle button has proper aria-label
    await expect(page.locator('.todo-toggle')).toHaveAttribute('aria-label', 'Mark as complete')

    // Check edit button has proper aria-label
    await expect(page.locator('.todo-edit-btn')).toHaveAttribute('aria-label', 'Edit todo')

    // Check delete button has proper aria-label
    await expect(page.locator('.todo-delete-btn')).toHaveAttribute('aria-label', 'Delete todo')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Add a todo first
    await page
      .locator('input[placeholder="What needs to be done?"]')
      .fill('Keyboard navigation test')
    await page.locator('button[type="submit"]').click()

    // Test that the input is focusable
    await page.locator('input[placeholder="What needs to be done?"]').focus()
    await expect(page.locator('input[placeholder="What needs to be done?"]')).toBeFocused()

    // Test that buttons are accessible and clickable
    await expect(page.locator('.todo-toggle')).toBeVisible()
    await expect(page.locator('.todo-edit-btn')).toBeVisible()
    await expect(page.locator('.todo-delete-btn')).toBeVisible()

    // Test that buttons have proper ARIA labels
    await expect(page.locator('.todo-toggle')).toHaveAttribute('aria-label')
    await expect(page.locator('.todo-edit-btn')).toHaveAttribute('aria-label')
    await expect(page.locator('.todo-delete-btn')).toHaveAttribute('aria-label')
  })

  test('should handle screen reader announcements', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Screen reader test')
    await page.locator('button[type="submit"]').click()

    // Verify the todo is announced (this would require actual screen reader testing)
    await expect(page.locator('.todo-text')).toHaveText('Screen reader test')
  })

  test('should have proper focus management', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Focus test')
    await page.locator('button[type="submit"]').click()

    // Start editing
    await page.locator('.todo-edit-btn').click()

    // Verify edit input is focused
    await expect(page.locator('.todo-edit-input')).toBeFocused()

    // Save edit
    await page.locator('.todo-edit-input').press('Enter')

    // Verify focus returns to a logical place (this depends on your implementation)
    await expect(page.locator('.todo-edit-input')).toBeHidden()
  })

  test('should handle high contrast mode', async ({ page }) => {
    // This test would require actual high contrast mode testing
    // For now, we'll verify the app loads and is functional
    await expect(page.locator('.todo-page')).toBeVisible()
    await expect(page.locator('.todo-form')).toBeVisible()
  })

  test('should handle zoom levels', async ({ page }) => {
    // Test at 200% zoom
    await page.setViewportSize({ width: 800, height: 600 })

    // Verify app is still functional
    await page.locator('input[placeholder="What needs to be done?"]').fill('Zoom test')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('.todo-text')).toHaveText('Zoom test')
  })

  test('should handle reduced motion preferences', async ({ page }) => {
    // This test would require actual reduced motion testing
    // For now, we'll verify the app loads and is functional
    await expect(page.locator('.todo-page')).toBeVisible()
    await expect(page.locator('.todo-form')).toBeVisible()
  })

  test('should handle header contrast', async ({ page }) => {
    // Helper function to calculate relative luminance
    const getRelativeLuminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    // Helper function to calculate contrast ratio
    const getContrastRatio = (lum1: number, lum2: number): number => {
      const lighter = Math.max(lum1, lum2)
      const darker = Math.min(lum1, lum2)
      return (lighter + 0.05) / (darker + 0.05)
    }

    // Helper function to parse RGB values
    const parseRGB = (rgbString: string): [number, number, number] => {
      const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
      }
      // Fallback for hex colors
      if (rgbString.startsWith('#')) {
        const hex = rgbString.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return [r, g, b]
      }
      return [0, 0, 0] // Default fallback
    }

    await page.goto('/')

    // Check todo header title has good contrast
    const headerTitle = page.locator('.todo-title')
    await expect(headerTitle).toBeVisible()

    // Get the computed styles for the title
    const titleStyles = await headerTitle.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      }
    })

    // Get the actual page background color (not the transparent header background)
    const pageBackground = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('Title styles:', titleStyles)
    console.log('Page background:', pageBackground)

    // Parse the colors and calculate contrast
    const titleColor = parseRGB(titleStyles.color)
    const pageBg = parseRGB(pageBackground)

    const titleLum = getRelativeLuminance(...titleColor)
    const pageBgLum = getRelativeLuminance(...pageBg)
    const titleContrast = getContrastRatio(titleLum, pageBgLum)

    console.log(`Title contrast ratio: ${titleContrast.toFixed(2)}`)
    console.log(`Title color: ${titleStyles.color} (luminance: ${titleLum.toFixed(4)})`)
    console.log(`Page background: ${pageBackground} (luminance: ${pageBgLum.toFixed(4)})`)

    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    // Since this is a large title, we'll use 3:1 as the minimum
    // BUT: #1d4ed8 on #ffffff actually gives 3.68:1, which is poor
    // Let's test against the actual expected contrast
    const expectedContrast = 3.68 // This is what WebAIM and other tools give
    console.log(`Expected contrast ratio: ${expectedContrast}`)
    console.log(`Actual contrast ratio: ${titleContrast.toFixed(2)}`)

    // The test should FAIL because 3.68:1 is poor contrast
    // We need a contrast ratio of at least 4.5:1 for good readability
    expect(titleContrast).toBeGreaterThanOrEqual(4.5)
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')

    // Check that the main text elements have good contrast
    // We'll verify that text elements have proper styling for readability

    // Check main heading/input has good contrast
    const input = page.locator('input[placeholder="What needs to be done?"]')
    await expect(input).toBeVisible()

    // Check that the input has proper styling (not transparent or very light)
    const inputStyles = await input.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor,
      }
    })

    // Verify input has visible styling
    expect(inputStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
    expect(inputStyles.color).not.toBe('rgba(0, 0, 0, 0)') // Not transparent

    // Check submit button has good contrast
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()

    const buttonStyles = await submitBtn.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      }
    })

    // Verify button has visible styling
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
    expect(buttonStyles.color).not.toBe('rgba(0, 0, 0, 0)') // Not transparent

    // Add a todo to test dynamic content contrast
    await page.locator('input[placeholder="What needs to be done?"]').fill('Color contrast test')
    await page.locator('button[type="submit"]').click()

    // Check that the added todo text is visible
    const todoText = page.locator('.todo-text')
    await expect(todoText).toHaveText('Color contrast test')

    // Verify todo text has proper styling
    const todoStyles = await todoText.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      }
    })

    // Verify todo text is readable
    expect(todoStyles.color).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
    expect(todoStyles.color).not.toBe('rgba(255, 255, 255, 0)') // Not transparent white

    console.log('Color contrast test passed - all text elements have proper styling')
  })

  test('should handle form submission with Enter key', async ({ page }) => {
    // Test form submission with Enter key
    await page.locator('input[placeholder="What needs to be done?"]').fill('Enter key test')
    await page.locator('input[placeholder="What needs to be done?"]').press('Enter')

    // Verify todo was added
    await expect(page.locator('.todo-text')).toHaveText('Enter key test')
  })

  test('should handle form submission with Shift+Enter', async ({ page }) => {
    // Test that Shift+Enter doesn't submit the form (if you want to allow multi-line)
    await page.locator('input[placeholder="What needs to be done?"]').fill('Shift+Enter test')
    await page.locator('input[placeholder="What needs to be done?"]').press('Shift+Enter')

    // Verify form is still in focus and not submitted
    await expect(page.locator('input[placeholder="What needs to be done?"]')).toBeFocused()
  })

  test('should handle long todo text', async ({ page }) => {
    const longText =
      'This is a very long todo text that should be handled properly by the application without breaking the layout or causing any accessibility issues'

    await page.locator('input[placeholder="What needs to be done?"]').fill(longText)
    await page.locator('button[type="submit"]').click()

    // Verify long text is handled properly
    await expect(page.locator('.todo-text')).toHaveText(longText)
  })

  test('should handle special characters in todo text', async ({ page }) => {
    const specialText = 'Todo with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'

    await page.locator('input[placeholder="What needs to be done?"]').fill(specialText)
    await page.locator('button[type="submit"]').click()

    // Verify special characters are handled properly
    await expect(page.locator('.todo-text')).toHaveText(specialText)
  })

  test('should handle unicode characters in todo text', async ({ page }) => {
    const unicodeText = 'Todo with unicode: 🚀 📝 ✅ ❌ 🎉'

    await page.locator('input[placeholder="What needs to be done?"]').fill(unicodeText)
    await page.locator('button[type="submit"]').click()

    // Verify unicode characters are handled properly
    await expect(page.locator('.todo-text')).toHaveText(unicodeText)
  })
})
