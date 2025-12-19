import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useCourseObjectCount(courseId: number, levelId?: number) {
  return useQuery({
    queryKey: ['courseObjects', courseId, levelId],
    queryFn: () => api.getCourseObjects(courseId, levelId),
    select: (data) => data.length,
    enabled: Boolean(courseId),
  })
}
