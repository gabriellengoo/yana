import { test, expect } from '@playwright/test'

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

test.use({
  launchOptions: {
    executablePath: chromePath
  }
})

test('project detail renders after client-side navigation and after reload', async ({ page }) => {
  const consoleMessages = []
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => {
    consoleMessages.push(`pageerror: ${error.message}`)
  })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.locator('.intro-page').waitFor({ state: 'detached', timeout: 6000 }).catch(() => {})

  const firstProjectLink = page.locator('a.home-work-media[href^="/work/"]').first()
  await expect(firstProjectLink).toBeVisible({ timeout: 10000 })
  const href = await firstProjectLink.getAttribute('href')

  await firstProjectLink.click()
  await page.waitForURL(/\/work\//, { timeout: 10000 })
  await expect(page.locator('.project-detail')).toBeVisible({ timeout: 10000 })

  const clientText = (await page.locator('.project-detail').innerText()).trim()
  const clientHeight = await page.locator('.project-detail').evaluate((node) => node.getBoundingClientRect().height)

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.locator('.project-detail')).toBeVisible({ timeout: 10000 })

  const reloadText = (await page.locator('.project-detail').innerText()).trim()
  const reloadHeight = await page.locator('.project-detail').evaluate((node) => node.getBoundingClientRect().height)

  console.log(JSON.stringify({
    clickedHref: href,
    clientUrl: page.url(),
    clientTextLength: clientText.length,
    clientHeight,
    reloadTextLength: reloadText.length,
    reloadHeight,
    consoleMessages
  }, null, 2))

  expect(clientText.length).toBeGreaterThan(0)
  expect(clientHeight).toBeGreaterThan(20)
  expect(reloadText.length).toBeGreaterThan(0)
  expect(reloadHeight).toBeGreaterThan(20)

  await page.getByRole('button', { name: 'Yana Studios' }).click()
  await page.waitForURL(`${baseUrl}/`, { timeout: 10000 })
  await page.locator('.intro-page').waitFor({ state: 'detached', timeout: 6000 }).catch(() => {})
  await expect(page.locator('a.home-work-media[href^="/work/"]').first()).toBeVisible({ timeout: 10000 })

  await page.locator('a.home-work-media[href^="/work/"]').first().click()
  await page.waitForURL(/\/work\//, { timeout: 10000 })
  await expect(page.locator('.project-detail')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('.project-detail')).not.toHaveText('', { timeout: 10000 })
})
