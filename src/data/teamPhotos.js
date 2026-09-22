const teamPhotos = Array.from({ length: 7 }, (_, index) => ({
  src: `/team/team-photo-${index + 1}.jpg`,
  alt: `Team Rockett group photo ${index + 1}`,
}))

export default teamPhotos
