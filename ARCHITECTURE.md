# Architecture front-end

Le code est organisé par responsabilité et par domaine métier.

```
src/
├── app/          # composition globale : providers et routeur
├── pages/        # écrans associés aux URLs, sans logique métier
├── widgets/      # blocs d'interface composés et réutilisables
├── features/     # cas d'usage métier isolés
│   ├── auth/     # session et authentification
│   ├── tenants/  # lecture et création de locataires
│   └── dashboard/# agrégats métier et affichage des indicateurs
└── shared/       # primitives sans dépendance métier : UI, formatage, utilitaires
```

## Convention d'une feature

Chaque nouveau domaine (`payments`, `reminders`, `properties`, par exemple)
utilise ses propres sous-dossiers :

```
features/payments/
├── api/       # contrat avec l'API ou repository
├── model/     # hooks, état et règles métier
└── ui/        # composants propres au domaine
```

Une page ne connaît pas le stockage ni les règles de calcul ; elle assemble les
features et widgets. Une feature ne dépend jamais d'une page. `shared/` ne
dépend d'aucune feature.

## Passage à une API réelle

Les accès aux données sont isolés dans `features/*/api`. Pour brancher le
backend, remplacez le repository local concerné par des requêtes HTTP : les
composants et hooks restent inchangés.
