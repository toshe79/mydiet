const CACHE = 'mydiet-v1';
const ICONS = [
  'cod','mackerel','salmon','chickpeas_boiled','corn_spaghetti','macaroni_dry',
  'oats','raw_rice','red_lentils','soda_bread','boiled_carrots','boiled_potatoes',
  'boiled_rice','mashed_potatoes','potato_patties','rice_patties','stewed_zucchini',
  'beef_soup','carrot_cream_soup','chicken_noodle_soup','chicken_rice_soup',
  'lentil_soup','potato_cream_soup','pumpkin_cream_soup','vegetable_soup',
  'beef_boiled','beef_boiled_sliced','chicken_breast','chicken_breast_steamed',
  'chicken_drumstick','turkey_boiled','turkey_breast','turkey_breast_steamed',
  'bell_pepper','carrot','cucumber','olives','potato','pumpkin','spinach',
  'tomato','zucchini','baked_apple','cottage_cheese','cows_milk','egg',
  'fruit_yogurt','oatmeal_banana','rice_porridge','tofu','yogurt',
  'chicken_potatoes_baked','chicken_with_rice','fish_with_potatoes',
  'rice_veg_cottage','rice_with_zucchini','spaghetti_tomato',
  'stuffed_peppers_rice','turkey_moussaka'
].map(k => '/mydiet/icons/' + k + '.png');

const ASSETS = [
  '/mydiet/',
  '/mydiet/index.html',
  '/mydiet/manifest.json',
  ...ICONS
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
