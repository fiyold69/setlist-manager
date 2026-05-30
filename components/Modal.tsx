'use client'
import { useEffect } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // Escキーで閉じる
  useEffect(() => {
    if (!open) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // モーダル表示中は背面スクロールを止める
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50" /*flex items-end sm:items-center justify-center*/
    >
      {/* オーバーレイ（背景の暗い部分） */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* モーダル本体 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-xl pointer-events-auto flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 id="modal-title" className="font-semibold text-gray-800">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>

          {/* コンテンツ（スクロール可能） */}
          <div className="overflow-y-auto p-5 flex-1 min-h-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
