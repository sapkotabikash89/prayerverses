"use client"

import { useEffect } from "react"

/**
 * A lightweight client-side cleanup component that runs only on blog post pages.
 * It scans the .content-area and unwraps unnecessary wrapper <div> elements
 * to ensure that paragraphs and headings are direct children of the content area.
 * This helps ad networks like Journey by Mediavine detect paragraph boundaries for ad insertion.
 */
export function PostBodyCleanup() {
  useEffect(() => {
    const contentArea = document.querySelector(".content-area.article-body")
    if (!contentArea) return

    /**
     * Helper function to determine if a div is a "meaningful" container
     * or just a structural wrapper that should be flattened.
     */
    const isStructuralWrapper = (el: Element) => {
      if (el.tagName !== "DIV") return false

      // Preserve components like Table of Contents (has specific styling/border)
      // or other known functional containers.
      if (el.classList.contains("border") || el.id === "toc") return false

      // Preserve elements that look like ad placeholders or media embeds
      if (
        el.classList.contains("mv-ad") ||
        el.classList.contains("ad-placeholder") ||
        el.querySelector("iframe") ||
        el.querySelector("video") ||
        el.querySelector("audio") ||
        el.querySelector("table") ||
        el.querySelector(".gallery")
      ) {
        return false
      }

      // If it has specific attributes mentioned by the user, unwrap it
      if (el.hasAttribute("data-slot-rendered-content")) return true

      // If it only contains text-based or semantic content elements, it's likely structural
      const children = Array.from(el.children)
      if (children.length === 0) return true // Empty div

      const textBasedTags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "IMG", "FIGURE", "BLOCKQUOTE", "PRE", "CODE", "DIV"]
      const allChildrenAreTextBased = children.every(child => textBasedTags.includes(child.tagName))

      return allChildrenAreTextBased
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
     * We limit the number of passes to avoid infinite loops, though the logic
     * should naturally terminate.
     */
    let passes = 0
    const maxPasses = 5
    let foundWrapper = true

    while (foundWrapper && passes < maxPasses) {
      foundWrapper = false
      // Only scan for <div> elements inside the article body
      const divs = Array.from(contentArea.querySelectorAll("div")) as HTMLDivElement[]

      for (const div of divs) {
        // Double-check the div is still in the DOM and is a descendant of contentArea
        if (contentArea.contains(div) && div !== contentArea && isStructuralWrapper(div)) {
          unwrap(div)
          foundWrapper = true
          // We found a wrapper and unwrapped it. Let's restart the scan to handle
          // newly exposed children or nested wrappers.
          break
        }
      }
      passes++
    }
  }, [])

  return null
}
