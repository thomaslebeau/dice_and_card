import React, { useState, useEffect, useRef } from "react";
import "gaming-ui-a11y-toolkit/style.css";
import {
  GameButton,
  GameMenu,
  useGamepadNavigation,
} from "gaming-ui-a11y-toolkit";

// ==================== DONNÉES DES CARTES ====================

const CARD_DATABASE = [
  {
    id: 1,
    name: "Guerrier Novice",
    rarity: "common",
    maxHp: 10,
    attackMod: 0,
    defenseMod: 0,
    description: "Un guerrier basique",
  },
  {
    id: 2,
    name: "Écuyer",
    rarity: "common",
    maxHp: 12,
    attackMod: 0,
    defenseMod: 1,
    description: "Défense +1",
  },
  {
    id: 3,
    name: "Bretteur",
    rarity: "common",
    maxHp: 8,
    attackMod: 1,
    defenseMod: 0,
    description: "Attaque +1",
  },
  {
    id: 4,
    name: "Paladin",
    rarity: "rare",
    maxHp: 15,
    attackMod: 0,
    defenseMod: 2,
    description: "Tank - Défense +2",
  },
  {
    id: 5,
    name: "Berserk",
    rarity: "rare",
    maxHp: 8,
    attackMod: 2,
    defenseMod: -1,
    description: "Attaque +2, Défense -1",
  },
  {
    id: 6,
    name: "Assassin",
    rarity: "rare",
    maxHp: 7,
    attackMod: 3,
    defenseMod: 0,
    description: "Frappe mortelle - Attaque +3",
  },
  {
    id: 7,
    name: "Garde Royal",
    rarity: "uncommon",
    maxHp: 14,
    attackMod: 1,
    defenseMod: 1,
    description: "Équilibré - +1/+1",
  },
  {
    id: 8,
    name: "Chevalier Noir",
    rarity: "epic",
    maxHp: 12,
    attackMod: 2,
    defenseMod: 2,
    description: "Puissant - +2/+2",
  },
  {
    id: 9,
    name: "Recrue",
    rarity: "common",
    maxHp: 6,
    attackMod: 0,
    defenseMod: 0,
    description: "Fragile mais rapide",
  },
  {
    id: 10,
    name: "Champion",
    rarity: "epic",
    maxHp: 20,
    attackMod: 1,
    defenseMod: 1,
    description: "Le héros - +1/+1, 20 HP",
  },
];

const RARITY_COLORS = {
  common: "#9CA3AF",
  uncommon: "#22C55E",
  rare: "#3B82F6",
  epic: "#A855F7",
};

const DICE_COLORS = [
  "#e63946",
  "#f1faee",
  "#a8dadc",
  "#457b9d",
  "#1d3557",
  "#0077b6",
];

// ==================== STYLES ====================

const GlobalStyles = () => (
  <style>{`
    :root {
      --color-primary: #1E90FF;
      --color-secondary: #FF6347;
      --color-background: #121212;
      --color-text: #E0E0E0;
      --color-focus: #00FFFF;
    }
    .game-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--color-background);
      color: var(--color-text);
      font-family: 'Inter', sans-serif;
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 3rem;
      color: var(--color-focus);
      margin-bottom: 20px;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
    .main-menu-container {
      background: rgba(30, 30, 30, 0.9);
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border: 2px solid var(--color-focus);
      min-width: 300px;
      max-width: 800px;
    }
    
    .combat-results {
      margin: 20px 0;
      padding: 20px;
      background: rgba(50, 50, 50, 0.8);
      border-radius: 8px;
      border: 2px solid var(--color-focus);
    }
    
    .player-results {
      display: flex;
      justify-content: space-around;
      margin: 15px 0;
    }
    
    .player-section {
      flex: 1;
      padding: 10px;
      border-radius: 6px;
      margin: 0 10px;
    }
    
    .player-section.player {
      background: rgba(65, 105, 225, 0.2);
      border: 2px solid #4169E1;
    }
    
    .player-section.ia {
      background: rgba(255, 99, 71, 0.2);
      border: 2px solid #FF6347;
    }
    
    .dice-result {
      font-size: 1.2em;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .final-result {
      margin-top: 15px;
      padding: 15px;
      font-size: 1.3em;
      font-weight: bold;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.3);
    }

    .card-display {
      background: rgba(40, 40, 40, 0.9);
      border-radius: 8px;
      padding: 15px;
      margin: 10px;
      min-width: 200px;
    }

    .card-name {
      font-size: 1.3em;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .card-hp {
      font-size: 1.5em;
      color: #FF6B6B;
      margin: 5px 0;
    }

    .card-stats {
      font-size: 0.9em;
      opacity: 0.8;
      margin: 5px 0;
    }

    .card-description {
      font-size: 0.85em;
      font-style: italic;
      opacity: 0.7;
      margin-top: 8px;
    }

    .progress-bar {
      background: rgba(100, 100, 100, 0.3);
      border-radius: 10px;
      height: 20px;
      margin: 10px 0;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      height: 100%;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8em;
      font-weight: bold;
    }

    .reward-cards {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin: 20px 0;
    }

    .reward-card {
      background: rgba(50, 50, 50, 0.9);
      border: 3px solid transparent;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 200px;
    }

    .reward-card:hover {
      transform: translateY(-5px);
      border-color: var(--color-focus);
      box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
    }

    .dice-display {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin: 30px 0;
      flex-wrap: wrap;
    }

    .dice-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .dice-label {
      font-size: 0.9em;
      opacity: 0.8;
      font-weight: bold;
    }

    .dice {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3em;
      font-weight: bold;
      border-radius: 12px;
      border: 3px solid;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      animation: diceRoll 2s ease-out;
    }

    @keyframes diceRoll {
      0% {
        transform: rotate(0deg) scale(0.5);
        opacity: 0;
      }
      50% {
        transform: rotate(720deg) scale(1.2);
      }
      100% {
        transform: rotate(720deg) scale(1);
        opacity: 1;
      }
    }

    .dice.player-dice {
      background: linear-gradient(135deg, #4169E1, #1E90FF);
      border-color: #00BFFF;
      color: white;
    }

    .dice.enemy-dice {
      background: linear-gradient(135deg, #FF6347, #DC143C);
      border-color: #FF4500;
      color: white;
    }
    
    /* Styles pour les composants simulés */
    .game-button { 
      cursor: pointer;
      padding: 10px 20px;
      margin: 8px 0;
      border: none;
      border-radius: 6px;
      transition: all 0.2s;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .game-button[data-variant="primary"] {
      background-color: var(--color-primary);
      color: var(--color-text);
    }
    .game-button[data-variant="secondary"] {
        background-color: var(--color-secondary);
        color: var(--color-text);
    }
    .game-button:focus-visible {
      outline: 3px solid var(--color-focus);
      box-shadow: 0 0 10px var(--color-focus);
    }
    .menu-item {
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        transition: background-color 0.2s;
        text-align: left;
    }
    .menu-item[data-focused="true"] {
        background-color: rgba(60, 60, 60, 1);
        border: 1px solid var(--color-focus);
    }
    .menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
  `}</style>
);

// ==================== GÉNÉRATION ENNEMIS ====================

const generateEnemy = (combatNumber) => {
  let enemyPool = [];
  let hpMultiplier = 1;
  let statBoost = 0;
  let isBoss = false;

  switch (combatNumber) {
    case 1:
      enemyPool = CARD_DATABASE.filter((c) => c.rarity === "common");
      hpMultiplier = 0.8;
      statBoost = 0;
      break;

    case 2:
      enemyPool = CARD_DATABASE.filter(
        (c) => c.rarity === "common" || c.rarity === "uncommon"
      );
      hpMultiplier = 1.0;
      statBoost = 0;
      break;

    case 3:
      enemyPool = CARD_DATABASE.filter(
        (c) => c.rarity === "uncommon" || c.rarity === "rare"
      );
      hpMultiplier = 1.1;
      statBoost = 1;
      break;

    case 4:
      enemyPool = CARD_DATABASE.filter(
        (c) => c.rarity === "rare" || c.rarity === "epic"
      );
      hpMultiplier = 1.2;
      statBoost = 1;
      break;

    case 5:
      enemyPool = CARD_DATABASE.filter((c) => c.rarity === "epic");
      hpMultiplier = 1.5;
      statBoost = 2;
      isBoss = true;
      break;

    default:
      enemyPool = CARD_DATABASE;
      hpMultiplier = 1.0;
      statBoost = 0;
  }

  if (enemyPool.length === 0) {
    enemyPool = CARD_DATABASE;
  }

  const enemyBase = enemyPool[Math.floor(Math.random() * enemyPool.length)];

  return {
    ...enemyBase,
    name: isBoss ? `👑 BOSS - ${enemyBase.name}` : enemyBase.name,
    maxHp: Math.floor(enemyBase.maxHp * hpMultiplier),
    currentHp: Math.floor(enemyBase.maxHp * hpMultiplier),
    attackMod: enemyBase.attackMod + statBoost,
    defenseMod: enemyBase.defenseMod + statBoost,
    description: isBoss
      ? `BOSS FINAL - ${enemyBase.description}`
      : enemyBase.description,
    isBoss,
  };
};

// ==================== COMPOSANT CARTE ====================

const CardDisplay = ({ card, isPlayer }) => {
  const hpPercentage = (card.currentHp / card.maxHp) * 100;
  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <div
      className="card-display"
      style={{ borderColor: rarityColor, borderWidth: 2, borderStyle: "solid" }}
    >
      <div className="card-name" style={{ color: rarityColor }}>
        {card.name}
      </div>
      <div className="card-hp">
        ❤️ {card.currentHp}/{card.maxHp}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${hpPercentage}%` }}>
          {hpPercentage > 20 && `${Math.round(hpPercentage)}%`}
        </div>
      </div>
      <div className="card-stats">
        🗡️ Attaque:{" "}
        {card.attackMod >= 0 ? `+${card.attackMod}` : card.attackMod}
      </div>
      <div className="card-stats">
        🛡️ Défense:{" "}
        {card.defenseMod >= 0 ? `+${card.defenseMod}` : card.defenseMod}
      </div>
      <div className="card-description">{card.description}</div>
    </div>
  );
};

// ==================== MENU PRINCIPAL ====================

const MainMenu = ({ setGameState, startNewRun }) => {
  const menuItems = [
    {
      id: "play",
      label: "Commencer une Partie",
      icon: "🎮",
      onSelect: startNewRun,
    },
    {
      id: "quit",
      label: "Quitter le Jeu",
      icon: "🚪",
      onSelect: () => console.log("Fermeture du jeu (Simulé)..."),
    },
  ];

  return (
    <div className="main-menu-container">
      <GameMenu
        title="Dices and Cards"
        items={menuItems}
        enableHapticFeedback={true}
      />
      <p style={{ marginTop: "20px", fontSize: "0.8em", opacity: 0.7 }}>
        Phase 1 MVP - 5 combats pour gagner !
      </p>
    </div>
  );
};

// ==================== ÉCRAN DE COMBAT ====================

const CombatScreen = ({ playerCard, enemyCard, onCombatEnd, combatNumber }) => {
  const [roundNumber, setRoundNumber] = useState(1);
  const [diceKey, setDiceKey] = useState(0);
  const [diceResults, setDiceResults] = useState(() => ({
    playerAttack: Math.floor(Math.random() * 6) + 1,
    playerDefense: Math.floor(Math.random() * 6) + 1,
    enemyAttack: Math.floor(Math.random() * 6) + 1,
    enemyDefense: Math.floor(Math.random() * 6) + 1,
  }));
  const [showResults, setShowResults] = useState(false);
  const [roundResolved, setRoundResolved] = useState(false);
  const [combatFinished, setCombatFinished] = useState(false);

  const [currentPlayerCard, setCurrentPlayerCard] = useState(playerCard);
  const [currentEnemyCard, setCurrentEnemyCard] = useState(enemyCard);

  // Afficher les résultats après l'animation des dés
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [diceKey]);

  // Résoudre le round quand les résultats sont affichés
  useEffect(() => {
    if (showResults && !roundResolved && !combatFinished) {
      setTimeout(() => {
        const playerAttackTotal =
          diceResults.playerAttack + currentPlayerCard.attackMod;
        const playerDefenseTotal =
          diceResults.playerDefense + currentPlayerCard.defenseMod;
        const enemyAttackTotal =
          diceResults.enemyAttack + currentEnemyCard.attackMod;
        const enemyDefenseTotal =
          diceResults.enemyDefense + currentEnemyCard.defenseMod;

        const damageToEnemy = Math.max(
          0,
          playerAttackTotal - enemyDefenseTotal
        );
        const damageToPlayer = Math.max(
          0,
          enemyAttackTotal - playerDefenseTotal
        );

        const newPlayerHp = Math.max(
          0,
          currentPlayerCard.currentHp - damageToPlayer
        );
        const newEnemyHp = Math.max(
          0,
          currentEnemyCard.currentHp - damageToEnemy
        );

        setCurrentPlayerCard({ ...currentPlayerCard, currentHp: newPlayerHp });
        setCurrentEnemyCard({ ...currentEnemyCard, currentHp: newEnemyHp });

        if (newPlayerHp <= 0 || newEnemyHp <= 0) {
          setCombatFinished(true);
          setTimeout(() => {
            onCombatEnd({
              victory: newEnemyHp <= 0,
              playerCard: { ...currentPlayerCard, currentHp: newPlayerHp },
            });
          }, 2000);
        }

        setRoundResolved(true);
      }, 1000);
    }
  }, [showResults, roundResolved, combatFinished]);

  const handleNextRound = () => {
    setRoundNumber((prev) => prev + 1);
    setDiceResults({
      playerAttack: Math.floor(Math.random() * 6) + 1,
      playerDefense: Math.floor(Math.random() * 6) + 1,
      enemyAttack: Math.floor(Math.random() * 6) + 1,
      enemyDefense: Math.floor(Math.random() * 6) + 1,
    });
    setShowResults(false);
    setRoundResolved(false);
    setDiceKey((prev) => prev + 1);
  };

  let combatResult = null;
  if (showResults) {
    const playerAttackTotal =
      diceResults.playerAttack + currentPlayerCard.attackMod;
    const playerDefenseTotal =
      diceResults.playerDefense + currentPlayerCard.defenseMod;
    const enemyAttackTotal =
      diceResults.enemyAttack + currentEnemyCard.attackMod;
    const enemyDefenseTotal =
      diceResults.enemyDefense + currentEnemyCard.defenseMod;

    const damageToEnemy = Math.max(0, playerAttackTotal - enemyDefenseTotal);
    const damageToPlayer = Math.max(0, enemyAttackTotal - playerDefenseTotal);

    combatResult = {
      playerAttack: playerAttackTotal,
      playerDefense: playerDefenseTotal,
      enemyAttack: enemyAttackTotal,
      enemyDefense: enemyDefenseTotal,
      damageToEnemy,
      damageToPlayer,
    };
  }

  return (
    <div className="main-menu-container">
      <h2>
        ⚔️ Combat #{combatNumber} - Round {roundNumber} ⚔️
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px 0",
        }}
      >
        <CardDisplay card={currentPlayerCard} isPlayer={true} />
        <CardDisplay card={currentEnemyCard} isPlayer={false} />
      </div>

      <div className="dice-display" key={diceKey}>
        <div className="dice-container">
          <div className="dice-label">🎮 JOUEUR</div>
          <div className="dice-container">
            <div className="dice-label">🗡️ Attaque</div>
            <div className="dice player-dice">{diceResults.playerAttack}</div>
          </div>
          <div className="dice-container">
            <div className="dice-label">🛡️ Défense</div>
            <div className="dice player-dice">{diceResults.playerDefense}</div>
          </div>
        </div>

        <div className="dice-container">
          <div className="dice-label">🤖 ENNEMI</div>
          <div className="dice-container">
            <div className="dice-label">🗡️ Attaque</div>
            <div className="dice enemy-dice">{diceResults.enemyAttack}</div>
          </div>
          <div className="dice-container">
            <div className="dice-label">🛡️ Défense</div>
            <div className="dice enemy-dice">{diceResults.enemyDefense}</div>
          </div>
        </div>
      </div>

      {showResults && combatResult && (
        <div className="combat-results">
          <div className="player-results">
            <div className="player-section player">
              <h3>🎮 Votre Carte</h3>
              <div className="dice-result">
                🗡️ Attaque: {diceResults.playerAttack} +{" "}
                {currentPlayerCard.attackMod} = {combatResult.playerAttack}
              </div>
              <div className="dice-result">
                🛡️ Défense: {diceResults.playerDefense} +{" "}
                {currentPlayerCard.defenseMod} = {combatResult.playerDefense}
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.2em",
                  color:
                    combatResult.damageToPlayer > 0 ? "#FF6B6B" : "#4ADE80",
                }}
              >
                {combatResult.damageToPlayer > 0
                  ? `💔 -${combatResult.damageToPlayer} HP`
                  : "✅ Aucun dégât"}
              </div>
            </div>

            <div className="player-section ia">
              <h3>🤖 Ennemi</h3>
              <div className="dice-result">
                🗡️ Attaque: {diceResults.enemyAttack} +{" "}
                {currentEnemyCard.attackMod} = {combatResult.enemyAttack}
              </div>
              <div className="dice-result">
                🛡️ Défense: {diceResults.enemyDefense} +{" "}
                {currentEnemyCard.defenseMod} = {combatResult.enemyDefense}
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.2em",
                  color: combatResult.damageToEnemy > 0 ? "#4ADE80" : "#FF6B6B",
                }}
              >
                {combatResult.damageToEnemy > 0
                  ? `💥 -${combatResult.damageToEnemy} HP`
                  : "🛡️ Bloqué"}
              </div>
            </div>
          </div>

          {roundResolved && !combatFinished && (
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleNextRound}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2em",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ⚔️ Round Suivant
              </button>
            </div>
          )}

          {combatFinished && (
            <div
              style={{
                marginTop: "20px",
                fontSize: "1.5em",
                fontWeight: "bold",
              }}
            >
              {currentEnemyCard.currentHp <= 0
                ? "🎉 VICTOIRE !"
                : "💀 DÉFAITE..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== ÉCRAN DE RÉCOMPENSE ====================

const RewardScreen = ({ onCardSelected, combatNumber }) => {
  const [rewardCards] = useState(() => {
    const shuffled = [...CARD_DATABASE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((card) => ({
      ...card,
      currentHp: card.maxHp,
    }));
  });

  return (
    <div className="main-menu-container">
      <h2>🎉 Victoire ! 🎉</h2>
      <p>Combat {combatNumber} terminé. Choisissez une nouvelle carte :</p>

      <div className="reward-cards">
        {rewardCards.map((card) => (
          <div
            key={card.id}
            className="reward-card"
            onClick={() => onCardSelected(card)}
            style={{ borderColor: RARITY_COLORS[card.rarity] }}
          >
            <CardDisplay card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== ÉCRAN DE GAME OVER ====================

const GameOverScreen = ({ victory, combatNumber, onBackToMenu }) => {
  const gameActions = [
    {
      id: "menu",
      label: "Retour au Menu",
      icon: "↩️",
      onSelect: onBackToMenu,
    },
  ];

  return (
    <div className="main-menu-container">
      <h2>{victory ? "🏆 VICTOIRE ! 🏆" : "💀 DÉFAITE 💀"}</h2>
      <p style={{ fontSize: "1.2em", margin: "20px 0" }}>
        {victory
          ? `Félicitations ! Vous avez terminé les ${combatNumber} combats !`
          : `Vous avez été vaincu au combat ${combatNumber}.`}
      </p>
      <GameMenu items={gameActions} enableHapticFeedback={true} />
    </div>
  );
};

// ==================== APP PRINCIPALE ====================

const App = () => {
  const [gameState, setGameState] = useState("menu");
  const [currentCombat, setCurrentCombat] = useState(1);
  const [playerCard, setPlayerCard] = useState(null);
  const [enemyCard, setEnemyCard] = useState(null);

  const { isGamepadConnected } = useGamepadNavigation({
    itemCount: 0,
  });

  const startNewRun = () => {
    const startCard = {
      ...CARD_DATABASE[0],
      currentHp: CARD_DATABASE[0].maxHp,
    };
    setPlayerCard(startCard);
    setCurrentCombat(1);
    startCombat(startCard, 1);
  };

  const startCombat = (pCard, combatNum) => {
    const enemy = generateEnemy(combatNum);
    setEnemyCard(enemy);
    setGameState("combat");
  };

  const handleCombatEnd = ({ victory, playerCard: updatedPlayerCard }) => {
    if (!victory) {
      setGameState("gameover");
      return;
    }

    setPlayerCard(updatedPlayerCard);

    if (currentCombat >= 5) {
      setGameState("gameover");
    } else {
      setGameState("reward");
    }
  };

  const handleCardSelected = (newCard) => {
    const updatedCard = {
      ...newCard,
      currentHp: playerCard.currentHp,
    };
    setPlayerCard(updatedCard);

    const nextCombat = currentCombat + 1;
    setCurrentCombat(nextCombat);
    startCombat(updatedCard, nextCombat);
  };

  const handleBackToMenu = () => {
    setGameState("menu");
    setCurrentCombat(1);
    setPlayerCard(null);
    setEnemyCard(null);
  };

  return (
    <div className="game-screen">
      <GlobalStyles />

      <h1>🎲 Dices and Cards 🃏</h1>
      {isGamepadConnected && (
        <p style={{ color: "lime", fontSize: "0.9em" }}>
          🎮 Manette connectée et prête !
        </p>
      )}

      {gameState === "menu" && (
        <MainMenu setGameState={setGameState} startNewRun={startNewRun} />
      )}

      {gameState === "combat" && (
        <CombatScreen
          playerCard={playerCard}
          enemyCard={enemyCard}
          onCombatEnd={handleCombatEnd}
          combatNumber={currentCombat}
        />
      )}

      {gameState === "reward" && (
        <RewardScreen
          onCardSelected={handleCardSelected}
          combatNumber={currentCombat}
        />
      )}

      {gameState === "gameover" && (
        <GameOverScreen
          victory={currentCombat > 5}
          combatNumber={currentCombat}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;
