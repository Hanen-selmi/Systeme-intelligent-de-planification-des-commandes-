# Système Intelligent de Planification des Commandes

Ce projet vise à développer une *solution intelligente* pour 
la *planification automatisée des commandes*, en intégrant des technologies
d’intelligence artificielle (LLM, agents CrewAI) et une architecture
moderne basée sur *React.js* pour le frontend et *FastAPI* pour le backend.

## Objectifs du projet

- Optimiser la gestion et la planification des commandes clients.
- Coordonner intelligemment les ressources de production, de stock, de machines et de ressources humaines.
- Automatiser les prises de décision via des agents intelligents collaboratifs (multi-agents).
- Offrir une interface intuitive de pilotage des activités industrielles.

## Architecture du projet

Vous avez envoyé
Frontend (React.js) <--> Backend API (FastAPI) <--> CrewAI Agents <--> Base de données (mySQL)

### Agents intelligents (CrewAI)

- *Agent de stock* : vérifie la disponibilité des matières premières.
- *Agent de production* : planifie les étapes de production.
- *Agent de machine* : affecte les machines en fonction de leur disponibilité.
- *Agent RH* : affecte les ressources humaines aux tâches.
- *Agent de synthèse* : collecte les résultats et génère un résumé de la planification.

## 🛠️ Technologies utilisées

| Technologie        | Rôle                            |
|--------------------|----------------------------------|
| React.js           | Interface utilisateur            |
| FastAPI            | API Backend                      |
| mySQL              | Base de données relationnelle    |
| CrewAI             | Système d’agents intelligents    |
| LangChain & LLMs   | Raisonnement & prise de décision |
| Framer Motion      | Animation UI                     |
| JWT Auth           | Authentification sécurisée       |

##  Structure du projet

systeme-planification-commandes ├── backend/ │   ├── main.py │   ├── routes/ │   ├── agents/ │   ├── tasks/ │   └── utils/ ├── frontend/ │   ├── src/ │   └── public/ ├── database/ │   ├── schema.sql │   └── seed_data.sql ├── docs/ │  ├── README.md └── requirements.txt

## Installation et exécution

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/systeme-planification-commandes.git
cd systeme-planification-commandes

2. Lancer le backend (FastAPI)

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

3. Lancer le frontend (React.js)

cd frontend
npm install
npm start
