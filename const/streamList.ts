export interface Stream {
  id: string
  title: string
  url: string
  thumbnail: string
}

export const lofiStreams: Stream[] = [
  {
    id: '1',
    title: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    thumbnail: '/thumbnails/lofi-girl.jpg'
  },
  {
    id: '2',
    title: 'Chillhop Radio',
    url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY',
    thumbnail: '/thumbnails/chillhop-thumb.jpg'
  },
  {
    id: '3',
    title: 'Coffee Shop Radio',
    url: 'https://www.youtube.com/watch?v=UI5NKkW8acM',
    thumbnail: '/thumbnails/coffee-shop.jpg'
  },
  {
    id: '4',
    title: 'Jazz Cafe Ambience',
    url: 'https://www.youtube.com/watch?v=HuFYqnbVbzY',
    thumbnail: '/thumbnails/jazz-cafe.jpg'
  },
  {
    id: '5',
    title: 'Rainy Night Coffee Shop',
    url: 'https://www.youtube.com/watch?v=LTFEmIIOvNQ',
    thumbnail: '/thumbnails/rainy-night.jpg'
  },
  {
    id: '6',
    title: 'Synthwave Radio',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    thumbnail: '/thumbnails/synth-boy.jpg'
  }
]