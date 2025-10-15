# Media Assets

Ce dossier contient les médias du site Cédric Raul Films.

## Structure

```
media/
├── video/          # Vidéos de mariages et shootings
│   ├── *.mp4      # Fichiers vidéo (exclus du git)
│   └── *_poster.jpg # Posters pour les vidéos (exclus du git)
├── photo/          # Photos de shootings
│   └── *.jpg/jpeg  # Fichiers photo (exclus du git)
└── README.md       # Ce fichier
```

## Important

Les fichiers media (vidéos, images, posters) sont **exclus du repository git** via `.gitignore` car ils sont trop volumineux.

### Déploiement en production

Les médias doivent être hébergés séparément via:
- CDN (Cloudflare, AWS CloudFront, etc.)
- Service de stockage cloud (AWS S3, Google Cloud Storage, etc.)
- Service vidéo spécialisé (Vimeo, YouTube, Mux, etc.)

### Formats recommandés

- **Vidéos**: MP4 (H.264), WebM, format web-optimisé
- **Posters vidéo**: JPG (1920x1080 ou 1280x720)
- **Photos**: JPG/WebP optimisées pour le web
- **Compression**: Utiliser `ffmpeg`, `squoosh.app`, ou `sharp`

### Développement local

Pour développer localement, placez vos fichiers media dans:
- `public/media/video/` pour les vidéos
- `public/media/photo/` pour les photos

Les fichiers seront automatiquement ignorés par git.