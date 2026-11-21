import { useCallback } from 'react';
import en from './en.json';
import hi from './hi.json';

const bundles = { en, hi };

/**
 * Translation hook — returns a `t(key, params?)` function.
 * Interpolates `{param}` placeholders from the params object.
 *
 * @param {'en' | 'hi'} lang
 * @returns {(key: string, params?: Record<string, string|number>) => string}
 */
export function useT(lang = 'en') {
  return useCallback(
    (key, params) => {
      const bundle = bundles[lang] || bundles.en;
      let str = bundle[key] ?? bundles.en[key] ?? key;

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }

      return str;
    },
    [lang]
  );
}

