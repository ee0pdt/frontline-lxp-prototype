interface StoryIndicatorsProps {
  total: number
  current: number
}

export function StoryIndicators({ total, current }: StoryIndicatorsProps) {
  return (
    <div className="flex gap-1 px-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
            index === current
              ? 'bg-white'
              : index < current
              ? 'bg-white/70'
              : 'bg-white/30'
          }`}
        />
      ))}
    </div>
  )
}
