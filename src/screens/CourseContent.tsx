import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { CourseObject } from '../store'
import { api } from '../api/client'

export function CourseContent() {
  const {
    activeCourse,
    courseObjects,
    setCourseObjects,
    setCurrentScreen,
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
      setCurrentScreen('home')
    }
  }

  const handleObjectClick = (obj: CourseObject) => {
    setActiveObject(obj)
  }

  const handleCompleteObject = (obj: CourseObject) => {
    if (!obj.completed) {
      addXP(obj.xp)
      // Update local state to show completion
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
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">No course selected</p>
      </div>
    )
  }

  // Show active object viewer
  if (activeObject) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-700 truncate">{activeObject.name}</h1>
            <p className="text-xs text-gray-400">{activeObject.type} • {activeObject.xp} XP</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <ObjectViewer object={activeObject} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
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

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <span className="text-xl">←</span>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-700 truncate">{activeCourse.title}</h1>
          <p className="text-xs text-gray-400">
            {completedCount}/{courseObjects.length} complete
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
            style={{
              width: `${courseObjects.length > 0 ? (completedCount / courseObjects.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Object list */}
      <div className="px-4 py-4 space-y-3">
        {courseObjects.length === 0 ? (
          <div className="card text-center py-8">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="font-semibold text-gray-600">No content available</p>
            <p className="text-sm text-gray-400 mt-1">
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
      className="w-full card flex items-center gap-4 text-left hover:shadow-md transition-shadow"
    >
      {/* Index/status indicator */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          object.completed
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {object.completed ? (
          <span className="text-lg">✓</span>
        ) : (
          <span className="font-bold">{index}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-700 truncate">{object.name}</h3>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <span>{object.type}</span>
          <span>•</span>
          <span>{object.viewTime} min</span>
          <span>•</span>
          <span>{object.xp} XP</span>
        </p>
      </div>

      {/* Arrow */}
      <span className="text-gray-300 text-xl">→</span>
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
          <h2 className="font-bold text-gray-700 mb-2">{object.name}</h2>
          <p className="text-gray-500 text-sm">{object.description}</p>
        </div>
      </div>
    )
  }

  // External URL
  if (resource.humanType === 'URL' && resource.content) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-6xl mb-4">🔗</span>
        <h2 className="font-bold text-gray-700 mb-2 text-center">{object.name}</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">{object.description}</p>
        <a
          href={resource.content}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Open External Link
        </a>
      </div>
    )
  }

  // Default content view
  return (
    <div className="p-4">
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        <span className="text-6xl">📄</span>
      </div>
      <h2 className="font-bold text-gray-700 mb-2">{object.name}</h2>
      <p className="text-gray-500 text-sm">{object.description}</p>
      {resource.content && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">{resource.content}</p>
        </div>
      )}
    </div>
  )
}
