import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the HTML file
        # Note: This assumes the script is run from the root of the repository
        html_file_path = os.path.abspath('index.html')

        await page.goto(f'file://{html_file_path}')

        # Wait for the main menu to be visible
        await page.wait_for_selector('#main-menu')

        # Take a screenshot of the main menu
        screenshot_path = 'reset-button.png'
        await page.locator('#main-menu').screenshot(path=screenshot_path)

        print(f"Screenshot saved to {screenshot_path}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())