import Image from 'next/image'
import { lofiStreams } from "@/const/streamList"

interface Stream {
  id: string
  title: string
  url: string
  thumbnail: string
}

interface StreamThumbnailsProps {
  onSelectStream: (stream: Stream) => void
  currentStreamId?: string
}

// StreamThumbnails: displays streams in a beautiful, responsive 2-column grid with image filling the card and title below
export default function StreamThumbnails({ 
  onSelectStream,
  currentStreamId 
}: StreamThumbnailsProps) {
  return (
    <div className="w-full">
      <div className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent sm:max-h-none sm:overflow-y-visible">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2"
        >
          {lofiStreams.map((stream) => (
            <div 
              key={stream.id} 
              className={`group flex flex-col items-center bg-white/10 hover:bg-white/20 transition-all duration-200 rounded-xl shadow-lg cursor-pointer border-2 ${currentStreamId === stream.id ? 'border-white/80 ring-2 ring-blue-400' : 'border-transparent'} backdrop-blur-md p-0 overflow-hidden`}
              onClick={() => onSelectStream(stream)}
            >
              <div className="relative w-full aspect-video">
                <Image 
                  src={stream.thumbnail} 
                  alt={stream.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="w-full px-4 py-4 flex flex-col items-center">
                <p className="text-white text-base tracking-wide font-semibold text-center truncate drop-shadow-sm">
                  {stream.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}