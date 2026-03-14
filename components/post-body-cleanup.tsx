"use client"

import { useEffect } from "react"

/**
 * A lightweight client-side cleanup component that runs only on blog post pages.
 * It scans the .post-article and unwraps unnecessary wrapper <div> elements
 * to ensure that paragraphs and headings are direct children of the article container.
 * This helps ad networks like Journey by Mediavine detect paragraph boundaries for ad insertion.
 */
export function PostBodyCleanup() {
  useEffect(() => {
    const article = document.querySelector(".post-article")
    if (!article) return

    /**
     * Helper function to determine if a div is a "meaningful" container
     * or just a structural wrapper that should be flattened.
     */
    const isStructuralWrapper = (el: Element) => {
      if (el.tagName !== "DIV") return false

      // Do not unwrap nested divs within protected containers themselves.
      // This is handled by the loop logic correctly scanning everything,
      // but we explicitly skip known functional blocks.
      if (el.classList.contains("cms-content")) {
        return true
      }

      if (
        el.classList.contains("border") ||
        el.id === "toc" ||
        el.classList.contains("post-header") ||
        el.classList.contains("not-prose") ||
        el.classList.contains("table-of-contents-box")
      ) {
        return false
      }

      // Preserve elements that look like ad placeholders or media embeds
      if (
        el.classList.contains("mv-ad") ||
        el.classList.contains("ad-placeholder") ||
        el.hasAttribute("data-slot-rendered-content")
      ) {
        return false
      }

      // Check if inside a protected block (Header, Footers, and anything marked not-prose)
      // We check parents to ensure we don't accidentally unwrap internal metadata divs.
      let parent = el.parentElement
      while (parent && parent !== article) {
        if (
          parent.classList.contains("not-prose") || 
          parent.classList.contains("post-header") ||
          parent.tagName === "HEADER"
        ) {
          return false
        }
        parent = parent.parentElement
      }

      // If it only contains text-based or semantic content elements, it's likely structural
      const children = Array.from(el.children)
      if (children.length === 0) return true // Empty div

      // Tags that are allowed inside a structural wrapper that can be flattened.
      // We include common block elements and links/formatting.
      const textBasedTags = [
        "P", "H1", "H2", "H3", "H4", "H5", "H6", 
        "UL", "OL", "LI", "IMG", "FIGURE", "BLOCKQUOTE", 
        "PRE", "CODE", "DIV", "A", "SPAN", "BR", "STRONG", "EM"
      ]
      
      const allChildrenAreSafeToFlatten = children.every(child => textBasedTags.includes(child.tagName))

      return allChildrenAreSafeToFlatten
    }

    const unwrap = (el: Element) => {
      const parent = el.parentNode
      if (!parent) return

      // Move all children of the wrapper div out to the parent
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el)
      }
      // Remove the now-empty wrapper div
      parent.removeChild(el)
    }

    /**
     * Recursively scan and flatten the article body.
     * We limit the pass count to avoid edge cases.
     */
    let passes = 0
    const maxPasses = 5
    let foundWrapper = true

    while (foundWrapper && passes < maxPasses) {
      foundWrapper = false
      // Only scan for <div> elements inside the article
      const divs = Array.from(article.querySelectorAll("div")) as HTMLDivElement[]

      for (const div of divs) {
        // Only target direct descendants of the article or descendants within flattened areas.
        // We ensure we are not breaking protected blocks.
        if (article.contains(div) && div !== article && isStructuralWrapper(div)) {
          unwrap(div)
          foundWrapper = true
          // Break to rescanning the updated DOM
          break
        }
      }
      passes++
    }
  }, [])

  return null
}
