const placeholderImage = (label, tone = '#002366') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500">
      <rect width="1200" height="1500" fill="#ffffff"/>
      <rect x="72" y="72" width="1056" height="1356" fill="none" stroke="${tone}" stroke-width="6"/>
      <text x="96" y="1280" fill="${tone}" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">${label}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const placeholderPages = {
  gallery: {
    title: 'Gallery',
    introduction: 'Selected image-led moments, references and production fragments for layout styling.'
  },
  video: {
    title: 'Video',
    introduction: 'Moving image entries, campaign cuts and documented process studies.'
  },
  worldBuilding: {
    title: 'World Building',
    introduction: 'Notes, essays and field observations around culture, feeling and creative infrastructure.'
  },
  poweredByYana: {
    title: 'Powered By Yana',
    introduction: 'Original initiatives, collaborations and self-authored cultural projects.',
    sections: [
      {
        _key: 'placeholder-origin',
        heading: 'Origin',
        body: 'A placeholder section for shaping editorial copy, spacing and information hierarchy.'
      },
      {
        _key: 'placeholder-format',
        heading: 'Format',
        body: 'Use this block to test longer page sections, calls to action and supporting page rhythm.'
      }
    ],
    callsToAction: [
      {
        _key: 'placeholder-contact',
        label: 'Start a Conversation',
        linkType: 'internal',
        internalPath: '/info'
      }
    ]
  },
  info: {
    title: 'Info',
    bio: 'Yana Studios is a creative production and world-building practice shaping cultural projects, campaigns and live moments.',
    contactEmail: 'hello@yanastudios.example',
    contactDetails: 'London / available for selected projects, residencies and collaborations.',
    services: ['Embedded Producer', 'Campaign Production', 'Creative Operations', 'Creative Direction', 'Movement Direction / Intimacy Coordination'],
    clients: ['Client Name One', 'Client Name Two', 'Client Name Three'],
    collaborators: ['Artist Name', 'Director Name', 'Studio Partner'],
    newsletterLink: '#',
    inviteInformation: 'Placeholder invite copy for styling this section before final content is published.',
    sections: [
      {
        _key: 'placeholder-approach',
        heading: 'Approach',
        body: 'A concise working note for testing extra editorial sections on the info page.'
      }
    ]
  }
}

export const placeholderProjects = [
  {
    _id: 'placeholder-project-1',
    title: 'Placeholder Project One',
    date: '2026',
    year: '2026',
    client: 'Client Placeholder',
    location: 'London',
    shortDescription: 'A sample project description for styling archive cards and detail previews.',
    fullDescription: 'Longer placeholder project copy for testing the rhythm of a work detail page. Use this area to shape paragraphs, metadata, credits and supporting image sections before final project content is published.',
    service: 'Creative Direction',
    role: 'Creative Direction',
    roles: ['Creative Direction', 'Production'],
    mainImageUrl: placeholderImage('Project One'),
    galleryImageUrls: [
      placeholderImage('Project One A'),
      placeholderImage('Project One B')
    ],
    slug: 'placeholder-project-one'
  },
  {
    _id: 'placeholder-project-2',
    title: 'Placeholder Project Two',
    date: '2025',
    year: '2025',
    client: 'Brand Placeholder',
    location: 'Paris',
    shortDescription: 'A second entry with enough copy to test line breaks and spacing.',
    fullDescription: 'Additional placeholder detail copy for a second project page. This text exists only to make the template feel populated while the final Sanity project data is still being prepared.',
    service: 'Production',
    role: 'Production',
    roles: ['Production', 'Creative Operations'],
    mainImageUrl: placeholderImage('Project Two'),
    galleryImageUrls: [
      placeholderImage('Project Two A'),
      placeholderImage('Project Two B')
    ],
    slug: 'placeholder-project-two'
  },
  {
    _id: 'placeholder-project-3',
    title: 'Placeholder Project Three',
    date: '2024',
    year: '2024',
    client: 'Artist Placeholder',
    location: 'New York',
    shortDescription: 'A third sample item for grids, lists and repeated card rhythm.',
    fullDescription: 'A third placeholder detail page for checking related sections, hero treatment and image spacing across different project lengths.',
    service: 'Movement Direction',
    role: 'Movement Direction',
    roles: ['Movement Direction', 'Intimacy Coordination'],
    mainImageUrl: placeholderImage('Project Three'),
    galleryImageUrls: [
      placeholderImage('Project Three A'),
      placeholderImage('Project Three B')
    ],
    slug: 'placeholder-project-three'
  }
]

export const placeholderGalleryEntries = [
  {
    _id: 'placeholder-gallery-1',
    title: 'Gallery Placeholder One',
    date: '2026',
    service: 'Editorial',
    imageUrl: placeholderImage('Gallery One')
  },
  {
    _id: 'placeholder-gallery-2',
    title: 'Gallery Placeholder Two',
    date: '2025',
    service: 'Campaign',
    imageUrl: placeholderImage('Gallery Two')
  },
  {
    _id: 'placeholder-gallery-3',
    title: 'Gallery Placeholder Three',
    date: '2024',
    service: 'Archive',
    imageUrl: placeholderImage('Gallery Three')
  },
  {
    _id: 'placeholder-gallery-4',
    title: 'Gallery Placeholder Four',
    date: '2023',
    service: 'Process',
    imageUrl: placeholderImage('Gallery Four')
  },
  {
    _id: 'placeholder-gallery-5',
    title: 'Gallery Placeholder Five',
    date: '2022',
    service: 'Documentation',
    imageUrl: placeholderImage('Gallery Five')
  },
  {
    _id: 'placeholder-gallery-6',
    title: 'Gallery Placeholder Six',
    date: '2021',
    service: 'Reference',
    imageUrl: placeholderImage('Gallery Six')
  }
]

export const placeholderVideos = [
  {
    _id: 'placeholder-video-1',
    title: 'Video Placeholder One',
    date: '2026',
    service: 'Moving Image',
    description: 'A sample video entry for thumbnail, caption and description styling.',
    thumbnailUrl: placeholderImage('Video One')
  },
  {
    _id: 'placeholder-video-2',
    title: 'Video Placeholder Two',
    date: '2025',
    service: 'Campaign Film',
    description: 'A second video placeholder for testing two-column responsive layouts.',
    thumbnailUrl: placeholderImage('Video Two')
  }
]

export const placeholderWorldPosts = [
  {
    _id: 'placeholder-world-1',
    title: 'A Note on Soft Infrastructure',
    date: '2026',
    excerpt: 'Placeholder essay copy for testing post cards, metadata and editorial rhythm.',
    imageUrl: placeholderImage('World One')
  },
  {
    _id: 'placeholder-world-2',
    title: 'Making Feeling Operational',
    date: '2025',
    excerpt: 'A second sample post with a longer line of text for responsive styling checks.',
    imageUrl: placeholderImage('World Two')
  }
]

export const placeholderInitiatives = [
  {
    _id: 'placeholder-initiative-1',
    title: 'Initiative Placeholder One',
    date: '2026',
    description: 'Sample initiative copy for testing Powered By Yana entry styling.',
    imageUrl: placeholderImage('Initiative One')
  },
  {
    _id: 'placeholder-initiative-2',
    title: 'Initiative Placeholder Two',
    date: '2025',
    description: 'A second placeholder initiative to balance the grid.',
    imageUrl: placeholderImage('Initiative Two')
  }
]
