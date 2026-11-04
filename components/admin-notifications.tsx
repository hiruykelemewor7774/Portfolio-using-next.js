"use client"

import { useEffect, useState } from "react"
import { Bell, Mail, X } from "lucide-react"
import type { ContactSubmission } from "@/lib/db/schema"
import {
  getReadAdminMessageIds,
  markAdminMessageRead,
  subscribeToAdminMessageReadChanges,
} from "@/lib/admin-message-read-state"

export function AdminNotifications({ messages }: { messages: ContactSubmission[] }) {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<number[]>([])
  const unreadCount = messages.reduce(
    (count, message) => count + (readIds.includes(message.id) ? 0 : 1),
    0,
  )

  useEffect(() => {
    const updateReadIds = () => setReadIds(getReadAdminMessageIds())
    updateReadIds()
    return subscribeToAdminMessageReadChanges(updateReadIds)
  }, [])

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications, ${unreadCount} unread contact ${unreadCount === 1 ? "message" : "messages"}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="relative grid size-10 place-items-center rounded-lg border bg-background transition-colors hover:bg-muted"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,32rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border bg-background p-3 shadow-xl"
        >
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread · {messages.length} total
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="grid size-8 place-items-center rounded-md hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
          {messages.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No contact messages yet.
            </p>
          ) : (
            <ul className="grid gap-2">
              {messages.map((message) => {
                const isRead = readIds.includes(message.id)
                return (
                  <li key={message.id} className="rounded-lg border">
                    <a
                      href={`/admin?section=messages&message=${message.id}`}
                      onClick={() => {
                        markAdminMessageRead(message.id)
                        setReadIds(getReadAdminMessageIds())
                        setOpen(false)
                      }}
                      className={`block rounded-lg p-3 text-left transition-colors hover:bg-muted/60 ${isRead ? "opacity-70" : ""}`}
                    >
                      <span className="flex items-start gap-2">
                        <Mail
                          className={`mt-0.5 size-4 shrink-0 ${isRead ? "text-muted-foreground" : "text-red-600"}`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="block truncate text-sm font-medium">{message.name}</span>
                            {!isRead && <span className="size-2 shrink-0 rounded-full bg-red-600" aria-label="Unread" />}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(message.createdAt)}
                          </span>
                          <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">
                            {message.message}
                          </span>
                          <span className="mt-2 block text-xs font-medium underline underline-offset-4">
                            View message
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
          <a
            href="/admin?section=messages"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-lg px-3 py-2 text-center text-sm font-medium underline underline-offset-4 hover:bg-muted"
          >
            View all messages
          </a>
        </section>
      )}
    </div>
  )
}
