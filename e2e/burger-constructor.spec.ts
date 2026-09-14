import path from 'node:path';

import { expect, test } from '@playwright/test';

const harPath = path.join(process.cwd(), 'e2e', 'hars', 'burger.har');

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(harPath, {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'Bearer test-access-token');
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');
  });

  test('открывает ингредиент, собирает бургер и оформляет заказ', async ({ page }) => {
    const bunImage = page.getByAltText('Test bun');
    const mainImage = page.getByAltText('Test filling');

    const bunCard = bunImage.locator('..');
    const mainCard = mainImage.locator('..');

    const constructor = page.locator('main > section').nth(1);

    await expect(bunImage).toBeVisible();
    await expect(mainImage).toBeVisible();

    await bunCard.click();

    await expect(page.getByText('Test bun').last()).toBeVisible();
    await expect(page.getByText('420')).toBeVisible();

    const closeButton = page.getByRole('button', {
      name: 'Закрыть',
    });

    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(closeButton).not.toBeVisible();

    await bunCard.dragTo(constructor);

    await expect(constructor.getByText(/Test bun/)).toHaveCount(2);

    await mainCard.dragTo(constructor);

    await expect(constructor.getByText('Test filling')).toBeVisible();

    const orderButton = constructor.getByRole('button', {
      name: 'Оформить заказ',
    });

    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    await expect(page.getByText('12345')).toBeVisible();

    const orderModalCloseButton = page.getByRole('button', {
      name: 'Закрыть',
    });

    await expect(orderModalCloseButton).toBeVisible();
    await orderModalCloseButton.click();

    await expect(page.getByText('12345')).not.toBeVisible();
  });
});
