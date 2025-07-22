import { expect, Locator, Page } from '@playwright/test'
export class TodoPage {
  readonly page: Page
  readonly header: Locator
  readonly input: Locator
  readonly toDoText: Locator
  readonly buttonAll: Locator
  readonly buttonActive: Locator
  readonly buttonCompleted: Locator
  readonly buttonClearCompleted: Locator
  readonly buttonDeleteX: Locator
  readonly toggleActive: Locator
  readonly toggleAll: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.getByTestId('header')
    this.input = page.getByTestId('text-input')
    this.toDoText = page.getByTestId('todo-item-label')
    this.buttonAll = page.getByRole('link', { name: 'All' })
    this.buttonActive = page.getByRole('link', { name: 'Active' })
    this.buttonCompleted = page.getByRole('link', { name: 'Completed' })
    this.buttonClearCompleted = page.getByRole('button', {
      name: 'Clear completed',
    })
    this.buttonDeleteX = page.getByTestId('todo-item-button')
    this.toggleActive = page.getByTestId('todo-item-toggle')
    this.toggleAll = page.getByTestId('toggle-all')
  }

  async countToDoItems(page): Promise<number> {
    const todoItemsLabels = page.getByTestId('todo-item-label')
    const numberOfTasks = await todoItemsLabels.count()
    return numberOfTasks
  }

  async completeTaskByName(name: string) {
    const task = this.page.getByRole('listitem').filter({ hasText: name })
    await task.getByTestId('todo-item-toggle').check()
  }
}
