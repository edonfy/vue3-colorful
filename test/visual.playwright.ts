import { test, expect, Page } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('HexColorPicker should match snapshot', async ({ page }: { page: Page }) => {
    // Navigating directly to the iframe for a clean screenshot
    await page.goto(
      'http://localhost:6006/iframe.html?id=components-specializedpickers--hex&viewMode=story'
    )
    // Wait for the picker to be visible
    await page.waitForSelector('.vue3-colorful')
    await expect(page.locator('.vue3-colorful')).toHaveScreenshot('hex-picker.png')
  })

  test('Popover Mode should match snapshot when opened', async ({ page }: { page: Page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=ecosystem-integrations--popover-mode&viewMode=story'
    )
    const trigger = page.locator('.vue3-colorful__swatch-trigger')
    await trigger.click()

    const popover = page.locator('.vue3-colorful__popover-content')
    await expect(popover).toBeVisible()
    await expect(popover).toHaveScreenshot('popover-opened.png')
  })

  test('CMYK Picker should match snapshot', async ({ page }: { page: Page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=components-specializedpickers--cmyk&viewMode=story'
    )
    await page.waitForSelector('.vue3-colorful')
    await expect(page.locator('.vue3-colorful')).toHaveScreenshot('cmyk-picker.png')
  })
})
