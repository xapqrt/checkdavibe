Twitter posts to check


1. anger : https://x.com/xapqrt/status/2031799099692028151
2. toxic: https://x.com/xapqrt/status/2031799456899969256




# VibeCheck Testing Guide

## Setup

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked** → select the `checkdavibe` folder
4. You should see VibeCheck with a green checkmark icon
5. If there's an error, click **Errors** to see what went wrong

---

## Step 1: Check the Popup

Click the VibeCheck icon in the toolbar.

**Verify:**
- [ ] Popup opens with dark theme
- [ ] "vibeCheck" title in green
- [ ] Enable toggle is checked
- [ ] Sensitivity slider works and shows value
- [ ] Block Anger = checked
- [ ] Block Sadness = unchecked
- [ ] Block Toxic = checked
- [ ] Whitelist input + add button visible
- [ ] Stats section shows all zeros
- [ ] Save button works (shows "saved!")

---

## Step 2: Test on Twitter/X

Go to `x.com` and post these from your alt account. After each post, scroll your main account's feed to see the post appear.

### Should get BLOCKED (blurred overlay):

**Anger test:**
```
I hate everything about this stupid broken system, so frustrated and furious right now
```

**Toxic test:**
```
you're all disgusting worthless idiots and this whole thing is vile garbage
```

**ALL CAPS multiplier test:**
```
I HATE THIS EVIL DISGUSTING GARBAGE SO MUCH
```

**Mild toxic (just over threshold):**
```
this is terrible and horrible honestly, pretty bad situation all around
```

**Toxic slang test:**
```
stfu you delusional clown, absolute loser behavior ngl
```

### Should NOT get blocked:

**Positive post:**
```
love this so much, amazing work honestly, really proud of what we built here
```

**Neutral post:**
```
just had coffee and now heading to the gym, might grab food after
```

**Mixed sentiment (positive outweighs):**
```
love this amazing wonderful project but there's one bad thing about it
```

**Short post:**
```
hi lol
```

### Negation tests (should NOT block):

```
im not angry at all, everything is actually great right now
```

```
not sad about it, honestly feeling pretty happy and grateful today
```

---

## Step 3: Test on Reddit

Go to any subreddit (r/test works) and make these posts/comments.

**Should block:**
```
Title: worst experience ever
Body: im so frustrated and angry, this is absolutely disgusting and horrible, hate everything about this terrible situation
```

**Should not block:**
```
Title: great day today
Body: feeling really good, had an awesome time at the park, everything was wonderful and peaceful
```

---

## Step 4: Test the Overlay

When a post gets blocked:

- [ ] Post is blurred with dark overlay
- [ ] Warning text shows like "potentially negative content: Anger"
- [ ] "Reveal anyway" button is visible
- [ ] Clicking "Reveal anyway" removes blur and shows the post
- [ ] Post stays revealed after clicking (doesn't re-blur)

---

## Step 5: Test Settings

### Toggle categories:

1. Open popup → uncheck "Block Anger" → Save
2. Scroll to an anger post → should NOT be blocked now
3. Re-enable "Block Anger" → Save
4. The anger post should get re-checked and blocked

### Enable "Block Sadness":

1. Check "Block Sadness" → Save
2. Post from alt:
```
im so sad and miserable, feeling really depressed and hopeless about everything, heartbroken honestly
```
3. Should now get blocked with "Sadness" label

### Adjust Sensitivity:

1. Move slider to **-4.0** (less sensitive) → Save
2. Mild negative posts should stop getting blocked
3. Move slider to **-1.0** (very sensitive) → Save
4. Even slightly negative posts should get caught

### Disable extension:

1. Uncheck "Enable VibeCheck" → Save
2. All posts should appear normal, no scanning
3. Re-enable → posts get scanned again

---

## Step 6: Test Whitelist

1. Open popup → type your alt account username in whitelist input → click +
2. Save settings
3. Post something negative from that alt
4. It should NOT get blocked (whitelisted)
5. Remove the whitelist tag → Save → post should now get blocked

**Keyword whitelist:**
1. Add "review" to whitelist → Save
2. Post from alt:
```
this movie was terrible and horrible and disgusting, worst thing ever made honestly
```
3. Should get blocked
4. Now post:
```
review: this movie was terrible and horrible and disgusting, worst thing ever made
```
5. Should NOT get blocked (contains "review" keyword)

---

## Step 7: Test Stats

1. Open popup → check the stats section
2. After some posts get filtered, the counts should update:
   - Total = number of posts blocked
   - Toxic = toxic posts blocked
   - Anger = anger posts blocked
   - Sadness = sadness posts blocked
3. Click "clear stats" → all should reset to 0

---

## Step 8: SPA Navigation

Twitter/Reddit are single page apps, so test this:

1. Open twitter.com/home
2. Let it scan some posts
3. Click on a tweet → go to the detail view
4. Go back to home feed
5. Check console (F12 → Console) for "url changed, rescanning feed"
6. Posts should still get scanned after navigation

---

## Step 9: Check Console Logs

Open DevTools (F12) → Console tab. You should see:

```
vibecheck script loaded  x.com
platform: twitter
posts found, starting da scanner
observer active
scanned X posts in Xms (total scans: 1)
```

If scrolling:
```
mutation, on scanenr
scanned X posts in Xms (total scans: 2)
```

If a post gets whitelisted:
```
post whitelisted, skipping
```

---

## Quick Copy-Paste Test Tweets

### Block these (post from alt, one at a time):

1. `hate this so much, disgusting and vile, worst day ever honestly`
2. `you're all worthless idiots and this garbage is evil and terrible`
3. `so sad and depressed and miserable, everything is hopeless` (only if sadness blocking is on)
4. `im SO FRUSTRATED AND ANGRY AND MAD RIGHT NOW`
5. `stfu braindead toxic loser clown`

### Don't block these:

6. `absolutely love this, amazing wonderful beautiful day honestly`
7. `heading to work, got a meeting at 2pm`
8. `not angry at all, actually feeling really grateful and blessed`
9. `lol`
10. `this is fire honestly, goated legendary stuff, wholesome vibes`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Popup doesn't open | Check chrome://extensions for errors, reload extension |
| No posts getting scanned | Check console for "platform: null" - wrong site |
| Posts not blurring | Check if enabled is on, categories are checked, threshold isn't too low |
| Overlay looks weird | Check if styles/content.css loaded (console won't show errors for CSS) |
| Stats not updating | Open popup, check if numbers change after scrolling past blocked posts |
| Settings not saving | Check console in popup (right-click extension icon → Inspect popup) |
| Nothing happens after save | The storage listener should trigger a rescan automatically |
