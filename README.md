# Kasa — Frontend

Frontend de l'application Kasa, développé avec Next.js, React et TypeScript.

## Prérequis

- Node.js 22 ou supérieur
- npm
- Git

## Installation

Cloner le projet puis installer les dépendances :

```bash
git clone https://github.com/Xety/OCR-P8.git
cd OCR-P8
npm install
```

Copier `.env.example` dans un fichier `.env.local` :

```dotenv
API_BASE_URL=http://localhost:8000
SITE_URL=http://localhost:3000
```

Démarrer le serveur de développement :

```bash
npm run dev
```

L'application est ensuite disponible sur [http://localhost:3000](http://localhost:3000).

## Commandes utiles

```bash
npm test          # Exécuter les tests
npm run coverage  # Générer le rapport de couverture
npm run lint      # Vérifier le code avec ESLint
npm run build     # Créer la version de production
```

## Backend

[Dépôt GitHub de P8BACKEND](https://github.com/OpenClassrooms-Student-Center/dev-react-P12) pour l'installation du backend.
