# Setting up the "Old Tech, Close to Home" probe

About 15–20 minutes. You need a Google account and these files: `index.html`, `config.example.js` and `Code.gs`.

## 1. Create the backend (Google Sheet + Apps Script)

1. Go to sheets.google.com and create a blank spreadsheet. Name it something like **Old Tech Probe – Responses**.
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the placeholder code in `Code.gs` and paste in the contents of the `Code.gs` file.
4. Click **Save** (the disk icon).
5. In the function dropdown at the top, choose **setup**, then click **Run**.
   - Google will ask for permission. Click through **Review permissions**, choose your account, then **Advanced → Go to (project name) → Allow**. The warning appears because it's your own unverified script; that's expected.
   - This creates a **Responses** tab in your Sheet and a **Old Tech Probe - Photos** folder in your Drive.

## 2. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into your browser. You should see "The probe upload endpoint is running."

"Anyone" means anyone with the URL can send uploads to it, not that anyone can see your Sheet or photos. Those stay private in your Drive.

## 3. Connect the page

1. Make a copy of `config.example.js` next to `index.html` and name it `config.js`.
2. Open `config.js` in a text editor (VS Code, TextEdit in plain-text mode, Notepad) and paste your URL between the quotes:
   ```js
   window.PROBE_SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```
3. Edit the prompts in the `prompts` list in `index.html` if you want to. Each prompt has an `id` and its `text`. The welcome text is in the HTML near the top.

`config.js` is listed in `.gitignore`, so the URL is never committed to the repo. Without `config.js` the page runs in **demo mode**: it works fully but uploads nothing, which is handy for trying it out.

## 4. Put the page online (GitHub Pages)

`config.js` is git-ignored, so it never reaches GitHub. Instead, the workflow in `.github/workflows/pages.yml` builds it from a repository secret each time you push to `main`, then publishes `index.html` and `config.js` (and nothing else).

1. In the repo on GitHub, go to **Settings → Secrets and variables → Actions → New repository secret**.
   - **Name:** `PROBE_SCRIPT_URL`
   - **Secret:** your Web app URL (ends in `/exec`)
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or open the **Actions** tab, choose **Deploy to GitHub Pages**, and click **Run workflow**).
4. When the run finishes, your link is `https://<your-username>.github.io/<repo-name>/`.

If the secret is missing or isn't an Apps Script `/exec` URL, the run fails on purpose instead of publishing a page that uploads nothing.

If you redeploy Apps Script as a **new deployment** (not a new version), the URL changes: update the secret, then re-run the workflow.

GitHub Pages on a free account requires the repo to be public. The secret stays private either way, but the URL is visible to anyone who opens the published page, because the browser needs it to upload.

## 5. Send participant links

Add a code to the end of the link for each participant so you know whose photos are whose without collecting names:

```
https://<your-username>.github.io/<repo-name>/?p=P01
https://<your-username>.github.io/<repo-name>/?p=P02
```

Photos are saved in Drive under a subfolder for each code, and the Sheet logs every caption with a link to its photo.

## 6. Test before sending

1. Open your P00 link on your own phone and go through all the prompts.
2. Check that the photos appear in Drive and the rows in the Sheet.
3. Delete the test rows and photos.

## Troubleshooting

- **"Couldn't save" on every prompt:** make sure the URL ends in `/exec`, and that "Who has access" is **Anyone**.
- **You changed `Code.gs` and nothing happened:** go to **Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy**. The URL stays the same.
- **Starting over on your test phone:** the page remembers progress in the browser, separately for each participant code. Use a new code (for example `?p=P00b`) or open the link in a private window to start fresh.

## For your submission

- **Probe materials:** screenshots of each screen, plus these files.
- **Data collected:** download the Sheet (File → Download → .xlsx or .csv) and the photos folder (right-click → Download).
