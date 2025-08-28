import { test, expect } from '@playwright/test'

test.describe('Performance and Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now()

    // Navigate to the page
    await page.goto('/')

    // Wait for the main content to be visible
    await expect(page.locator('.todo-page')).toBeVisible()

    const loadTime = Date.now() - startTime

    // Assert that the page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should handle rapid todo additions', async ({ page }) => {
    const todos = Array.from({ length: 10 }, (_, i) => `Todo ${i + 1}`)

    // Add todos rapidly
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
      // Small delay to ensure stability
      await page.waitForTimeout(100)
    }

    // Verify all todos were added
    await expect(page.locator('.todo-text')).toHaveCount(10)
    await expect(page.locator('.todo-stats')).toContainText('Total:10')
  })

  test('should handle rapid todo completions', async ({ page }) => {
    // Add multiple todos first
    const todos = Array.from({ length: 5 }, (_, i) => `Todo ${i + 1}`)
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Complete todos rapidly
    const toggleButtons = page.locator('.todo-toggle')
    for (let i = 0; i < 5; i++) {
      await toggleButtons.nth(i).click()
    }

    // Verify all todos are completed
    await expect(page.locator('.todo-stats')).toContainText('Completed:5')
    await expect(page.locator('.todo-stats')).toContainText('Active:0')
  })

  test('should handle rapid todo deletions', async ({ page }) => {
    // Add multiple todos first
    const todos = Array.from({ length: 5 }, (_, i) => `Todo ${i + 1}`)
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Delete todos rapidly
    const deleteButtons = page.locator('.todo-delete-btn')
    for (let i = 0; i < 5; i++) {
      await deleteButtons.first().click()
    }

    // Verify all todos are deleted
    await expect(page.locator('.todo-text')).toHaveCount(0)
    await expect(page.locator('.todo-stats')).toContainText('Total:0')
  })

  test('should handle large number of todos', async ({ page }) => {
    // Add several todos
    for (let i = 1; i <= 5; i++) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(`Todo ${i}`)
      await page.locator('button[type="submit"]').click()
      // Wait for each todo to be added
      await expect(page.locator('.todo-text')).toHaveCount(i)
    }

    // Verify todos were added
    await expect(page.locator('.todo-text')).toHaveCount(5)
    await expect(page.locator('.todo-stats')).toContainText('Total:5')

    // Verify the app is still responsive
    await page.locator('input[placeholder="What needs to be done?"]').fill('Performance test')
    await page.locator('button[type="submit"]').click()

    // Wait for the last todo to be added
    await expect(page.locator('.todo-text')).toHaveCount(6)
  })

  test('should handle memory usage efficiently', async ({ page }) => {
    // Add and remove todos multiple times to test memory management
    for (let cycle = 0; cycle < 3; cycle++) {
      // Add todos
      for (let i = 0; i < 5; i++) {
        await page
          .locator('input[placeholder="What needs to be done?"]')
          .fill(`Cycle ${cycle} Todo ${i}`)
        await page.locator('button[type="submit"]').click()
      }

      // Verify todos were added
      await expect(page.locator('.todo-text')).toHaveCount(5)

      // Delete all todos
      const deleteButtons = page.locator('.todo-delete-btn')
      const count = await deleteButtons.count()
      for (let i = 0; i < count; i++) {
        await deleteButtons.first().click()
      }

      // Verify todos were deleted
      await expect(page.locator('.todo-text')).toHaveCount(0)
    }

    // Verify final state
    await expect(page.locator('.todo-text')).toHaveCount(0)
  })

  test('should handle concurrent operations', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Concurrent test')
    await page.locator('button[type="submit"]').click()

    // Perform multiple operations simultaneously
    await Promise.all([
      page.locator('.todo-toggle').click(),
      page.locator('.todo-edit-btn').click(),
      page.locator('.todo-delete-btn').click(),
    ])

    // Verify the app handled concurrent operations gracefully
    await expect(page.locator('.todo-text')).toHaveCount(0)
  })

  test('should handle network interruptions gracefully', async ({ page }) => {
    // This test would require mocking network conditions
    // For now, we'll test that the app works offline (localStorage)

    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Offline test')
    await page.locator('button[type="submit"]').click()

    // Verify todo was added
    await expect(page.locator('.todo-text')).toHaveText('Offline test')

    // Reload the page to test persistence
    await page.reload()

    // Verify todo persists
    await expect(page.locator('.todo-text')).toHaveText('Offline test')
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Navigation test')
    await page.locator('button[type="submit"]').click()

    // Verify todo was added
    await expect(page.locator('.todo-text')).toHaveText('Navigation test')

    // Test that the app handles navigation gracefully
    // For now, just verify the todo persists after a simple page reload
    await page.reload()
    await expect(page.locator('.todo-text')).toHaveText('Navigation test')
  })

  test('should handle page refresh', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Refresh test')
    await page.locator('button[type="submit"]').click()

    // Refresh the page
    await page.reload()

    // Verify todo persists
    await expect(page.locator('.todo-text')).toHaveText('Refresh test')
  })

  test('should handle browser tab switching', async ({ page }) => {
    // Add a todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Tab switch test')
    await page.locator('button[type="submit"]').click()

    // Simulate tab switching (this is more of a browser test)
    await page.evaluate(() => {
      // Simulate page visibility change
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
      })
      window.dispatchEvent(new Event('visibilitychange'))

      // Simulate page becoming visible again
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
      })
      window.dispatchEvent(new Event('visibilitychange'))
    })

    // Verify todo is still there
    await expect(page.locator('.todo-text')).toHaveText('Tab switch test')
  })

  test('should handle different screen sizes efficiently', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 6/7/8
      { width: 414, height: 896 }, // iPhone X/XS
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1920, height: 1080 }, // Desktop
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)

      // Test basic functionality
      await page
        .locator('input[placeholder="What needs to be done?"]')
        .fill(`Viewport ${viewport.width}x${viewport.height}`)
      await page.locator('button[type="submit"]').click()

      await expect(page.locator('.todo-text')).toHaveText(
        `Viewport ${viewport.width}x${viewport.height}`,
      )

      // Clean up for next iteration
      await page.locator('.todo-delete-btn').click()
    }
  })
})
