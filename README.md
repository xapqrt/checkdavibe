# vibeCheck

a browser extension that filters out bad vibes from ur social media feed. it scans posts in real time using nlp and if something is negative/toxic/angry it blurs it out so u dont have to see it unless u want to.



## what it does

- **real time scanning** - watches ur feed as u scroll, picks up new posts automatically using  mutation observer on the dom
- **sentiment analysis** - runs every post thru a scoring engine with weighted word dictionaries, negation handling, all caps detection etc
- **blur overlay** - if a post scores below ur threshold it gets blurred with a warning like "potentially negative content: Anger" and a reveal button if u still wanna see it
- **category toggles** - choose what u wanna block: anger, sadness, toxic. mix and match however u want
- **whitelist** - add usernames or keywords that should never get blocked, even if the content is negative
- **stats dashboard** - see how many posts got filtered and what categories they were in
- **works on twitter/x, reddit, and linkedin** - each platform has its own dom selectors with fallbacks


## setup

1. clone this or download it
2. go to `chrome://extensions`
3. turn on developer mode
4. click load unpacked and select this folder
5. thats it, go to twitter/reddit/linkedin and it should be working

## the popup

click the extension icon to open the settings dashboard where u can:

- enable/disable the whole thing
- adjust sensitivity with the threshold slider (-5 to 0, default -2.0)
- toggle which emotions to block
- add whitelist entries (users or keywords)
- see ur filter stats
- clear stats whenever

## supported sites

| site | selector | backup selector |
|------|----------|-----------------|
| twitter/x | `[data-testid="tweet"]` | - |
| reddit | `shreddit-post` | `div[id^="t3_"]` |
| linkedin | `div.feed-shared-update-v2` | `div[data-id^="urn:li:activity"]` |


## how the scoring works

each word gets looked up in the dictionary. bad words have negative scores (-0.6 to -1.8) and a category (anger/sadness/toxic). good words have positive scores (0.7 to 1.5) and offset the bad ones.

if the previous word is a negation word (not, never, no, hardly, etc) the score gets flipped by -0.5x.

if the whole post is ALL CAPS and has bad words the score gets a 1.5x multiplier.

final score gets compared to ur threshold. if its below and matches a blocked category = blurred.




hope yall like it lol!