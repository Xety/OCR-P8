# Kasa

Kasa est une application de consultation de logements. Le projet est composé de deux parties :

- [`OCR-P8`](https://github.com/Xety/OCR-P8) : frontend développé avec Next.js ;
- [`P8BACKEND`](https://github.com/OpenClassrooms-Student-Center/dev-react-P12) : API développée avec Express et SQLite.

## Prérequis

- Node.js 22.9 ou supérieur ;
- npm 11.6.2 ;
- Git.

Les deux projets doivent être installés séparément.

## Installation du backend

Les instructions d'installation se trouvent dans le [README de P8BACKEND](https://github.com/OpenClassrooms-Student-Center/dev-react-P12). En local, démarrer l'API avec `PORT=8000` et définir un `JWT_SECRET` distinct du secret de production.

## Installation du frontend

Cloner le frontend :

```bash
git clone https://github.com/Xety/OCR-P8.git
```

Depuis le dossier `OCR-P8` :

```bash
npm ci
```

Copier `.env.example` vers `.env.local` et conserver l'URL du backend local :

```dotenv
API_BASE_URL=http://localhost:8000
```

Démarrer le frontend :

```bash
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Vérifications

Depuis le dossier `OCR-P8` :

```bash
npm test
npm run lint
npm run build
```

La CI GitHub Actions lance les tests Vitest à chaque push et pull request.