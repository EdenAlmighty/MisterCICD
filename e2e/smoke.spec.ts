import { test, expect } from '@playwright/test'

// Smoke tests for post-deployment verification
// These tests verify basic functionality without being too comprehensive

test.describe('Smoke Tests - Post Deployment', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/')

    // Check if the page loads
    await expect(page).toHaveTitle(/Todo/)

    // Check if main elements are visible
    await expect(page.locator('input[placeholder="What needs to be done?"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should add a new todo', async ({ page }) => {
    await page.goto('/')

    // Add a simple todo
    await page.locator('input[placeholder="What needs to be done?"]').fill('Smoke test todo')
    await page.locator('button[type="submit"]').click()

    // Verify todo was added
    await expect(page.locator('.todo-text')).toContainText('Smoke test todo')
  })

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/')

    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Toggle test todo')
    await page.locator('button[type="submit"]').click()

    // Toggle completion
    await page.locator('.todo-toggle').first().click()

    // Verify toggle worked
    await expect(page.locator('.todo-item.completed')).toBeVisible()
  })

  test('should delete a todo', async ({ page }) => {
    await page.goto('/')

    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Delete test todo')
    await page.locator('button[type="submit"]').click()

    // Delete the todo
    await page.locator('.todo-delete-btn').first().click()

    // Verify todo was deleted
    await expect(page.locator('.todo-text')).not.toContainText('Delete test todo')
  })

  test('should handle basic routing', async ({ page }) => {
    await page.goto('/')

    // Check if router is working
    await expect(page.locator('#app')).toBeVisible()

    // Verify no 404 errors
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('should display todo statistics', async ({ page }) => {
    await page.goto('/')

    // Add a few todos
    const todos = ['Todo 1', 'Todo 2', 'Todo 3']
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Check if stats are displayed
    await expect(page.locator('.todo-stats')).toContainText('Total:3')
  })
})

// Production-specific smoke tests
test.describe('Production Smoke Tests', () => {
  test('should handle production environment variables', async ({ page }) => {
    await page.goto('/')

    // Check if app loads in production mode
    await expect(page.locator('#app')).toBeVisible()

    // Verify no development-only features are visible
    // (Adjust based on your app's production behavior)
  })

  test('should have acceptable performance', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')

    const loadTime = Date.now() - startTime

    // Performance threshold: should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000)

    console.log(`Page loaded in ${loadTime}ms`)
  })

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('/')

    // Simulate rapid interactions
    await page.locator('input[placeholder="What needs to be done?"]').fill('Concurrent test 1')
    await page.locator('button[type="submit"]').click()

    await page.locator('input[placeholder="What needs to be done?"]').fill('Concurrent test 2')
    await page.locator('button[type="submit"]').click()

    // Verify both todos were added
    await expect(page.locator('.todo-text')).toContainText('Concurrent test 1')
    await expect(page.locator('.todo-text')).toContainText('Concurrent test 2')
  })
})
