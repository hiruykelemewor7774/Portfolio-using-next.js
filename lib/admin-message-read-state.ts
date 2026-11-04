"use client"

const storageKey = "portfolio-admin-read-messages"
const updateEvent = "portfolio-admin-message-read"

export function getReadAdminMessageIds() {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return []

    const ids: unknown = JSON.parse(stored)
    return Array.isArray(ids)
      ? ids.filter((id): id is number => Number.isInteger(id) && id > 0)
      : []
  } catch (error) {
    console.error("Could not load read admin messages:", error)
    return []
  }
}

export function markAdminMessageRead(id: number) {
  let ids = getReadAdminMessageIds()
  if (!ids.includes(id)) {
    ids = [...ids, id]
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(ids))
    } catch (error) {
      console.error("Could not save read admin message:", error)
    }
  }

  window.dispatchEvent(new Event(updateEvent))
}

export function subscribeToAdminMessageReadChanges(onChange: () => void) {
  window.addEventListener(updateEvent, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(updateEvent, onChange)
    window.removeEventListener("storage", onChange)
  }
}
