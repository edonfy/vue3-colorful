import { test, expect, Page } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('Showcase playground picker should keep a visible saturation area', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')
    await page.waitForSelector('.playground__picker.vue3-colorful')
    await expect(page.locator('.playground__picker.vue3-colorful')).toHaveScreenshot(
      'showcase-playground-picker.png'
    )
  })

  test('Showcase vertical picker should keep visible side sliders', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')
    await page.getByLabel('Vertical').check()
    await page.waitForSelector('.playground__picker.vue3-colorful--vertical')
    await expect(page.locator('.playground__picker.vue3-colorful--vertical')).toHaveScreenshot(
      'showcase-vertical-picker.png'
    )
  })

  test('Showcase dark mode should theme the demo shell', async ({ page }: { page: Page }) => {
    await page.goto('/')
    await page.getByLabel('Dark Mode').check()
    await expect(page.locator('body')).toHaveClass(/demo-body--dark/)
    await expect(page.locator('.playground__grid')).toHaveScreenshot('showcase-dark-mode.png')
  })

  test('HexColorPicker should match snapshot', async ({ page }: { page: Page }) => {
    await page.goto('/?view=hex')
    await page.waitForSelector('[data-testid="hex-picker"] .vue3-colorful')
    await expect(page.locator('[data-testid="hex-picker"] .vue3-colorful')).toHaveScreenshot(
      'hex-picker.png'
    )
  })

  test('Popover Mode should match snapshot when opened', async ({ page }: { page: Page }) => {
    await page.goto('/?view=popover')
    const trigger = page.locator('.vue3-colorful__swatch-trigger')
    await trigger.click()

    const popover = page.locator('.vue3-colorful__popover-content')
    await expect(popover).toBeVisible()
    await expect(popover).toHaveScreenshot('popover-opened.png')
  })

  test('ColorPickerPanel clearable mode should match snapshot', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/?view=panel')
    await page.waitForSelector('[data-testid="panel-picker"] .vue3-colorful')
    await expect(page.locator('[data-testid="panel-picker"] .vue3-colorful')).toHaveScreenshot(
      'panel-clearable.png'
    )
  })

  test('ColorPickerPanel keeps body height when presets and recent colors are shown', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/?view=panel')
    await page.waitForSelector('[data-testid="panel-picker"] .vue3-colorful')

    const panelRootHeight =
      (await page.locator('[data-testid="panel-picker"] .vue3-colorful').boundingBox())?.height ?? 0
    const panelBodyHeight =
      (await page.locator('[data-testid="panel-picker"] .vue3-colorful__body').boundingBox())
        ?.height ?? 0

    await page.goto('/?view=recent')
    await page.waitForSelector('[data-testid="recent-picker"] .vue3-colorful')

    const presets = page.locator(
      '[data-testid="recent-picker"] .vue3-colorful__presets .vue3-colorful__preset'
    )
    await presets.nth(0).click()
    await presets.nth(1).click()

    await page.waitForSelector('[data-testid="recent-picker"] .vue3-colorful__recent')

    const recentRootHeight =
      (await page.locator('[data-testid="recent-picker"] .vue3-colorful').boundingBox())?.height ??
      0
    const recentBodyHeight =
      (await page.locator('[data-testid="recent-picker"] .vue3-colorful__body').boundingBox())
        ?.height ?? 0

    expect(recentRootHeight).toBeGreaterThan(panelRootHeight)
    expect(recentBodyHeight).toBeGreaterThanOrEqual(panelBodyHeight - 1)
    expect(recentBodyHeight).toBeLessThanOrEqual(panelBodyHeight + 1)
  })

  test('ColorPickerPanel recent colors should match snapshot after commits', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/?view=recent')
    const presets = page.locator(
      '[data-testid="recent-picker"] .vue3-colorful__presets .vue3-colorful__preset'
    )

    await presets.nth(0).click()
    await presets.nth(1).click()

    await page.waitForSelector('[data-testid="recent-picker"] .vue3-colorful__recent')
    await expect(page.locator('[data-testid="recent-picker"] .vue3-colorful')).toHaveScreenshot(
      'panel-recent-colors.png'
    )
  })

  test('Disabled picker should match snapshot', async ({ page }: { page: Page }) => {
    await page.goto('/?view=disabled')
    await page.waitForSelector('[data-testid="disabled-picker"] .vue3-colorful')
    await expect(page.locator('[data-testid="disabled-picker"] .vue3-colorful')).toHaveScreenshot(
      'picker-disabled.png'
    )
  })

  test('CMYK Picker should match snapshot', async ({ page }: { page: Page }) => {
    await page.goto('/?view=cmyk')
    await page.waitForSelector('[data-testid="cmyk-picker"] .vue3-colorful')
    await expect(page.locator('[data-testid="cmyk-picker"] .vue3-colorful')).toHaveScreenshot(
      'cmyk-picker.png'
    )
  })
})
