import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '../store'
import type { CourseObject } from '../store'
import { api } from '../api/client'

export function CourseContent() {
  const navigate = useNavigate()
  const {
    activeCourse,
    courseObjects,
    setCourseObjects,
    setIsLoading,
    addXP,
  } = useStore()

  const [activeObject, setActiveObject] = useState<CourseObject | null>(null)

  useEffect(() => {
    const loadObjects = async () => {
      if (!activeCourse) return

      setIsLoading(true)
      try {
        const objects = await api.getCourseObjects(activeCourse.id, activeCourse.levelId)
        setCourseObjects(objects)
      } catch (error) {
        console.error('Failed to load course objects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadObjects()
  }, [activeCourse, setCourseObjects, setIsLoading])

  const handleBack = () => {
    if (activeObject) {
      setActiveObject(null)
    } else {
      navigate({ to: '/' })
    }
  }

  const handleObjectClick = (obj: CourseObject) => {
    setActiveObject(obj)
  }

  const handleCompleteObject = (obj: CourseObject) => {
    if (!obj.completed) {
      addXP(obj.xp)
      setCourseObjects(
        courseObjects.map((o) =>
          o.id === obj.id ? { ...o, completed: true } : o
        )
      )
    }
    setActiveObject(null)
  }

  if (!activeCourse) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--surface-secondary)]">
        <p className="text-[var(--text-muted)]">No course selected</p>
      </div>
    )
  }

  // Show active object viewer
  if (activeObject) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--surface-primary)]">
        {/* Header */}
        <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-tertiary)] transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-[var(--text-primary)] truncate text-sm">{activeObject.name}</h1>
            <p className="text-xs text-[var(--text-muted)]">{activeObject.type} • {activeObject.xp} XP</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[var(--surface-secondary)]">
          <ObjectViewer object={activeObject} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--surface-primary)]">
          <button
            onClick={() => handleCompleteObject(activeObject)}
            className="w-full btn-primary"
          >
            {activeObject.completed ? 'Continue' : 'Mark Complete'}
          </button>
        </div>
      </div>
    )
  }

  // Show object list
  const completedCount = courseObjects.filter((o) => o.completed).length
  const progress = courseObjects.length > 0 ? (completedCount / courseObjects.length) * 100 : 0

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-tertiary)] transition-colors"
        >
          <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[var(--text-primary)] truncate text-sm">{activeCourse.title}</h1>
          <p className="text-xs text-[var(--text-muted)]">
            {completedCount}/{courseObjects.length} complete
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 bg-[var(--surface-primary)] border-b border-[var(--border-primary)]">
        <div className="h-2 bg-[var(--progress-bg)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Object list */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3 pb-20">
        {courseObjects.length === 0 ? (
          <div className="card text-center py-8">
            <span className="text-4xl mb-3 block">📚</span>
            <p className="font-bold text-[var(--text-primary)]">No content available</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              This course has no learning objects yet
            </p>
          </div>
        ) : (
          courseObjects.map((obj, index) => (
            <ObjectCard
              key={obj.id}
              object={obj}
              index={index + 1}
              onClick={() => handleObjectClick(obj)}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface ObjectCardProps {
  object: CourseObject
  index: number
  onClick: () => void
}

function ObjectCard({ object, index, onClick }: ObjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full card card-interactive flex items-center gap-3 text-left"
    >
      {/* Index/status indicator */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          object.completed
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]'
        }`}
      >
        {object.completed ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="font-bold text-sm">{index}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--text-primary)] truncate text-sm">{object.name}</h3>
        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
          <span>{object.type}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
          <span>{object.viewTime} min</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
          <span className="text-[var(--color-primary)] font-semibold">{object.xp} XP</span>
        </p>
      </div>

      {/* Arrow */}
      <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

interface ObjectViewerProps {
  object: CourseObject
}

function ObjectViewer({ object }: ObjectViewerProps) {
  const { resource } = object

  // YouTube embed
  if (resource.humanType === 'YouTube' && resource.content) {
    return (
      <div className="p-4">
        <div
          className="aspect-video bg-black rounded-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />
        <div className="mt-4">
          <h2 className="font-bold text-[var(--text-primary)] text-lg mb-2">{object.name}</h2>
          <p className="text-[var(--text-secondary)] text-sm">{object.description}</p>
        </div>
      </div>
    )
  }

  // External URL
  if (resource.humanType === 'URL' && resource.content) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-20 h-20 bg-[var(--surface-tertiary)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h2 className="font-bold text-[var(--text-primary)] text-lg mb-2 text-center">{object.name}</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6 text-center max-w-sm">{object.description}</p>
        <a
          href={resource.content}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <span>Open Link</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    )
  }

  // Default content view
  return (
    <div className="p-4">
      <div className="aspect-video bg-[var(--surface-tertiary)] rounded-xl flex items-center justify-center mb-4">
        <svg className="w-16 h-16 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h2 className="font-bold text-[var(--text-primary)] text-lg mb-2">{object.name}</h2>
      <p className="text-[var(--text-secondary)] text-sm">{object.description}</p>
      {resource.content && (
        <div className="mt-4 p-4 bg-[var(--surface-tertiary)] rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">{resource.content}</p>
        </div>
      )}
    </div>
  )
}
