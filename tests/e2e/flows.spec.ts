import { test, expect } from "@playwright/test";

const USER = process.env.E2E_USER || "e2eadmin";
const PASS = process.env.E2E_PASSWORD || "e2e-test-password-ok";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Gebruikersnaam").fill(USER);
  await page.getByLabel("Wachtwoord").fill(PASS);
  await page.getByRole("button", { name: "Inloggen" }).click();
  await expect(page).toHaveURL(/\/projects/);
}

test.describe("Flow A — project en quickscan", () => {
  test("nieuw project → Nee-fout → actie → herladen", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: "Nieuw project" }).click();
    await page.getByLabel("Project", { exact: true }).fill("E2E Testproject");
    await page.getByLabel("Verantwoordelijke scan").fill("E2E Scanner");
    await page.getByLabel("Projectnummer").fill("00099");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page).toHaveURL(/\/projects\/.+\/start/);
    await expect(page.getByLabel("Projectnummer")).toHaveValue("00099");

    await page.getByRole("link", { name: "Quickscan" }).click();
    // Eerste vraag op Nee zonder actie
    await page.locator("#Q01-status").selectOption("NO");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText(/vervolgactie verplicht/i)).toBeVisible();

    await page.locator("#Q01-followUpAction").fill("Concrete vervolgactie voor E2E");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();

    await page.reload();
    await expect(page.locator("#Q01-status")).toHaveValue("NO");
    await expect(page.locator("#Q01-followUpAction")).toHaveValue(
      "Concrete vervolgactie voor E2E",
    );
  });
});

test.describe("Flow B/C — beoordeling en chemisch", () => {
  test("nog beoordelen → retour geweigerd → bevestigd → overname", async ({
    page,
  }) => {
    await login(page);
    await page.getByRole("link", { name: "Nieuw project" }).click();
    await page.getByLabel("Project", { exact: true }).fill("E2E Stromen");
    await page.getByLabel("Verantwoordelijke scan").fill("E2E");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await page.getByRole("link", { name: "Materiaalstromen" }).click();

    await page.locator("#M11-occurs").selectOption("YES");
    await page.locator("#M11-nextRoute").selectOption("NEEDS_ASSESSMENT");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();
    await page.getByRole("link", { name: /Open beoordeling voor deze stroom/i }).click();

    await page.getByRole("button", { name: "Nieuwe beoordeling" }).click();
    await page.getByLabel("Materiaal / soort").fill("Retourpallet E2E");
    // prelinked stream from query; ensure select has value
    await page.locator("#returnConfirmed").selectOption("CHECK");
    await page.locator("#finalRoute").selectOption("RETURN");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(
      page.getByText(/Retour \/ terugname mag alleen/i),
    ).toBeVisible();

    await page.locator("#returnConfirmed").selectOption("YES");
    await page.locator("#finalRoute").selectOption("RETURN");
    await expect(
      page.getByText(/ook overnemen in Materiaalstromen/i),
    ).toBeVisible();
    await page.getByText(/ook overnemen in Materiaalstromen/i).click();
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();

    await page.getByRole("link", { name: "Materiaalstromen" }).click();
    await expect(page).toHaveURL(/\/streams/);
    await expect(page.locator("#M11-nextRoute")).toHaveValue("RETURN");

    // Chemisch
    await page.locator("#M12-occurs").selectOption("YES");
    await page.locator("#M12-nextRoute").selectOption("SPECIFIC");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();
  });
});

test.describe("Flow D/E — evaluatie en validatie", () => {
  test("evaluatie en onderzoeksvalidatie zonder totaalscore", async ({
    page,
  }) => {
    await login(page);
    await page.getByRole("link", { name: "Nieuw project" }).click();
    await page.getByLabel("Project", { exact: true }).fill("E2E Eval");
    await page.getByLabel("Verantwoordelijke scan").fill("E2E");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await page.getByRole("link", { name: "Evaluatie" }).click();
    await page.locator("#E02-actualQuantity").fill("2");
    await page.locator("#E02-unit").selectOption("TON");
    await page.locator("#attentionStream").fill("Hout vroeg aandacht");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();
    await page.reload();
    await expect(page.locator("#E02-actualQuantity")).toHaveValue("2");

    await page.goto("/validation");
    await expect(
      page.getByText(/geen totaal, gemiddelde of eindcijfer/i),
    ).toBeVisible();
    await expect(page.getByText(/eindcijfer|totaalscore|gemiddelde score/i)).toHaveCount(1);
    await page.getByLabel("Getest door").fill("E2E reviewer");
    await page.locator("#clarityScore").selectOption("4");
    await page.locator("#practicalityScore").selectOption("3");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await expect(page.getByText("Opgeslagen")).toBeVisible();
  });
});

test.describe("toegankelijkheid mobiel", () => {
  test("375px navigatie en labels", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page);
    await page.getByRole("link", { name: "Nieuw project" }).click();
    await expect(page.getByLabel("Project", { exact: true })).toBeVisible();
    await page.getByLabel("Project", { exact: true }).fill("Mobiel");
    await page.getByLabel("Verantwoordelijke scan").fill("M");
    await page.getByRole("button", { name: "Opslaan" }).click();
    await page.getByRole("link", { name: "Scan" }).click();
    await expect(page.getByRole("heading", { name: /Projectquickscan/i })).toBeVisible();
  });
});
