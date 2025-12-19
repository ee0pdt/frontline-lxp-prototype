import { useState } from 'react'

interface CreateAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    body: string
    imageUrl?: string
    ctaText?: string
    ctaUrl?: string
  }) => void
}

export function CreateAnnouncementModal({ isOpen, onClose, onSubmit }: CreateAnnouncementModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaUrl: ctaText.trim() ? ctaUrl.trim() || undefined : undefined,
      })
      // Reset form
      setTitle('')
      setBody('')
      setImageUrl('')
      setCtaText('')
      setCtaUrl('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  const isValid = title.trim() && body.trim()

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[var(--surface-primary)] rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)]">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[var(--text-muted)] font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            New Announcement
          </h2>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="text-[var(--color-accent)] font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the headline?"
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              maxLength={100}
              required
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell your team what they need to know..."
              rows={4}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-none"
              maxLength={500}
              required
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              {body.length}/500
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
              Image URL <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
            {imageUrl && (
              <div className="mt-2 relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-secondary)]">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
              Call to Action <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Button text"
                className="px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                maxLength={30}
              />
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="Link URL"
                disabled={!ctaText}
                className="px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Target audience info */}
          <div className="bg-[var(--surface-secondary)] rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Sending to your team</p>
              <p className="text-xs text-[var(--text-muted)]">All team members will see this announcement</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
