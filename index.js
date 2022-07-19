const { chromium } = require('playwright')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const config = require('./config.json')

dayjs.extend(customParseFormat)

const bookTennis = async () => {
  console.log(`${dayjs().format()} - Start process`)
  const browser = await chromium.launch({ headless: true, slowMo: 10, timeout: 120000 })

  console.log(`${dayjs().format()} - Browser started`)
  const page = await browser.newPage()
  await page.goto('https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=tennis&view=start&full=1')

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#button_suivi_inscription'),
  ])
  await popup.waitForLoadState()
  await popup.fill('#username-login', config.account.email)
  await popup.fill('#password-login', config.account.password)
  await popup.click('section >> button')

  console.log(`${dayjs().format()} - User connected`)

  await new Promise(r => setTimeout(r, 500));

  try {

    // Cancel previous booking if any
    await page.goto('https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=profil&view=ma_reservation')
    if (await page.$('#annuler')) {
      await page.click('#annuler');
      await page.click('#confirmer');
      console.log(`${dayjs().format()} - Previous booking canceled`)
    } else {
      console.log(`${dayjs().format()} - No booking to cancel`)
    }

    // Visit search form
    await page.goto('https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&view=recherche_creneau#!')
    await new Promise(r => setTimeout(r, 1000));
    console.log(`${dayjs().format()} - Search page loaded`)

    // Select tennis location
    await page.type('.tokens-input-text', config.location);
    await new Promise(r => setTimeout(r, 5000));
    await page.press('.tokens-input-text', 'ArrowDown');
    await new Promise(r => setTimeout(r, 5000));
    await page.press('.tokens-input-text', 'Enter');
    await new Promise(r => setTimeout(r, 300));
    console.log(`${dayjs().format()} - Location filled`)

    // Select date
    await page.click('#when')
    await new Promise(r => setTimeout(r, 5000));
    const date = dayjs(config.date, 'DD/MM/YYYY')
    await page.click(`[dateiso="${date.format('DD/MM/YYYY')}"]`)
    await new Promise(r => setTimeout(r, 300));
    console.log(`${dayjs().format()} - Date filled`)

    // Search availabilities
    await page.click('#rechercher')
    console.log(`${dayjs().format()} - Searching at ${config.location}`)

    // Show results
    const dateDeb = `[datedeb="${date.format('YYYY/MM/DD')} ${config.hour}:00:00"]`
    await page.click(`#head${config.location.replaceAll(' ', '')}${config.hour}h .panel-title`)

    // Hit booking button
    const bookSlotButton = `[courtid="${config.court_id}"]${dateDeb}`
    await page.click(bookSlotButton)
    await new Promise(r => setTimeout(r, 300));

    // Fill player
    await page.locator(`[name="player1"] >> nth=0`).fill(config.player.lastName);
    await page.locator(`[name="player1"] >> nth=1`).fill(config.player.firstName);
    await page.keyboard.press('Enter');

    // Pick payment option
    await page.click('[paymentmode="existingTicket"]')

    // Submit booking
    await page.click('#submit')
    await new Promise(r => setTimeout(r, 100));

    // Confirm booking
    if (await page.$('.confirmReservation')) {
      console.log(`${dayjs().format()} - Booking confirmed : ${await (
        await (await page.$('.address')).textContent()
      ).trim().replace(/( ){2,}/g, ' ')}`)
      console.log(`pour le ${await (
        await (await page.$('.date')).textContent()
      ).trim().replace(/( ){2,}/g, ' ')}`)
    }
  } catch (e) {
    console.log(e);
    await page.screenshot({ path: 'failure.png' });
  }
  await browser.close()
}

bookTennis()
