
### 🧠 Vision du Projet

**ShackTrading** est un algorithme de scalping avancé développé en **Node.js**, capable d'analyser en temps réel les marchés **Crypto** et **Forex**, avec une logique inspirée du raisonnement humain. L'objectif est de **détecter, analyser et exécuter** des opportunités de trading rapide avec intelligence, fiabilité, et adaptabilité.

### ⚙️ Fonctionnalités Fondamentales
#### 🔍 Analyse de Contexte Global
- Détection de la **volatilité générale du marché**
- Analyse de l’**Order Book** sur plusieurs niveaux
- Récupération et interprétation des **news économiques** et événements clés
- Prise de décision : le bot **évalue si les conditions globales sont propices** au scalping


#### 🧬 Sélection Intelligente des Actifs
- Scan automatique de tous les actifs Crypto/Forex
- Application de filtres personnalisés :  
    → _Volatilité suffisante_, _volume_, _liquidité_, _écart bid/ask_, _ordre du carnet de commandes_
- Liste dynamique des actifs “scalpables”
- Fermeture des connexions WebSocket si un actif devient non-pertinent


#### 📊 Utilisation des Indicateurs Techniques
- Indicateurs principaux intégrés :
    - **EMA9 / EMA21**
    - **VWAP (customisé)**
    - **RSI 7**
    - **MACD / Bollinger Bands**
    - **Filtre de volume et momentum**
- Détection des signaux d'entrée/sortie fiables (BUY/SELL)


#### 🤖 Logique Humaine & Apprentissage
- Le bot **comprend ce qu’il fait et pourquoi** (logique décisionnelle basée sur des règles)
- Système de “réflexion interne” :  
    _→ Est-ce que ce trade vaut le coup ? Y a-t-il un risque déraisonnable ?_
- Historique des décisions pour analyse des erreurs et des opportunités manquées
- Évolution constante via un **moteur d’apprentissage autonome** (plus tard IA/ML)

#### 🧪 Backtesting Complet
- Mode **backtest** pour Crypto et Forex :
    - Rejoue des marchés passés avec stratégie active
    - Affiche performance, drawdown, taux de réussite, profit net après frais
- Compatible avec des données historiques multi-sources (Binance, APIs Forex)
- Interface de sélection d’actifs et de périodes à backtester


```
graph TD
    Start[Démarrage du Bot] --> CheckMarket[Analyse du Marché Global]
    CheckMarket -->|Marché "good"| FetchAssets[Scan des actifs scalpables]
    CheckMarket -->|Marché "mauvais"| Sleep[Inactivité - Aucun Trade]
    FetchAssets --> OpenWS[Ouverture des WebSockets sur actifs scalpables]
    OpenWS --> ScanOpportunités[Analyse en temps réel des signaux]
    ScanOpportunités --> TradeDecision[Décision Long / Short ou Ne rien faire]
    TradeDecision --> Learn[Stockage & Analyse de la décision prise]
    FetchAssets -->|Actif plus scalpable| CloseWS[Fermeture WebSocket spécifique]
```

#### 📌 Étapes à Suivre

1. - **Phase 1 - Setup de l'architecture**
    - Structure modulaire (scanner, stratégie, décision, logs, etc.)
    - Connexion à Binance + API Forex (par ex. TwelveData ou ForexAPI.io)
2. **Phase 2 - Détection du contexte marché**
    - Volatilité générale, filtres de liquidité, volume, impact news
3. **Phase 3 - Analyse des actifs scalpables**
    - Scan + sockets + filtres dynamiques
4. **Phase 4 - Implémentation des indicateurs**
    - Calcul live EMA, RSI, VWAP etc.
5. **Phase 5 - Prise de décision**
    - Logique conditionnelle + gestion du capital
6. **Phase 6 - Backtest engine**
    - Rejouer des journées entières avec ta stratégie
7. **Phase 7 - Logs, apprentissage, visualisation**
    - Logs des trades, gestion des erreurs, “leçons apprises”



#### 🧱 Structure des Dossiers
```
/shack-trading
├── /core              → Cœur logique : stratégies, signaux, indicateurs
│   ├── strategyManager.js
│   ├── indicators.js
│   └── signalDetector.js
│
├── /scanner           → Analyse des cryptos et forex scalpables
│   ├── binanceScanner.js
│   ├── forexScanner.js
│   └── assetScorer.js
│
├── /context           → Analyse du marché global
│   ├── marketStatus.js
│   ├── volatilityChecker.js
│   └── newsFetcher.js
│
├── /trading           → Prise de position + gestion des ordres
│   ├── tradeManager.js
│   ├── positionController.js
│   └── riskManager.js
│
├── /learning          → Logs, erreurs, apprentissage
│   ├── tradeLogger.js
│   ├── mistakeAnalyzer.js
│   └── tradeMemory.js
│
├── /backtest          → Moteur de simulation historique
│   ├── backtestEngine.js
│   └── dataLoader.js
│
├── /config            → Fichiers de configuration
│   ├── binance.json
│   ├── forex.json
│   └── general.js
│
├── /utils             → Fonctions utilitaires globales
│   ├── logger.js
│   ├── math.js
│   └── helpers.js
│
├── index.js           → Point d’entrée principal
├── .env               → Clés API, config sensible
└── README.md
```


#### 🧠 Technologies & Libs
- **Node.js** – runtime principal
- **WebSocket** – pour les flux live Binance & Forex
- **Axios / fetch** – requêtes REST (news, contexte)
- **technicalindicators** – lib pour les EMA, RSI, etc.
- **dotenv** – pour la config environnement
- **chalk / ora** – logs stylés en CLI
- (plus tard : TensorFlow.js pour l’IA ?)


#### 🔐 Sécurité & Robustesse
- `.env` pour sécuriser les clés API
- `try/catch` sur tous les fetch + WebSocket
- Système de _“failover”_ si Binance down (reconnect, log, alerte)
- Surveillance du comportement anormal → `learning/mistakeAnalyzer.js`



#### 🧪 Test & Dev
- Environnement “paper trading” avec WebSocket live mais sans envoi réel d’ordres
- Mode `--backtest` en ligne de commande pour tester une strat