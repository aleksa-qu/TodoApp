import { expect, test } from '@playwright/test'
import { TodoPage } from './pages/todo-page'

test('create a task', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')
  await todoPage.input.fill('test')
  await todoPage.input.press('Enter')
  await expect.soft(todoPage.toDoText).toHaveText('test')
})

test('delete a task', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')

  await todoPage.input.fill('Apple')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Cake')
  await todoPage.input.press('Enter')
  const item = page.locator('li', { hasText: 'Cake' })
  await item.hover()
  await item.locator('[data-testid="todo-item-button"]').click()

  const count = await todoPage.countToDoItems(page)
  await expect.soft(count).toBe(1)
})

test('mark a task as completed by name', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')
  await todoPage.input.fill('Apple')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Cake')
  await todoPage.input.press('Enter')
  const item = page.locator('li', { hasText: 'Apple' })
  await item.hover()
  await item.locator('[data-testid="todo-item-toggle"]').click()

  await todoPage.buttonCompleted.click()
  await expect.soft(page.getByText('Apple')).toBeVisible()
  await expect.soft(page.getByText('Cake')).toHaveCount(0)
})

test('filter tasks using Active and Completed buttons', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')
  await todoPage.input.fill('Apple')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Cake')
  await todoPage.input.press('Enter')

  const completedItem = page.getByRole('listitem').filter({ hasText: 'Cake' })
  await completedItem.getByTestId('todo-item-toggle').check()

  await todoPage.buttonActive.click()
  await expect.soft(page.getByText('Apple')).toBeVisible()
  await expect.soft(page.getByText('Cake')).toHaveCount(0)

  await todoPage.buttonCompleted.click()
  await expect.soft(page.getByText('Cake')).toBeVisible()
  await expect.soft(page.getByText('Apple')).toHaveCount(0)
})

test('clear completed tasks', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')
  await todoPage.input.fill('Apple')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Cake')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Icecream')
  await todoPage.input.press('Enter')

  const item = page.locator('li', { hasText: 'Apple' })
  await item.hover()
  await item.locator('[data-testid="todo-item-toggle"]').click()

  const item1 = page.locator('li', { hasText: 'Cake' })
  await item1.hover()
  await item1.locator('[data-testid="todo-item-toggle"]').click()

  await todoPage.buttonCompleted.click()
  await expect.soft(page.getByText('Apple')).toBeVisible()
  await expect.soft(page.getByText('Cake')).toBeVisible()
  await todoPage.buttonClearCompleted.click()
  await todoPage.buttonAll.click()
  await expect.soft(page.getByText('Apple')).toHaveCount(0)
  await expect.soft(page.getByText('Cake')).toHaveCount(0)
  await expect.soft(page.getByText('Icecream')).toBeVisible()
})

test('mark all tasks as completed using toggle-all', async ({ page }) => {
  const todoPage = new TodoPage(page)
  await page.goto('https://todo-app.tallinn-learning.ee/#/')
  await todoPage.input.fill('Apple')
  await todoPage.input.press('Enter')
  await todoPage.input.fill('Cake')
  await todoPage.input.press('Enter')

  await todoPage.toggleAll.check()

  await todoPage.buttonCompleted.click()
  await expect.soft(page.getByText('Apple')).toBeVisible()
  await expect.soft(page.getByText('Cake')).toBeVisible()
})
