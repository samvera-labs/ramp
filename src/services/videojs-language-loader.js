// Default language for Video.js
import en from 'video.js/dist/lang/en.json';

// Cache for loaded language data
const languageCache = new Map();

// Default to English
languageCache.set('en', en);

// Detect the environment
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Dynamically load a Video.js language file
 * @param {String} languageCode - language code from user props
 * @returns {Object} - language data object
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
      try {
        if (isDevelopment) {
          // In development, adjust the import path to point to node_modules
          const module = await import(/* @vite-ignore */ `../../node_modules/video.js/dist/lang/${variant}.json`);
          languageData = module.default || module;
        } else {
          // Production build can use the standard dynamic import path
          const module = await import(/* @vite-ignore */ `video.js/dist/lang/${variant}.json`);
          languageData = module.default || module;
          break;
        }
      } catch (e) {
        // Ignore and try next variant
        continue;
      }
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
