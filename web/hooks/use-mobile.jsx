import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const getInitial = () => {
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  }

  const [isMobile, setIsMobile] = React.useState(getInitial)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e) => {
      // use event.matches for accurate media query result
      setIsMobile(typeof e === "object" && "matches" in e ? e.matches : window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener?.("change", onChange)
    // no synchronous setState here; initial state already set
    return () => mql.removeEventListener?.("change", onChange)
  }, [])

  return !!isMobile
}