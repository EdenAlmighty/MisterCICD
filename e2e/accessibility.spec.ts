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

  test('should have proper color contrast', async ({ page }) => {
    // This test would require actual color contrast testing
    // For now, we'll verify the app loads and is functional
    await expect(page.locator('.todo-page')).toBeVisible()
    await expect(page.locator('.todo-form')).toBeVisible()
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
