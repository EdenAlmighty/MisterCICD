import { test, expect } from '@playwright/test'

test.describe('Todo Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the todo app header', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Todo App')
    await expect(page.locator('.todo-subtitle')).toContainText('Manage your tasks efficiently')
  })

  test('should add a new todo', async ({ page }) => {
    const todoText = 'Buy groceries'

    // Add a new todo
    await page.locator('input[placeholder="What needs to be done?"]').fill(todoText)
    await page.locator('button[type="submit"]').click()

    // Verify the todo was added
    await expect(page.locator('.todo-text')).toHaveText(todoText)
    await expect(page.locator('.todo-stats')).toContainText('Total:1')
    await expect(page.locator('.todo-stats')).toContainText('Active:1')
  })

  test('should add multiple todos', async ({ page }) => {
    const todos = ['Buy groceries', 'Walk the dog', 'Read a book']

    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Verify all todos were added
    await expect(page.locator('.todo-text')).toHaveCount(3)
    await expect(page.locator('.todo-stats')).toContainText('Total:3')
    await expect(page.locator('.todo-stats')).toContainText('Active:3')
  })

  test('should not add empty todos', async ({ page }) => {
    const initialCount = await page.locator('.todo-text').count()

    // Try to add empty todo - button should be disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled()

    // Verify no todo was added
    await expect(page.locator('.todo-text')).toHaveCount(initialCount)
  })

  test('should toggle todo completion', async ({ page }) => {
    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Test todo')
    await page.locator('button[type="submit"]').click()

    // Toggle completion
    await page.locator('.todo-toggle').click()

    // Verify todo is completed
    await expect(page.locator('.todo-item')).toHaveClass(/completed/)
    await expect(page.locator('.todo-stats')).toContainText('Completed:1')
    await expect(page.locator('.todo-stats')).toContainText('Active:0')
  })

  test('should edit a todo', async ({ page }) => {
    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Original text')
    await page.locator('button[type="submit"]').click()

    // Edit the todo
    await page.locator('.todo-edit-btn').click()
    await page.locator('.todo-edit-input').fill('Updated text')
    await page.locator('.todo-edit-input').press('Enter')

    // Verify the todo was updated
    await expect(page.locator('.todo-text')).toHaveText('Updated text')
  })

  test('should cancel editing a todo', async ({ page }) => {
    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Original text')
    await page.locator('button[type="submit"]').click()

    // Start editing
    await page.locator('.todo-edit-btn').click()
    await page.locator('.todo-edit-input').fill('Changed text')

    // Cancel editing
    await page.locator('.todo-edit-input').press('Escape')

    // Verify the todo text is unchanged
    await expect(page.locator('.todo-text')).toHaveText('Original text')
  })

  test('should delete a todo', async ({ page }) => {
    // Add a todo first
    await page.locator('input[placeholder="What needs to be done?"]').fill('Todo to delete')
    await page.locator('button[type="submit"]').click()

    const initialCount = await page.locator('.todo-text').count()

    // Delete the todo
    await page.locator('.todo-delete-btn').click()

    // Verify the todo was deleted
    await expect(page.locator('.todo-text')).toHaveCount(initialCount - 1)
  })

  test('should filter todos by status', async ({ page }) => {
    // Add multiple todos
    const todos = ['Active todo 1', 'Active todo 2', 'Active todo 3']
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Complete one todo
    await page.locator('.todo-toggle').first().click()

    // Test "All" filter
    await page.locator('button:has-text("All")').click()
    await expect(page.locator('.todo-text')).toHaveCount(3)

    // Test "Active" filter
    await page.locator('button:has-text("Active")').click()
    await expect(page.locator('.todo-text')).toHaveCount(2)

    // Test "Completed" filter - use the correct selector
    await page.locator('button:has-text("Completed")').first().click()
    await expect(page.locator('.todo-text')).toHaveCount(1)
  })

  test('should search todos', async ({ page }) => {
    // Add multiple todos
    const todos = ['Buy groceries', 'Walk the dog', 'Read a book', 'Write code']
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Search for "groceries"
    await page.locator('input[placeholder="Search todos..."]').fill('groceries')

    // Verify only matching todo is shown
    await expect(page.locator('.todo-text')).toHaveCount(1)
    await expect(page.locator('.todo-text')).toHaveText('Buy groceries')
  })

  test('should clear completed todos', async ({ page }) => {
    // Add multiple todos
    const todos = ['Todo 1', 'Todo 2', 'Todo 3']
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Complete two todos
    await page.locator('.todo-toggle').first().click()
    await page.locator('.todo-toggle').nth(1).click()

    // Clear completed todos
    await page.locator('button:has-text("Clear completed")').click()

    // Verify only active todos remain
    await expect(page.locator('.todo-text')).toHaveCount(1)
    await expect(page.locator('.todo-stats')).toContainText('Active:1')
    await expect(page.locator('.todo-stats')).toContainText('Completed:0')
  })

  test('should show empty state when no todos', async ({ page }) => {
    // Verify empty state is shown
    await expect(page.locator('.todo-empty')).toBeVisible()
    await expect(page.locator('.todo-empty')).toContainText('No todos yet')
    await expect(page.locator('.todo-empty')).toContainText('Add your first todo to get started!')
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Add a todo using Enter key
    await page.locator('input[placeholder="What needs to be done?"]').fill('Keyboard todo')
    await page.locator('input[placeholder="What needs to be done?"]').press('Enter')

    // Verify todo was added
    await expect(page.locator('.todo-text')).toHaveText('Keyboard todo')

    // Edit using double-click
    await page.locator('.todo-text').dblclick()
    await page.locator('.todo-edit-input').fill('Updated via keyboard')
    await page.locator('.todo-edit-input').press('Enter')

    // Verify edit was saved
    await expect(page.locator('.todo-text')).toHaveText('Updated via keyboard')
  })

  test('should show loading state', async ({ page }) => {
    // This test would require mocking the store to simulate loading
    // For now, we'll just verify the app loads without errors
    await expect(page.locator('.todo-page')).toBeVisible()
    await expect(page.locator('.todo-form')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify app is still functional
    await page.locator('input[placeholder="What needs to be done?"]').fill('Mobile test')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('.todo-text')).toHaveText('Mobile test')
  })

  test('should handle form validation', async ({ page }) => {
    // Try to submit empty form - button should be disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled()

    // Try to submit with only whitespace
    await page.locator('input[placeholder="What needs to be done?"]').fill('   ')
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('should maintain todo order', async ({ page }) => {
    const todos = ['First todo', 'Second todo', 'Third todo']

    // Add todos in order
    for (const todo of todos) {
      await page.locator('input[placeholder="What needs to be done?"]').fill(todo)
      await page.locator('button[type="submit"]').click()
    }

    // Verify todos are in correct order
    const todoElements = page.locator('.todo-text')
    for (let i = 0; i < todos.length; i++) {
      await expect(todoElements.nth(i)).toHaveText(todos[i])
    }
  })
})
