// --------------------------------------------------------------------
const useChrome = typeof (browser) === 'undefined';

// --------------------------------------------------------------------
let foundLinks = [];
let hasLinks = false;
let textLinks = [];
let hasTextLinks = false;
let selectedText = '';
let showOverlay = true;
let hasSpecialKey = false;
const localData = {
  tc__translateButton: true,
  tc__openLinkButton: true,
  tc__wiktionaryButton: true,
  tc__geizhalsButton: true,
  tc__googleSelectionButton: true,
  tc__openTextLinkButton: true,
  tc__translateLanguage: 'en',
  tc__useOverlay: true,
  tc__overlayKey: false,
  tc__translateMenu: true,
  tc__openLinkMenu: true,
  tc__openTextLinkMenu: true,
  tc__wiktionaryMenu: true,
  tc__geizhalsMenu: true,
  tc__googleSelectionMenu: true,
  tc__translateOrder: 0,
  tc__openLinkOrder: 1,
  tc__openTextLinkOrder: 2,
  tc__wiktionaryOrder: 3,
  tc__geizhalsOrder: 4,
  tc__googleSelectionOrder: 5
};

const tldData = { 3: ['aaa', 'abb', 'abc', 'aco', 'ads', 'aeg', 'afl', 'aig', 'anz', 'aol', 'app', 'art', 'aws', 'axa', 'bar', 'bbc', 'bbt', 'bcg', 'bcn', 'bet', 'bid', 'bio', 'biz', 'bms', 'bmw', 'bom', 'boo', 'bot', 'box', 'buy', 'bzh', 'cab', 'cal', 'cam', 'car', 'cat', 'cba', 'cbn', 'cbs', 'ceo', 'cfa', 'cfd', 'com', 'cpa', 'crs', 'dad', 'day', 'dds', 'dev', 'dhl', 'diy', 'dnp', 'dog', 'dot', 'dtv', 'dvr', 'eat', 'eco', 'edu', 'esq', 'eus', 'fan', 'fit', 'fly', 'foo', 'fox', 'frl', 'ftr', 'fun', 'fyi', 'gal', 'gap', 'gay', 'gdn', 'gea', 'gle', 'gmo', 'gmx', 'goo', 'gop', 'got', 'gov', 'hbo', 'hiv', 'hkt', 'hot', 'how', 'ibm', 'ice', 'icu', 'ifm', 'inc', 'ing', 'ink', 'int', 'ist', 'itv', 'jcb', 'jio', 'jll', 'jmp', 'jnj', 'jot', 'joy', 'kfh', 'kia', 'kim', 'kpn', 'krd', 'lat', 'law', 'lds', 'llc', 'llp', 'lol', 'lpl', 'ltd', 'man', 'map', 'mba', 'med', 'men', 'mil', 'mit', 'mlb', 'mls', 'mma', 'moe', 'moi', 'mom', 'mov', 'msd', 'mtn', 'mtr', 'nab', 'nba', 'nec', 'net', 'new', 'nfl', 'ngo', 'nhk', 'now', 'nra', 'nrw', 'ntt', 'nyc', 'obi', 'one', 'ong', 'onl', 'ooo', 'org', 'ott', 'ovh', 'pay', 'pet', 'phd', 'pid', 'pin', 'pnc', 'pro', 'pru', 'pub', 'pwc', 'red', 'ren', 'ril', 'rio', 'rip', 'run', 'rwe', 'sap', 'sas', 'sbi', 'sbs', 'sca', 'scb', 'sew', 'sex', 'sfr', 'ski', 'sky', 'soy', 'spa', 'srl', 'stc', 'tab', 'tax', 'tci', 'tdk', 'tel', 'thd', 'tjx', 'top', 'trv', 'tui', 'tvs', 'ubs', 'uno', 'uol', 'ups', 'vet', 'vig', 'vin', 'vip', 'wed', 'win', 'wme', 'wow', 'wtc', 'wtf', 'xin', 'xxx', 'xyz', 'you', 'yun', 'zip'], 4: ['aarp', 'able', 'aero', 'akdn', 'ally', 'amex', 'arab', 'army', 'arpa', 'arte', 'asda', 'asia', 'audi', 'auto', 'baby', 'band', 'bank', 'bbva', 'beer', 'best', 'bike', 'bing', 'blog', 'blue', 'bofa', 'bond', 'book', 'buzz', 'cafe', 'call', 'camp', 'care', 'cars', 'casa', 'case', 'cash', 'cbre', 'cern', 'chat', 'citi', 'city', 'club', 'cool', 'coop', 'cyou', 'data', 'date', 'dclk', 'deal', 'dell', 'desi', 'diet', 'dish', 'docs', 'dvag', 'erni', 'fage', 'fail', 'fans', 'farm', 'fast', 'fiat', 'fido', 'film', 'fire', 'fish', 'flir', 'food', 'ford', 'free', 'fund', 'game', 'gbiz', 'gent', 'ggee', 'gift', 'gmbh', 'gold', 'golf', 'goog', 'guge', 'guru', 'hair', 'haus', 'hdfc', 'help', 'here', 'hgtv', 'host', 'hsbc', 'icbc', 'ieee', 'imdb', 'immo', 'info', 'itau', 'java', 'jeep', 'jobs', 'jprs', 'kddi', 'kids', 'kiwi', 'kpmg', 'kred', 'land', 'lego', 'lgbt', 'lidl', 'life', 'like', 'limo', 'link', 'live', 'loan', 'love', 'ltda', 'luxe', 'maif', 'meet', 'meme', 'menu', 'mini', 'mint', 'mobi', 'moda', 'moto', 'name', 'navy', 'news', 'next', 'nico', 'nike', 'ollo', 'open', 'page', 'pars', 'pccw', 'pics', 'ping', 'pink', 'play', 'plus', 'pohl', 'porn', 'post', 'prod', 'prof', 'qpon', 'read', 'reit', 'rent', 'rest', 'rich', 'room', 'rsvp', 'ruhr', 'safe', 'sale', 'sarl', 'save', 'saxo', 'scot', 'seat', 'seek', 'sexy', 'shaw', 'shia', 'shop', 'show', 'silk', 'sina', 'site', 'skin', 'sncf', 'sohu', 'song', 'sony', 'spot', 'star', 'surf', 'talk', 'taxi', 'team', 'tech', 'teva', 'tiaa', 'tips', 'town', 'toys', 'tube', 'vana', 'visa', 'viva', 'vivo', 'vote', 'voto', 'wang', 'weir', 'wien', 'wiki', 'wine', 'work', 'xbox', 'yoga', 'zara', 'zero', 'zone'], 6: ['abarth', 'abbott', 'abbvie', 'africa', 'agency', 'airbus', 'airtel', 'alipay', 'alsace', 'alstom', 'amazon', 'anquan', 'aramco', 'author', 'bayern', 'beauty', 'berlin', 'bharti', 'bostik', 'boston', 'broker', 'camera', 'career', 'casino', 'center', 'chanel', 'chrome', 'church', 'circle', 'claims', 'clinic', 'coffee', 'comsec', 'condos', 'coupon', 'credit', 'cruise', 'dating', 'datsun', 'dealer', 'degree', 'dental', 'design', 'direct', 'doctor', 'dunlop', 'dupont', 'durban', 'emerck', 'energy', 'estate', 'events', 'expert', 'family', 'flickr', 'futbol', 'gallup', 'garden', 'george', 'giving', 'global', 'google', 'gratis', 'health', 'hermes', 'hiphop', 'hockey', 'hotels', 'hughes', 'imamat', 'insure', 'intuit', 'jaguar', 'joburg', 'juegos', 'kaufen', 'kinder', 'kindle', 'kosher', 'lancia', 'latino', 'lawyer', 'lefrak', 'living', 'locker', 'london', 'luxury', 'madrid', 'maison', 'makeup', 'market', 'mattel', 'mobile', 'monash', 'mormon', 'moscow', 'museum', 'mutual', 'nagoya', 'natura', 'nissan', 'nissay', 'norton', 'nowruz', 'office', 'olayan', 'online', 'oracle', 'orange', 'otsuka', 'pfizer', 'photos', 'physio', 'pictet', 'quebec', 'racing', 'realty', 'reisen', 'repair', 'report', 'review', 'rocher', 'rogers', 'ryukyu', 'safety', 'sakura', 'sanofi', 'school', 'schule', 'search', 'secure', 'select', 'shouji', 'soccer', 'social', 'stream', 'studio', 'supply', 'suzuki', 'swatch', 'sydney', 'taipei', 'taobao', 'target', 'tattoo', 'tennis', 'tienda', 'tjmaxx', 'tkmaxx', 'toyota', 'travel', 'unicom', 'viajes', 'viking', 'villas', 'virgin', 'vision', 'voting', 'voyage', 'vuelos', 'walter', 'webcam', 'xihuan', 'yachts', 'yandex', 'zappos'], 7: ['abogado', 'academy', 'agakhan', 'alibaba', 'android', 'athleta', 'auction', 'audible', 'auspost', 'avianca', 'banamex', 'bauhaus', 'bentley', 'bestbuy', 'booking', 'brother', 'capital', 'caravan', 'careers', 'channel', 'charity', 'chintai', 'citadel', 'clubmed', 'college', 'cologne', 'comcast', 'company', 'compare', 'contact', 'cooking', 'corsica', 'country', 'coupons', 'courses', 'cricket', 'cruises', 'dentist', 'digital', 'domains', 'exposed', 'express', 'farmers', 'fashion', 'ferrari', 'ferrero', 'finance', 'fishing', 'fitness', 'flights', 'florist', 'flowers', 'forsale', 'frogans', 'fujitsu', 'gallery', 'genting', 'godaddy', 'grocery', 'guitars', 'hamburg', 'hangout', 'hitachi', 'holiday', 'hosting', 'hoteles', 'hotmail', 'hyundai', 'ismaili', 'jewelry', 'juniper', 'kitchen', 'komatsu', 'lacaixa', 'lanxess', 'lasalle', 'latrobe', 'leclerc', 'limited', 'lincoln', 'markets', 'monster', 'netbank', 'netflix', 'network', 'neustar', 'okinawa', 'oldnavy', 'organic', 'origins', 'philips', 'pioneer', 'politie', 'realtor', 'recipes', 'rentals', 'reviews', 'rexroth', 'samsung', 'sandvik', 'schmidt', 'schwarz', 'science', 'shiksha', 'singles', 'staples', 'storage', 'support', 'surgery', 'systems', 'temasek', 'theater', 'theatre', 'tickets', 'tiffany', 'toshiba', 'trading', 'walmart', 'wanggou', 'watches', 'weather', 'website', 'wedding', 'whoswho', 'windows', 'winners', 'xfinity', 'yamaxun', 'youtube', 'zuerich'], 8: ['abudhabi', 'airforce', 'allstate', 'attorney', 'barclays', 'barefoot', 'bargains', 'baseball', 'boutique', 'bradesco', 'broadway', 'brussels', 'builders', 'business', 'capetown', 'catering', 'catholic', 'cipriani', 'cityeats', 'cleaning', 'clinique', 'clothing', 'commbank', 'computer', 'delivery', 'deloitte', 'democrat', 'diamonds', 'discount', 'discover', 'download', 'engineer', 'ericsson', 'etisalat', 'exchange', 'feedback', 'fidelity', 'firmdale', 'football', 'frontier', 'goodyear', 'grainger', 'graphics', 'guardian', 'hdfcbank', 'helsinki', 'holdings', 'hospital', 'infiniti', 'ipiranga', 'istanbul', 'jpmorgan', 'lighting', 'lundbeck', 'marriott', 'maserati', 'mckinsey', 'memorial', 'merckmsd', 'mortgage', 'observer', 'partners', 'pharmacy', 'pictures', 'plumbing', 'property', 'redstone', 'reliance', 'saarland', 'samsclub', 'security', 'services', 'shopping', 'showtime', 'softbank', 'software', 'stcgroup', 'supplies', 'training', 'vanguard', 'ventures', 'verisign', 'woodside', 'yokohama'], 2: ['ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'], 9: ['accenture', 'alfaromeo', 'allfinanz', 'amsterdam', 'analytics', 'aquarelle', 'barcelona', 'bloomberg', 'christmas', 'community', 'directory', 'education', 'equipment', 'fairwinds', 'financial', 'firestone', 'fresenius', 'frontdoor', 'furniture', 'goldpoint', 'hisamitsu', 'homedepot', 'homegoods', 'homesense', 'institute', 'insurance', 'kuokgroup', 'lancaster', 'landrover', 'lifestyle', 'marketing', 'marshalls', 'melbourne', 'microsoft', 'panasonic', 'passagens', 'pramerica', 'richardli', 'shangrila', 'solutions', 'statebank', 'statefarm', 'stockholm', 'travelers', 'vacations', 'yodobashi'], 10: ['accountant', 'apartments', 'associates', 'basketball', 'bnpparibas', 'boehringer', 'capitalone', 'consulting', 'creditcard', 'cuisinella', 'eurovision', 'extraspace', 'foundation', 'healthcare', 'immobilien', 'industries', 'management', 'mitsubishi', 'nextdirect', 'properties', 'protection', 'prudential', 'realestate', 'republican', 'restaurant', 'schaeffler', 'tatamotors', 'technology', 'university', 'vlaanderen', 'volkswagen'], 11: ['accountants', 'barclaycard', 'blackfriday', 'blockbuster', 'bridgestone', 'calvinklein', 'contractors', 'creditunion', 'engineering', 'enterprises', 'foodnetwork', 'investments', 'kerryhotels', 'lamborghini', 'motorcycles', 'olayangroup', 'photography', 'playstation', 'productions', 'progressive', 'redumbrella', 'williamhill'], 5: ['actor', 'adult', 'aetna', 'amfam', 'amica', 'apple', 'archi', 'audio', 'autos', 'azure', 'baidu', 'beats', 'bible', 'bingo', 'black', 'boats', 'bosch', 'build', 'canon', 'cards', 'chase', 'cheap', 'cisco', 'citic', 'click', 'cloud', 'coach', 'codes', 'crown', 'cymru', 'dabur', 'dance', 'deals', 'delta', 'drive', 'dubai', 'earth', 'edeka', 'email', 'epson', 'faith', 'fedex', 'final', 'forex', 'forum', 'gallo', 'games', 'gifts', 'gives', 'glass', 'globo', 'gmail', 'green', 'gripe', 'group', 'gucci', 'guide', 'homes', 'honda', 'horse', 'house', 'hyatt', 'ikano', 'irish', 'jetzt', 'koeln', 'kyoto', 'lamer', 'lease', 'legal', 'lexus', 'lilly', 'linde', 'lipsy', 'loans', 'locus', 'lotte', 'lotto', 'macys', 'mango', 'media', 'miami', 'money', 'movie', 'music', 'nexus', 'nikon', 'ninja', 'nokia', 'nowtv', 'omega', 'osaka', 'paris', 'parts', 'party', 'phone', 'photo', 'pizza', 'place', 'poker', 'praxi', 'press', 'prime', 'promo', 'quest', 'radio', 'rehab', 'reise', 'ricoh', 'rocks', 'rodeo', 'rugby', 'salon', 'sener', 'seven', 'sharp', 'shell', 'shoes', 'skype', 'sling', 'smart', 'smile', 'solar', 'space', 'sport', 'stada', 'store', 'study', 'style', 'sucks', 'swiss', 'tatar', 'tires', 'tirol', 'tmall', 'today', 'tokyo', 'tools', 'toray', 'total', 'tours', 'trade', 'trust', 'tunes', 'tushu', 'ubank', 'vegas', 'video', 'vodka', 'volvo', 'wales', 'watch', 'weber', 'weibo', 'works', 'world', 'xerox', 'yahoo'], 15: ['americanexpress', 'kerryproperties', 'sandvikcoromant'], 14: ['americanfamily', 'bananarepublic', 'cookingchannel', 'kerrylogistics', 'weatherchannel'], 12: ['construction', 'lplfinancial', 'scholarships', 'versicherung'], 13: ['international', 'lifeinsurance', 'travelchannel', 'wolterskluwer'], 18: ['northwesternmutual', 'travelersinsurance'] };

// --------------------------------------------------------------------
function findLinks (selection) {
  let html = '';
  const parents = [];

  for (let x = 0; x < selection.rangeCount; ++x) {
    const range = selection.getRangeAt(x);
    const commonAncestor = range.commonAncestorContainer;

    let srcParent = commonAncestor;
    if (srcParent.nodeName === '#text') {
      while (selection.containsNode(srcParent, false) || srcParent.nodeName === 'SPAN') {
        srcParent = srcParent.parentNode;
      }
    }

    html += srcParent.outerHTML;
    parents.push(srcParent.parentNode);
  }

  hasTextLinks = false;
  textLinks = [];

  const rawTextLinks = selection.toString().split(/\s/g);
  if (rawTextLinks !== null) {
    for (const link of rawTextLinks) {
      const linkFinder = link.match(/(http|https|ftp):\/\/.[^\s]+/gi);
      if (linkFinder !== null) {
        hasTextLinks = true;
        textLinks.push(linkFinder[0]);
      }
    }

    if (hasTextLinks) {
      console.log('Found schema textlinks:');
      for (const matchedLink of textLinks) {
        console.log('Detected --> ' + matchedLink);
      }
    }
  }

  const nonCodedLinks = selection.toString().match(/[^\s\"\'\[\]\(\)\,]+\.[^\s\"\'\[\]\(\)\,\:\.]+/gi);
  if (nonCodedLinks !== null) {
    let hasDispay = false;
    for (const matchedURI of nonCodedLinks) {
      const testURI = matchedURI.trim().toLowerCase();
      if (testURI.startsWith('http:') || testURI.startsWith('https:') || testURI.startsWith('ftp:') || testURI.startsWith('mailto:') || testURI.indexOf('@') !== -1) {
        continue;
      }

      const domainSplit = matchedURI.split('/', 2)[0].split('.');
      const domainTLD = domainSplit[domainSplit.length - 1].trim().toLowerCase();
      if (domainTLD !== '') {
        if (tldData[domainTLD.length] !== undefined && tldData[domainTLD.length].indexOf(domainTLD) !== -1) {
          hasTextLinks = true;
          if (!hasDispay) {
            console.log('Found raw non-coded textlinks:');
            hasDispay = true;
          }
          const textURI = 'https://' + matchedURI.trim();
          textLinks.push(textURI);
          console.log('Detected --> ' + textURI);
        }
      }
    }
  }

  if (hasTextLinks) {
    console.log('Found ' + textLinks.length + ' textlinks in selection');
  }

  let links = html.match(/href=["'][^"']*/gi);
  if (links !== null) {
    const tmpLinks = [];
    for (let x = 0; x < links.length; ++x) {
      links[x] = links[x].substring(6);
      if (tmpLinks.indexOf(links[x]) === -1) {
        tmpLinks.push(links[x]);
      }
    }

    links = tmpLinks;

    let linksInSelection = 0;
    foundLinks = [];

    const domainMatch = window.location.href.match(/http[s]{0,1}:\/\/[^/]*/gi);

    let baseDomain = '';
    if (domainMatch !== null) {
      baseDomain = domainMatch[0];
    } else {
      console.log('TextCompanion base domain could not be detected.');
      return;
    }

    for (const parent of parents) {
      for (const link of links) {
        const foundLink = parent.querySelector('a[href="' + link + '"]');
        if (foundLink !== null && selection.containsNode(foundLink, true)) {
          const linkUrl = foundLink.href;
          if (linkUrl.startsWith('/') || linkUrl.startsWith('#')) {
            foundLinks.push(baseDomain + linkUrl);
          } else {
            foundLinks.push(linkUrl);
          }

          hasLinks = true;

          ++linksInSelection;
        }
      }
    }

    if (hasLinks) {
      console.log('Detected links:', linksInSelection);
    }
  }

  if (useChrome) {
    chrome.runtime.sendMessage({ status: { hasLinks, hasTextLinks } }, function () {
      console.log(chrome.runtime.lastError);
    });
  } else {
    browser.runtime.sendMessage({ status: { hasLinks, hasTextLinks } });
  }
}

// --------------------------------------------------------------------
function openTextLinkTabsInBackground (evt) {
  evt.preventDefault();
  if (window.confirm('This will open ' + textLinks.length + ' ' + (textLinks.length === 1 ? 'tab' : 'tabs') + ', proceed?')) {
    if (useChrome) {
      chrome.runtime.sendMessage({ links: textLinks });
    } else {
      browser.runtime.sendMessage({ links: textLinks });
    }
  }
}

// --------------------------------------------------------------------
function openTabsInBackground (evt) {
  evt.preventDefault();
  if (window.confirm('This will open ' + foundLinks.length + ' ' + (foundLinks.length === 1 ? 'tab' : 'tabs') + ', proceed?')) {
    if (useChrome) {
      chrome.runtime.sendMessage({ links: foundLinks });
    } else {
      browser.runtime.sendMessage({ links: foundLinks });
    }
  }
}

// --------------------------------------------------------------------
function googleSelection (evt) {
  evt.preventDefault();

  const lineDelimeter = '';
  const searchWords = encodeURIComponent(selectedText.replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim());

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://www.google.com/search?q=' + searchWords] });
  } else {
    browser.runtime.sendMessage({ links: ['https://www.google.com/search?q=' + searchWords] });
  }
}

// --------------------------------------------------------------------
function geizhalsSelection (evt) {
  evt.preventDefault();

  const lineDelimeter = '';
  const articleName = encodeURIComponent(selectedText.replace(/[\n\r]{1,}/g, lineDelimeter).replace(/[\t]{1,}/g, '').trim());

  if (articleName.length > 256) {
    window.alert('The article name is more than 256 characters, not looking up in Geizhals.eu');
    return;
  }

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://geizhals.eu/?fs=' + articleName] });
  } else {
    browser.runtime.sendMessage({ links: ['https://geizhals.eu/?fs=' + articleName] });
  }
}

// --------------------------------------------------------------------
function wiktionarySelection (evt) {
  evt.preventDefault();
  const lineDelimeter = '';
  const wikitext = encodeURIComponent(selectedText.replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim());

  if (wikitext.length > 128) {
    window.alert('The selected text is ' + wikitext.length + ' characters long and will not be looked up in Wiktionary on purpose.');
    return;
  }

  const srcLang = document.documentElement.lang !== '' ? document.documentElement.lang.split('_', 2)[0].split('-', 2)[0] : '';

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://' + (srcLang === '' ? localData.tc__translateLanguage : srcLang) + '.wiktionary.org/wiki/' + wikitext] });
  } else {
    browser.runtime.sendMessage({ links: ['https://' + (srcLang === '' ? localData.tc__translateLanguage : srcLang) + '.wiktionary.org/wiki/' + wikitext] });
  }
}

// --------------------------------------------------------------------
function translateSelection (evt) {
  evt.preventDefault();
  const lineDelimeter = '%0A%0A';
  const translationText = selectedText.replace(/%/g, '%25').replace(/\//g, '\\%2F').replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim();

  if (translationText.length > 5000) {
    window.alert('The selected text is ' + translationText.length + ' characters long and cannot be translated using the DeepL web interface.');
    return;
  }

  const srcLang = document.documentElement.lang !== '' ? document.documentElement.lang.split('_', 2)[0].split('-', 2)[0] : '';
  if (useChrome) {
    chrome.runtime.sendMessage({
      links: ['https://www.deepl.com/translator#' + (srcLang === '' ? 'en' : srcLang) + '/' + localData.tc__translateLanguage + '/' + translationText]
    });
  } else {
    browser.runtime.sendMessage({
      links: ['https://www.deepl.com/translator#' + (srcLang === '' ? 'en' : srcLang) + '/' + localData.tc__translateLanguage + '/' + translationText]
    });
  }
}

// --------------------------------------------------------------------
function updateMouseData (evt) {
  if (!showOverlay) {
    return;
  }

  const existingOverlayDiv = document.getElementById('textCompanionOverlay');
  if (existingOverlayDiv !== null) {
    const selection = window.getSelection();
    if (selection.type !== null) {
      if (!existingOverlayDiv.classList.contains('disabled')) {
        if (evt.target.parentNode === existingOverlayDiv || evt.target === existingOverlayDiv) {
          return;
        }
      }

      if (selection.type !== 'Range') {
        existingOverlayDiv.classList.add('disabled');
        return;
      } else if (!existingOverlayDiv.classList.contains('disabled')) {
        return;
      }

      let x = evt.pageX + 18 - (existingOverlayDiv.clientWidth * 0.25);
      let y = evt.pageY;

      if (x < existingOverlayDiv.clientWidth * 1.125) {
        x += existingOverlayDiv.clientWidth * 0.5;
      }

      if (y < existingOverlayDiv.clientHeight * 2) {
        y += existingOverlayDiv.clientHeight * 1.25;
      }

      if (x + (existingOverlayDiv.clientWidth * 1.5) >= document.body.clientWidth) {
        x = document.body.clientWidth - (existingOverlayDiv.clientWidth * 1.125);
      }

      existingOverlayDiv.style.left = 'calc(' + x + 'px)';
      existingOverlayDiv.style.top = 'calc(' + y + 'px - ' + existingOverlayDiv.clientHeight + 'px - 1.75em)';
      existingOverlayDiv.classList.remove('disabled');
      return;
    }

    existingOverlayDiv.classList.add('disabled');
  }
}

// --------------------------------------------------------------------
function hasInConfigAndIsTrue (key) {
  if (localData[key] === undefined || localData[key] === true) {
    return true;
  }

  return false;
}

// --------------------------------------------------------------------
function selectionChangeEvent (evt) {
  const selection = window.getSelection();
  const existingOverlayDiv = document.getElementById('textCompanionOverlay');
  if (existingOverlayDiv !== null) {
    existingOverlayDiv.classList.add('disabled');
  }

  if (selection.type !== 'Range') {
    return;
  }

  hasLinks = false;
  hasTextLinks = false;

  findLinks(selection);
  if (!hasLinks && !hasTextLinks) {
    console.log('TextCompanion: No links found.');
  }

  selectedText = selection.toString();

  if (useChrome) {
    chrome.storage.local.get().then(loadValues, onLoadError);
  } else {
    browser.storage.local.get().then(loadValues, onLoadError);
  }
}

// --------------------------------------------------------------------
function loadValues (data) {
  for (const key of Object.keys(data)) {
    if (localData[key] !== undefined) {
      localData[key] = data[key];
    }
  }

  updateUI();
  recreateUI();

  if (useChrome) {
    chrome.runtime.sendMessage({ reCreateMenu: true });
  } else {
    browser.runtime.sendMessage({ reCreateMenu: true });
  }

  if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('extension') !== -1) {
    return;
  }

  const selection = window.getSelection();
  if (selection.type !== 'Range') {
    return;
  }

  selectedText = selection.toString();
  recreateUI();
}

// --------------------------------------------------------------------
function recreateUI () {
  if (!hasInConfigAndIsTrue('tc__useOverlay')) {
    const existingOverlay = document.getElementById('textCompanionOverlay');

    if (existingOverlay !== null) {
      existingOverlay.parentNode.removeChild(existingOverlay);
    }

    return true;
  }

  const existingOverlay = document.getElementById('textCompanionOverlay');
  const overlayDiv = document.createElement('div');

  if (existingOverlay !== null) {
    overlayDiv.style.left = existingOverlay.style.left;
    overlayDiv.style.top = existingOverlay.style.top;
    existingOverlay.parentNode.removeChild(existingOverlay);
  }

  overlayDiv.id = 'textCompanionOverlay';
  overlayDiv.classList.add('disabled');

  let hasElement = false;
  showOverlay = true;
  if (hasInConfigAndIsTrue('tc__overlayKey')) {
    if (!hasSpecialKey) {
      showOverlay = false;
    }

    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Control') {
        hasSpecialKey = true;
        showOverlay = true;
      }
    });

    document.addEventListener('keyup', function (evt) {
      if (evt.key === 'Control') {
        hasSpecialKey = false;
        showOverlay = false;
      }
    });
  }

  if (hasInConfigAndIsTrue('tc__translateButton')) {
    const translateButton = document.createElement('button');
    translateButton.href = '#';
    translateButton.id = 'tc__translateButton';
    translateButton.title = 'Translate selection using DeepL.com';
    translateButton.appendChild(document.createTextNode(translateButton.title));
    translateButton.addEventListener('click', translateSelection);
    overlayDiv.appendChild(translateButton);
    hasElement = true;
    translateButton.style.order = localData.tc__translateOrder;
  }

  if (hasInConfigAndIsTrue('tc__openLinkButton')) {
    const openLinkButton = document.createElement('button');
    openLinkButton.href = '#';
    openLinkButton.id = 'tc__openLinkButton';
    openLinkButton.title = 'Open links in background';
    openLinkButton.appendChild(document.createTextNode(openLinkButton.title));

    if (hasLinks) {
      openLinkButton.addEventListener('click', openTabsInBackground);
    } else {
      openLinkButton.setAttribute('disabled', 'disabled');
    }

    overlayDiv.appendChild(openLinkButton);
    hasElement = true;
    openLinkButton.style.order = localData.tc__openLinkOrder;
  }

  if (hasInConfigAndIsTrue('tc__openTextLinkButton')) {
    const openTextLinkButton = document.createElement('button');
    openTextLinkButton.href = '#';
    openTextLinkButton.id = 'tc__openTextLinkButton';
    openTextLinkButton.title = 'Open selected text links in background';
    openTextLinkButton.appendChild(document.createTextNode(openTextLinkButton.title));

    if (hasTextLinks) {
      openTextLinkButton.addEventListener('click', openTextLinkTabsInBackground);
    } else {
      openTextLinkButton.setAttribute('disabled', 'disabled');
    }

    overlayDiv.appendChild(openTextLinkButton);
    hasElement = true;
    openTextLinkButton.style.order = localData.tc__openTextLinkOrder;
  }

  if (hasInConfigAndIsTrue('tc__wiktionaryButton')) {
    const wiktionaryButton = document.createElement('button');
    wiktionaryButton.href = '#';
    wiktionaryButton.id = 'tc__wiktionaryButton';
    wiktionaryButton.title = 'Look up in Wiktionary';
    wiktionaryButton.appendChild(document.createTextNode(wiktionaryButton.title));
    wiktionaryButton.addEventListener('click', wiktionarySelection);
    overlayDiv.appendChild(wiktionaryButton);
    hasElement = true;
    wiktionaryButton.style.order = localData.tc__wiktionaryOrder;
  }

  if (hasInConfigAndIsTrue('tc__geizhalsButton')) {
    const geizhalsButton = document.createElement('button');
    geizhalsButton.href = '#';
    geizhalsButton.id = 'tc__geizhalsButton';
    geizhalsButton.title = 'Look up in Geizhals.eu';
    geizhalsButton.appendChild(document.createTextNode(geizhalsButton.title));
    geizhalsButton.addEventListener('click', geizhalsSelection);
    overlayDiv.appendChild(geizhalsButton);
    hasElement = true;
    geizhalsButton.style.order = localData.tc__geizhalsOrder;
  }

  if (hasInConfigAndIsTrue('tc__googleSelectionButton')) {
    const googleButton = document.createElement('button');
    googleButton.href = '#';
    googleButton.id = 'tc__googleSelectionButton';
    googleButton.title = 'Google.com selection';
    googleButton.appendChild(document.createTextNode(googleButton.title));
    googleButton.addEventListener('click', googleSelection);
    overlayDiv.appendChild(googleButton);
    hasElement = true;
    googleButton.style.order = localData.tc__googleSelectionOrder;
  }

  if (hasElement) {
    document.body.appendChild(overlayDiv);
  }
}

// --------------------------------------------------------------------
function updateUI () {
  for (const key of Object.keys(localData)) {
    const uiTarget = document.getElementById(key);

    if (uiTarget !== null) {
      switch (uiTarget.getAttribute('type')) {
        case 'checkbox':
          if (localData[key] === true) {
            uiTarget.setAttribute('checked', 'checked');
          } else {
            uiTarget.removeAttribute('checked');
          }
          break;
        case 'text':
          uiTarget.value = localData[key];
          break;
        case 'number':
          uiTarget.value = localData[key];
          break;
        default:
          break;
      }
    }
  }
}

// --------------------------------------------------------------------
function saveValues (data) {
  if (useChrome) {
    chrome.storage.local.set(data).then(function () {
      console.log('TextCompanion: Data saved.');
      updateUI();
    }, function (err) {
      console.log('TextCompanion: Error saving data.');
      console.log(err);
      updateUI();
    });
  } else {
    browser.storage.local.set(data).then(function () {
      console.log('TextCompanion: Data saved.');
      updateUI();
    }, function (err) {
      console.log('TextCompanion: Error saving data.');
      console.log(err);
      updateUI();
    });
  }
}

// --------------------------------------------------------------------
function saveData (evt) {
  evt.preventDefault();

  const target = evt.target;
  const key = target.getAttribute('id');

  if (target.getAttribute('type') === 'checkbox') {
    if (target.getAttribute('checked') === null) {
      target.setAttribute('checked', 'checked');
      localData[key] = true;
    } else {
      target.removeAttribute('checked');
      localData[key] = false;
    }
  } else if (target.getAttribute('type') === 'number') {
    if (target.value.trim() !== '') {
      let value = parseInt(target.value, 10);
      if (value < target.getAttribute('min')) {
        value = parseInt(target.getAttribute('min'), 10);
      } else if (value > target.getAttribute('max')) {
        value = parseInt(target.getAttribute('max'), 10);
      }

      localData[key] = value;
    } else {
      localData[key] = 0;
    }
  } else if (target.getAttribute('type') === 'text') {
    let keyValue = target.value.trim();
    if (key === 'tc__translateLanguage') {
      if (keyValue.length !== 0 && keyValue.length < 2) {
        window.alert('Language code must consists of two letters. Like "de" for German, "en" for English, or "fr" for French.');
        return;
      } else if (keyValue.length === 0) {
        keyValue = 'en';
      }

      keyValue = keyValue.toLowerCase();
      target.value = keyValue;
    }

    localData[key] = keyValue;
  }

  saveValues(localData);
  return false;
}

// --------------------------------------------------------------------
function onLoadError (err) {
  console.log('TextCompanion: Error while loading internal data.');
  console.log(err);
}

// --------------------------------------------------------------------
function reloadUI (evt) {
  if (chrome.runtime.lastError) {
    const errorMsg = chrome.runtime.lastError.message;
    console.log('errorMsg', errorMsg);
    return;
  }

  if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('//extensions') > -1) {
    return;
  }

  if (useChrome) {
    chrome.storage.local.get().then(loadValues, onLoadError);
  } else {
    browser.storage.local.get().then(loadValues, onLoadError);
  }
}

// --------------------------------------------------------------------
function handleMessageFromBackground (message) {
  if (message.component !== undefined) {
    switch (message.component) {
      case 'deepl':
        translateSelection(new window.Event('click'));
        break;
      case 'google':
        googleSelection(new window.Event('click'));
        break;
      case 'geizhals':
        geizhalsSelection(new window.Event('click'));
        break;
      case 'wiktionary':
        wiktionarySelection(new window.Event('click'));
        break;
      case 'linksBackground':
        openTabsInBackground(new window.Event('click'));
        break;
      case 'textLinksBackground':
        openTextLinkTabsInBackground(new window.Event('click'));
        break;
      default:
        break;
    }
  }
  return true;
}

// --------------------------------------------------------------------
document.addEventListener('mouseup', updateMouseData);
document.addEventListener('selectionchange', selectionChangeEvent);
document.addEventListener('visibilitychange', reloadUI);
window.addEventListener('focus', reloadUI);

if (useChrome) {
  chrome.storage.local.get(null).then(loadValues, onLoadError);
  chrome.runtime.onMessage.addListener(handleMessageFromBackground);
} else {
  browser.storage.local.get().then(loadValues, onLoadError);
  browser.runtime.onMessage.addListener(handleMessageFromBackground);
}

// --------------------------------------------------------------------
if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('extension') !== -1) {
  const buttonSettings = document.querySelectorAll('#buttonSettings .buttonOption');
  for (const item of buttonSettings) {
    item.addEventListener('change', saveData);
  }

  const orderSettings = document.querySelectorAll('#orderSettings .orderOption');
  for (const item of orderSettings) {
    item.addEventListener('change', saveData);
  }

  const menuSettings = document.querySelectorAll('#menuSettings .buttonOption');
  for (const item of menuSettings) {
    item.addEventListener('change', saveData);
  }

  const textSettings = document.querySelectorAll('#textSettings .textOption');
  for (const item of textSettings) {
    item.addEventListener('change', saveData);
  }
}

console.log('TextCompanion: Initialized TextCompanion..');
