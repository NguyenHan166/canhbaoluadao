import sanitizeHtmlLibrary from 'sanitize-html';

/**
 * Sanitizes a dirty HTML string to protect against XSS attacks.
 * Only allows a safe list of formatting tags and attributes.
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return '';

  return sanitizeHtmlLibrary(dirty, {
    allowedTags: [
      'p', 'h1', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li',
      'a', 'img', 'table', 'blockquote', 'code', 'pre', 'br', 'span',
      'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel', 'class'],
      'img': ['src', 'alt', 'width', 'height', 'class'],
      '*': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowedSchemesByTag: {
      'img': ['http', 'https', 'data']
    }
  });
};
