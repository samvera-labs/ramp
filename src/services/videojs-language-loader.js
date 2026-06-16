// Default language for Video.js
import en from 'video.js/dist/lang/en.json';

// Cache for loaded language data
const languageCache = new Map();

// Default to English
languageCache.set('en', en);

/* Detect the environment using Vite's import.meta.env.DEV which is set correctly by both
 the Vite dev server and Storybook's Vite builder, unlike process.env.NODE_ENV */
const isDevelopment = import.meta.env.DEV;

/* Statically glob all VideoJS language files so Vite can discover and bundle each one as
its own chunk at build time for all deployments. A fully dynamic import() with @vite-ignore
does not include these files in the build for docs. This causes the language change requests
from Storybook prop controls to fail with 404 silently. This approach was tested on all
deployment environments, both prod & dev demo sites & storybook docs sites. */
const langModules = import.meta.glob('../../node_modules/video.js/dist/lang/*.json');

/**
 * Load a Video.js language file
 * @param {String} languageCode language code from user props
 * @returns {Object} language data object
 */
export async function loadVideoJSLanguage(languageCode) {
  if (!languageCode) {
    return en;
  }

  // Normalize language code to lowercase
  const normalizedLang = languageCode.toLowerCase();

  // Check cache first for the given language
  if (languageCache.has(normalizedLang)) {
    return languageCache.get(normalizedLang);
  }

  try {
    let languageData = null;

    // Try different possible language code formats
    const langVariants = [normalizedLang, languageCode];

    // Handle special cases for language codes
    if (normalizedLang.includes('-')) {
      const [lang, region] = normalizedLang.split('-');
      langVariants.push(lang);
      langVariants.push(`${lang}-${region.toUpperCase()}`);
    }

    // Try each language variant
    for (const variant of langVariants) {
      const importModule = langModules[`../../node_modules/video.js/dist/lang/${variant}.json`];
      if (!importModule) {
        continue;
      }
      const module = await importModule();
      languageData = module.default || module;
      break;
    }

    if (!languageData) {
      console.warn(`Video.js language '${languageCode}' not found, falling back to English`);
      languageData = en;
    }

    // Cache the newly loaded language
    languageCache.set(normalizedLang, languageData);
    return languageData;

  } catch (error) {
    console.warn(`Failed to load Video.js language '${languageCode}':`, error.message);
    console.warn('Falling back to English');

    // Cache the fallback
    languageCache.set(normalizedLang, en);
    return en;
  }
}
