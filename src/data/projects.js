const projects = [
  { id: 'line-follower', title: 'Line Follower', description: 'I have no idea what happened. I was not even there man...', tech: ['Hardware', 'Technology', 'Science', 'Magic'], image: '/project-1.jpg', gallery: { images: [1, 2, 3, 4, 5, 6].map((order) => ({ order, src: `/project-1/image-${order}.jpg`, description: 'TODO' })) }, links: { live: '#', source: '#' } },
  { id: 'i-spa', title: 'I-SPA', description: 'Detects poor sitting posture in real time and nudges the user through a hardware alert and laptop-side intervention.', tech: ['Hardware', 'ESP32', 'MPU-6050', 'Python'], image: '/project-2.jpg', links: { live: 'https://posture-identifier-application.vercel.app/', source: 'https://github.com/Saptarshi-Bagchi/Posture-Identifier-Application' } },
]

export function getProjectSlug(project) {
  return project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default projects
