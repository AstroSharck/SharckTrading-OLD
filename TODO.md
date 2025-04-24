# ✅ ToDo List – Projet ShackTrading

## 🏗️ Phase 1 – Architecture & Base du Projet
- [x] Créer la structure de dossiers `/core`, `/scanner`, `/context`, etc.
- [x] Implémenter `index.js` comme point d’entrée
- [x] Ajouter les fichiers de config dans `/config`
- [x] Installer les libs de base (`dotenv`, `axios`, `chalk`, `technicalindicators`, etc.)

## 🌐 Phase 2 – Analyse de Contexte Marché
- [x] `context/volatilityChecker.js` – Détection de volatilité globale
- [x] `context/newsFetcher.js` – Intégration de l’analyse de news économiques
- [x] `context/marketStatus.js` – Décision : marché propice au scalping ?

## 🔍 Phase 3 – Scanner d’Actifs Scalpables
- [ ] `scanner/binanceScanner.js` – Récupérer tous les actifs USDT sur Binance
- [ ] `scanner/forexScanner.js` – Intégrer une API Forex (TwelveData, etc.)
- [ ] `scanner/assetScorer.js` – Filtres personnalisés (volatilité, volume, etc.)
- [ ] Gestion WebSocket dynamique (ouvrir/fermer selon pertinence des actifs)

## 📈 Phase 4 – Indicateurs Techniques
- [ ] `core/indicators.js` – Calcul EMA9, EMA21, RSI(7), VWAP, MACD, BB, Volume
- [ ] `core/signalDetector.js` – Détection des signaux BUY/SELL

## 🧠 Phase 5 – Prise de Décision
- [ ] `core/strategyManager.js` – Centralisation des stratégies
- [ ] `trading/tradeManager.js` – Logique de prise de position
- [ ] `trading/riskManager.js` – Gestion des risques et du capital
- [ ] `trading/positionController.js` – Gestion des ordres

## 🧪 Phase 6 – Backtesting
- [ ] `backtest/backtestEngine.js` – Simuler les stratégies sur données passées
- [ ] `backtest/dataLoader.js` – Récupérer données historiques (Binance, Forex)
- [ ] Interface CLI `--backtest` avec sélection d’actif et période

## 📚 Phase 7 – Logs & Apprentissage
- [ ] `learning/tradeLogger.js` – Log des trades exécutés
- [ ] `learning/tradeMemory.js` – Mémoire interne des décisions
- [ ] `learning/mistakeAnalyzer.js` – Analyse d’erreurs et d’opportunités manquées

## 🔐 Sécurité & Robustesse
- [ ] Utiliser `.env` pour stocker les clés API
- [ ] Sécuriser tous les appels API avec `try/catch`
- [ ] Implémenter un système de failover (reconnect, log, alerte)

---

✍️ Pense à cocher les cases au fur et à mesure de l'avancement. Ce fichier est une roadmap évolutive !