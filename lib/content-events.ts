const contentUpdateChannelName = "portfolio-content-updated"
let contentUpdateChannel: BroadcastChannel | undefined

export function notifyPortfolioContentChanged() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return
  contentUpdateChannel ??= new BroadcastChannel(contentUpdateChannelName)
  contentUpdateChannel.postMessage({ updatedAt: Date.now() })
}

export function subscribeToPortfolioContentChanges(onChange: () => void) {
  if (typeof BroadcastChannel === "undefined") return () => {}
  const channel = new BroadcastChannel(contentUpdateChannelName)
  channel.addEventListener("message", onChange)
  return () => channel.close()
}
