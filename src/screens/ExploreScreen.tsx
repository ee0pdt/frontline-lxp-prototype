import { useEffect, useState } from 'react'
import { useStore, type Course } from '../store'
import { api } from '../api/client'

export function ExploreScreen() {
  const { setActiveCourse, setCurrentScreen } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getExploreCourses()
        setCourses(data)
      } catch (error) {
        console.error('Failed to load explore courses:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCourses()
  }, [])

  const handleOpenCourse = (course: Course) => {
    setActiveCourse(course)
    setCurrentScreen('course-content')
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Explore</h1>
        <p className="text-xs text-[var(--text-muted)]">Discover new learning opportunities</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Featured course (first one) */}
            {courses.length > 0 && (
              <div className="card overflow-hidden p-0">
                <div className="relative h-40">
                  {courses[0].image ? (
                    <img
                      src={courses[0].image}
                      alt={courses[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xs font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full mb-2 inline-block">
                      Featured
                    </span>
                    <h2 className="text-lg font-bold text-white">{courses[0].title}</h2>
                    <p className="text-sm text-white/80 line-clamp-2 mt-1">{courses[0].description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    {courses[0].estimatedMinutes && (
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {courses[0].estimatedMinutes} min
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenCourse(courses[0])}
                    className="btn-primary w-full text-sm py-3"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            )}

            {/* Other courses */}
            {courses.length > 1 && (
              <>
                <h3 className="font-bold text-[var(--text-primary)] mt-6 mb-3">More to Explore</h3>
                <div className="space-y-3">
                  {courses.slice(1).map((course) => (
                    <div key={course.id} className="card overflow-hidden">
                      <div className="flex gap-3">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">📖</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[var(--text-primary)] text-[15px] leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                            {course.description}
                          </p>
                          {course.estimatedMinutes && (
                            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{course.estimatedMinutes} min</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenCourse(course)}
                        className="btn-subtle w-full mt-3 text-sm py-3"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
