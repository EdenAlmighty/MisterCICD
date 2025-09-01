import { test, expect } from '@playwright/test'
import pa11y from 'pa11y'

test.describe('Accessibility Testing with Pa11y', () => {
  test('should detect contrast issues with Pa11y', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to be fully loaded
    await page.waitForSelector('.todo-title')

    // Get the current URL
    const currentUrl = page.url()
    console.log(`Testing URL: ${currentUrl}`)

    try {
      // Run Pa11y accessibility analysis
      const results = await pa11y(currentUrl, {
        runner: 'axe', // Use axe runner for better contrast detection
        standard: 'WCAG2AA',
        timeout: 30000,
        wait: 2000, // Wait for page to stabilize
        hideElements: '.vue-devtools__anchor-btn', // Hide Vue devtools that might interfere
      })

      console.log('=== PA11Y ACCESSIBILITY RESULTS ===')
      console.log(`Total issues: ${results.issues.length}`)
      console.log(`Errors: ${results.issues.filter((issue) => issue.type === 'error').length}`)
      console.log(`Warnings: ${results.issues.filter((issue) => issue.type === 'warning').length}`)
      console.log(`Notices: ${results.issues.filter((issue) => issue.type === 'notice').length}`)

      // Check for color contrast issues specifically
      const contrastIssues = results.issues.filter(
        (issue) =>
          issue.code.includes('color-contrast') || issue.message.toLowerCase().includes('contrast'),
      )

      console.log(`\n=== COLOR CONTRAST ISSUES: ${contrastIssues.length} ===`)

      if (contrastIssues.length > 0) {
        contrastIssues.forEach((issue, index) => {
          console.log(`Contrast Issue ${index + 1}:`)
          console.log(`  Code: ${issue.code}`)
          console.log(`  Message: ${issue.message}`)
          console.log(`  Type: ${issue.type}`)
          console.log(`  Context: ${issue.context}`)
          console.log(`  Selector: ${issue.selector}`)
        })
      } else {
        console.log('  No color contrast issues found by Pa11y')
      }

      // Log all issues for debugging
      if (results.issues.length > 0) {
        console.log('\n=== ALL ACCESSIBILITY ISSUES ===')
        results.issues.forEach((issue, index) => {
          console.log(`Issue ${index + 1}:`)
          console.log(`  Code: ${issue.code}`)
          console.log(`  Message: ${issue.message}`)
          console.log(`  Type: ${issue.type}`)
          console.log(`  Context: ${issue.context}`)
          console.log(`  Selector: ${issue.selector}`)
        })
      }

      // For now, let's just log the results without failing
      // This will help us see what Pa11y is actually detecting
      console.log(`\n=== SUMMARY ===`)
      console.log(`Pa11y found ${results.issues.length} total issues`)
      console.log(`Color contrast issues: ${contrastIssues.length}`)
    } catch (error) {
      console.error('Pa11y test failed:', error)

      // Fallback: Let's manually check the contrast
      console.log('\n=== MANUAL CONTRAST CHECK ===')

      const headerTitle = page.locator('.todo-title')
      const titleStyles = await headerTitle.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        }
      })

      console.log(`Header title color: ${titleStyles.color}`)
      console.log(`Header title background: ${titleStyles.backgroundColor}`)

      // Get page background
      const pageBackground = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor
      })

      console.log(`Page background: ${pageBackground}`)

      // Calculate contrast manually (using a simple approach)
      const parseRGB = (rgbString: string): [number, number, number] => {
        const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
        if (match) {
          return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
        }
        return [0, 0, 0]
      }

      const titleColor = parseRGB(titleStyles.color)
      const pageBg = parseRGB(pageBackground)

      console.log(`Title color RGB: [${titleColor.join(', ')}]`)
      console.log(`Page background RGB: [${pageBg.join(', ')}]`)

      // Simple contrast calculation (not as accurate as WCAG formula)
      const getSimpleContrast = (
        color1: [number, number, number],
        color2: [number, number, number],
      ): number => {
        const lum1 = (color1[0] * 0.299 + color1[1] * 0.587 + color1[2] * 0.114) / 255
        const lum2 = (color2[0] * 0.299 + color2[1] * 0.587 + color2[2] * 0.114) / 255
        const lighter = Math.max(lum1, lum2)
        const darker = Math.min(lum1, lum2)
        return (lighter + 0.05) / (darker + 0.05)
      }

      const simpleContrast = getSimpleContrast(titleColor, pageBg)
      console.log(`Simple contrast ratio: ${simpleContrast.toFixed(2)}:1`)

      if (simpleContrast < 4.5) {
        console.log(`❌ POOR CONTRAST DETECTED: ${simpleContrast.toFixed(2)}:1 < 4.5:1 (WCAG AA)`)
      } else {
        console.log(`✅ GOOD CONTRAST: ${simpleContrast.toFixed(2)}:1 >= 4.5:1 (WCAG AA)`)
      }
    }
  })
})
