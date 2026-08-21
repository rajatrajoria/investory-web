import { marked } from "marked";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DOMPurify = createDOMPurify(window as any);

marked.setOptions({ gfm: true, breaks: true });

/**
 * Converts admin-authored markdown into sanitized HTML. Sanitizing on the
 * way OUT (not just trusting the admin on the way in) means even a future
 * admin-account compromise can't be used to inject a stored XSS payload
 * into every visitor's browser.
 */
export function renderMarkdown(source: string): string {
  const rawHtml = marked.parse(source, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "p", "br", "hr", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "h2", "h3", "h4", "blockquote", "code", "pre", "img", "table",
      "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
  });
}

export function excerptFromMarkdown(source: string, maxLength = 200): string {
  const plain = source
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#*_`>~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength).trim() + "…" : plain;
}
