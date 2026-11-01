/* Digital Gloss — contact page: dialling codes + enquiry form */
(function () {
  'use strict';

  /* ISO code | country | dialling code — every country & territory in the global list */
  var COUNTRIES = [
    'AF|Afghanistan|93','AX|Åland Islands|358','AL|Albania|355','DZ|Algeria|213','AS|American Samoa|1684',
    'AD|Andorra|376','AO|Angola|244','AI|Anguilla|1264','AQ|Antarctica|672','AG|Antigua and Barbuda|1268',
    'AR|Argentina|54','AM|Armenia|374','AW|Aruba|297','AC|Ascension Island|247','AU|Australia|61',
    'AT|Austria|43','AZ|Azerbaijan|994','BS|Bahamas|1242','BH|Bahrain|973','BD|Bangladesh|880',
    'BB|Barbados|1246','BY|Belarus|375','BE|Belgium|32','BZ|Belize|501','BJ|Benin|229',
    'BM|Bermuda|1441','BT|Bhutan|975','BO|Bolivia|591','BA|Bosnia and Herzegovina|387','BW|Botswana|267',
    'BR|Brazil|55','IO|British Indian Ocean Territory|246','VG|British Virgin Islands|1284','BN|Brunei|673','BG|Bulgaria|359',
    'BF|Burkina Faso|226','BI|Burundi|257','KH|Cambodia|855','CM|Cameroon|237','CA|Canada|1',
    'CV|Cape Verde|238','BQ|Caribbean Netherlands|599','KY|Cayman Islands|1345','CF|Central African Republic|236','TD|Chad|235',
    'CL|Chile|56','CN|China|86','CX|Christmas Island|61','CC|Cocos (Keeling) Islands|61','CO|Colombia|57',
    'KM|Comoros|269','CG|Congo|242','CD|Congo (DRC)|243','CK|Cook Islands|682','CR|Costa Rica|506',
    'CI|Côte d’Ivoire|225','HR|Croatia|385','CU|Cuba|53','CW|Curaçao|599','CY|Cyprus|357',
    'CZ|Czechia|420','DK|Denmark|45','DJ|Djibouti|253','DM|Dominica|1767','DO|Dominican Republic|1809',
    'EC|Ecuador|593','EG|Egypt|20','SV|El Salvador|503','GQ|Equatorial Guinea|240','ER|Eritrea|291',
    'EE|Estonia|372','SZ|Eswatini|268','ET|Ethiopia|251','FK|Falkland Islands|500','FO|Faroe Islands|298',
    'FJ|Fiji|679','FI|Finland|358','FR|France|33','GF|French Guiana|594','PF|French Polynesia|689',
    'GA|Gabon|241','GM|Gambia|220','GE|Georgia|995','DE|Germany|49','GH|Ghana|233',
    'GI|Gibraltar|350','GR|Greece|30','GL|Greenland|299','GD|Grenada|1473','GP|Guadeloupe|590',
    'GU|Guam|1671','GT|Guatemala|502','GG|Guernsey|44','GN|Guinea|224','GW|Guinea-Bissau|245',
    'GY|Guyana|592','HT|Haiti|509','HN|Honduras|504','HK|Hong Kong|852','HU|Hungary|36',
    'IS|Iceland|354','IN|India|91','ID|Indonesia|62','IR|Iran|98','IQ|Iraq|964',
    'IE|Ireland|353','IM|Isle of Man|44','IL|Israel|972','IT|Italy|39','JM|Jamaica|1876',
    'JP|Japan|81','JE|Jersey|44','JO|Jordan|962','KZ|Kazakhstan|7','KE|Kenya|254',
    'KI|Kiribati|686','XK|Kosovo|383','KW|Kuwait|965','KG|Kyrgyzstan|996','LA|Laos|856',
    'LV|Latvia|371','LB|Lebanon|961','LS|Lesotho|266','LR|Liberia|231','LY|Libya|218',
    'LI|Liechtenstein|423','LT|Lithuania|370','LU|Luxembourg|352','MO|Macao|853','MG|Madagascar|261',
    'MW|Malawi|265','MY|Malaysia|60','MV|Maldives|960','ML|Mali|223','MT|Malta|356',
    'MH|Marshall Islands|692','MQ|Martinique|596','MR|Mauritania|222','MU|Mauritius|230','YT|Mayotte|262',
    'MX|Mexico|52','FM|Micronesia|691','MD|Moldova|373','MC|Monaco|377','MN|Mongolia|976',
    'ME|Montenegro|382','MS|Montserrat|1664','MA|Morocco|212','MZ|Mozambique|258','MM|Myanmar|95',
    'NA|Namibia|264','NR|Nauru|674','NP|Nepal|977','NL|Netherlands|31','NC|New Caledonia|687',
    'NZ|New Zealand|64','NI|Nicaragua|505','NE|Niger|227','NG|Nigeria|234','NU|Niue|683',
    'NF|Norfolk Island|672','KP|North Korea|850','MK|North Macedonia|389','MP|Northern Mariana Islands|1670','NO|Norway|47',
    'OM|Oman|968','PK|Pakistan|92','PW|Palau|680','PS|Palestine|970','PA|Panama|507',
    'PG|Papua New Guinea|675','PY|Paraguay|595','PE|Peru|51','PH|Philippines|63','PN|Pitcairn Islands|64',
    'PL|Poland|48','PT|Portugal|351','PR|Puerto Rico|1787','QA|Qatar|974','RE|Réunion|262',
    'RO|Romania|40','RU|Russia|7','RW|Rwanda|250','BL|Saint Barthélemy|590','SH|Saint Helena|290',
    'KN|Saint Kitts and Nevis|1869','LC|Saint Lucia|1758','MF|Saint Martin|590','PM|Saint Pierre and Miquelon|508','VC|Saint Vincent and the Grenadines|1784',
    'WS|Samoa|685','SM|San Marino|378','ST|São Tomé and Príncipe|239','SA|Saudi Arabia|966','SN|Senegal|221',
    'RS|Serbia|381','SC|Seychelles|248','SL|Sierra Leone|232','SG|Singapore|65','SX|Sint Maarten|1721',
    'SK|Slovakia|421','SI|Slovenia|386','SB|Solomon Islands|677','SO|Somalia|252','ZA|South Africa|27',
    'KR|South Korea|82','SS|South Sudan|211','ES|Spain|34','LK|Sri Lanka|94','SD|Sudan|249',
    'SR|Suriname|597','SJ|Svalbard and Jan Mayen|47','SE|Sweden|46','CH|Switzerland|41','SY|Syria|963',
    'TW|Taiwan|886','TJ|Tajikistan|992','TZ|Tanzania|255','TH|Thailand|66','TL|Timor-Leste|670',
    'TG|Togo|228','TK|Tokelau|690','TO|Tonga|676','TT|Trinidad and Tobago|1868','TA|Tristan da Cunha|290',
    'TN|Tunisia|216','TR|Türkiye|90','TM|Turkmenistan|993','TC|Turks and Caicos Islands|1649','TV|Tuvalu|688',
    'VI|U.S. Virgin Islands|1340','UG|Uganda|256','UA|Ukraine|380','AE|United Arab Emirates|971','GB|United Kingdom|44',
    'US|United States|1','UY|Uruguay|598','UZ|Uzbekistan|998','VU|Vanuatu|678','VA|Vatican City|39',
    'VE|Venezuela|58','VN|Vietnam|84','WF|Wallis and Futuna|681','EH|Western Sahara|212','YE|Yemen|967',
    'ZM|Zambia|260','ZW|Zimbabwe|263'
  ].map(function (row) {
    var p = row.split('|');
    return { iso: p[0], name: p[1], dial: '+' + p[2] };
  });

  // Shortcut group shown first — the GCC and most common markets
  var POPULAR = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'GB', 'US', 'IN'];

  function flag(iso) {
    return iso.toUpperCase().replace(/./g, function (c) { return String.fromCodePoint(127397 + c.charCodeAt(0)); });
  }

  var select = document.getElementById('dial-code');
  var display = document.querySelector('.dial__display');
  if (select) {
    var sorted = COUNTRIES.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
    var byIso = {};
    sorted.forEach(function (c) { byIso[c.iso] = c; });

    function option(c, suffix) {
      var o = document.createElement('option');
      o.value = c.iso + (suffix || '');
      o.textContent = flag(c.iso) + '  ' + c.name + ' (' + c.dial + ')';
      o.dataset.dial = c.dial;
      o.dataset.iso = c.iso;
      return o;
    }
    var gPop = document.createElement('optgroup'); gPop.label = 'Popular';
    POPULAR.forEach(function (iso) { gPop.appendChild(option(byIso[iso], '-p')); });
    var gAll = document.createElement('optgroup'); gAll.label = 'All countries';
    sorted.forEach(function (c) { gAll.appendChild(option(c)); });
    select.appendChild(gPop); select.appendChild(gAll);
    select.value = 'AE-p';

    function syncDial() {
      var o = select.options[select.selectedIndex];
      display.querySelector('.flag').textContent = flag(o.dataset.iso);
      display.querySelector('.code').textContent = o.dataset.dial;
    }
    select.addEventListener('change', syncDial);
    syncDial();
  }

  /* Service chips always start unticked — the visitor chooses (also after Back/Forward). */
  function clearChips() { document.querySelectorAll('.chip input, .form-agree__box').forEach(function (c) { c.checked = false; }); }
  /* …except when the visitor arrives from a service's "Start…" link (contact.html?service=ux|web|hosting|seo): that service starts ticked. */
  function applyServiceFromLink() {
    var key = new URLSearchParams(window.location.search).get('service');
    var box = key && document.querySelector('.chip input[data-key="' + key.replace(/[^a-z]/g, '') + '"]');
    if (box && key !== 'unsure') box.checked = true;
  }
  clearChips(); applyServiceFromLink();
  window.addEventListener('pageshow', function (e) { if (e.persisted) { clearChips(); applyServiceFromLink(); } });

  /* "Not sure yet" stands alone: ticking it clears the other services, and ticking any other service clears it. */
  var chipInputs = Array.prototype.slice.call(document.querySelectorAll('.chip input'));
  chipInputs.forEach(function (box) {
    box.addEventListener('change', function () {
      if (!box.checked) return;
      var isUnsure = box.dataset.key === 'unsure';
      chipInputs.forEach(function (other) {
        if (other !== box && (isUnsure || other.dataset.key === 'unsure')) other.checked = false;
      });
    });
  });

  /* ---------- Validation ---------- */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var rules = {
    'first-name': function (v) { return v.trim().length > 0; },
    'second-name': function (v) { return v.trim().length > 0; },
    'email': function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
    'phone': function (v) { var d = v.replace(/[^\d]/g, ''); return d.length >= 6 && d.length <= 15 && /^[\d\s()+\-.]+$/.test(v.trim()); },
    'services-group': function () { return !!form.querySelector('input[name="services"]:checked'); },
    'message': function (v) { return v.trim().length >= 5; },
    'privacy-agree': function () { return document.getElementById('privacy-agree').checked; }
  };

  function check(id) {
    var el = document.getElementById(id);
    var ok = rules[id](el.value);
    var field = el.closest('.field');
    field.classList.toggle('has-error', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    if (el.type === 'checkbox') { el.addEventListener('change', function () { check(id); }); return; }
    if (el.matches('fieldset')) { el.addEventListener('change', function () { if (el.classList.contains('has-error')) check(id); }); return; }
    el.addEventListener('blur', function () { if (el.value || el.closest('.field').classList.contains('has-error')) check(id); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) check(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
      if (!check(id) && !firstBad) firstBad = document.getElementById(id);
    });
    if (firstBad) { (firstBad.matches('fieldset') ? firstBad.querySelector('input') : firstBad).focus(); return; }

    var data = new FormData(form);
    var opt = select.options[select.selectedIndex];
    data.set('dial_code', opt.dataset.dial);
    data.set('country', opt.dataset.iso);

    /* No server yet: open the visitor's email app with the enquiry ready to send to the team */
    var fullName = data.get('first_name').trim() + ' ' + data.get('second_name').trim();
    var services = data.getAll('services').join(', ');
    var lines = [
      'Name: ' + fullName,
      'Company: ' + (data.get('company') || '').trim(),
      'Email: ' + data.get('email').trim(),
      'Telephone: +' + opt.dataset.dial + ' ' + data.get('phone').trim(),
      'Services: ' + services,
      '',
      'Message:',
      data.get('message').trim(),
      '',
      'Privacy policy: read and agreed'
    ];
    window.location.href = 'mailto:solutions@digital-gloss.com?subject=' +
      encodeURIComponent('Service Enquiry - ' + fullName) + '&body=' + encodeURIComponent(lines.join('\n'));

    document.querySelector('[data-first-name]').textContent = data.get('first_name').trim();
    document.getElementById('form-wrap').hidden = true;
    var success = document.getElementById('form-success');
    success.hidden = false;
    success.focus();
  });
})();
