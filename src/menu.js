
const introText = [,
  [
    [
      // Intro Story 1
      'OUR HERO, CAPTAIN CALLISTO, BLASTS THROUGH SPACE',
      'SEEKING ADVENTURE',
    ],
  ],
  [
    [
      // Intro Story 2
      'APPROACHING THE ZETA AIR FORTRESS',
      'BEWARE: SENSORS SHOW SIGNS OF LIFE',
    ],
  ],
  [,
    [
      // Level 1
      'COLLECT ALL TREASURE AND',
      'REACH THE TRANSPORTER TO PROCEED',
    ],
    [
      // Level 2
      'THE PATH IS TREACHEROUS',
      'PROCEED WITH CAUTION',
    ],
    [
      // Level 3
      'THERE\'S MORE THAN ONE WAY TO SKIN A WOMP RAT',
      '',
    ],
    [
      // Level 4
      'MORE ALIEN ACTIVITY THAN EXPECTED',
      'PROCEED WITH CAUTION',
    ],
    [
      // Level 5
      'WE ARE DEEP INTO ALIEN TERRITORY',
      'HIGH ALERT',
    ],
    [
      // Level 6
      'EVIDENCE OF COMPLEX CIVILIZATION',
      'DO NOT UNDERESTIMATE THE ENEMY',
    ],
    [
      // Level 7
      'ALIEN DEFENSES ARRIVED',
      'WATCH OUT FOR MISSILES',
    ],
    [
      // Level 8
      'CLIMB THE GREAT PYRAMID',
      'TREASURE AWAITS',
    ],
    [
      // Level 9
      'THE GREAT SPIRES OF KODOS',
      'WE MUST BE NEAR!',
    ],
    [
      // Level 10
      'THE INNER SANCTUM!  THE GREAT KANG!',
      'YOU ARE DOOMED!',
    ],
  ],
  [
    [
      // Level failed
      'OH NO!',
      'TRY AGAIN!',
    ],
  ],
];

/**
 * @typedef {{
  *            callback:!Function
  *          }}
  */
let Menu;

/**
 * Level intro screen.
 * Show current level and player details.
 * @return {!Menu}
 */
const levelIntro = () => ({
  callback: () => {
    gameState = GameState.PLAYING;
    gameTime = 0;
    setMenu(null);
  },
});

/**
 * Death screen.
 * Show a sad message.
 * @const {!Menu}
 */
const deathScreen = {
  callback: () => {
    gameState = GameState.BEFORE_LEVEL;
    showLevelIntro();
  },
};

/**
 * Win screen.
 * Show a happy message.
 * @const {!Menu}
 */
const winScreen = {
  callback: () => {
    gameState = GameState.BEFORE_LEVEL;
    setLevel(level + 1);
    showLevelIntro();
  },
};

/**
 * Opening screen to get player input.
 * @const {!Menu}
 */
const clickToStart = {
  callback: () => {
    if (gameState === 0) {
      zzfxX.resume();
      if (!localStorage['music-off']) {
        playMusic(milkyWaySong, true);
      }
    }
    if (++gameState > GameState.INTRO_STORY2) {
      setLevel(1);
      showLevelIntro();
    }
  },
};

/**
 * Main menu.
 * @const {!Menu}
 */
const mainMenu = {
  callback: () => {
    log('main menu callback');
  },
};

/**
 * Main menu.
 * @const {!Menu}
 */
const levelsMenu = {
  callback: () => {
    log('levels menu callback');
  },
};

/**
 * Real world time that the menu started, in seconds.
 * Wait one second before accepting continue button.
 * @type {number}
 */
let menuStartTime = 0;

/**
 * Currently active menu.
 * Start with the intro menu.
 * @type {?Menu}
 */
let menu = clickToStart;

/**
 * Previous menu, if any.
 * @type {?Menu}
 */
let prevMenu = null;

/**
 * Current menu option.
 * @type {number}
 */
let menuY = 0;

/**
 * Sets or clears the current menu.
 * @param {?Menu} m
 */
function setMenu(m) {
  prevMenu = menu;
  menuStartTime = time;
  menu = m;
  menuY = 0;
}

/**
 * Re-initializes the game and shows the level intro screen.
 */
function showLevelIntro() {
  initGame();
  setMenu(levelIntro());
}

/**
 * Draws the current menu.
 * Also manages menu state.
 * All menus wait for at least one frame of "no press",
 * and then the next button press.
 */
const drawMenu = () => {
  if (gameState === GameState.CREDITS && menu !== mainMenu && menu !== levelsMenu) {
    menu = null;
    return;
  }

  if (gameState <= GameState.INTRO_STORY2 || menu === mainMenu || menu == levelsMenu) {
    setTextAlign(ALIGN_CENTER);
    setFontSize(24, 'italic');
    drawShadowText('THE ADVENTURES OF', CENTER_X, 60);
    setFontSize(64, 'italic');
    drawShadowText('CAPTAIN CALLISTO', CENTER_X, 120);
  }

  if (menu === mainMenu) {
    setTextAlign(ALIGN_LEFT);
    setFontSize(48, 'italic');
    drawShadowText('NEW GAME', 250, 400, menuY === 0 ? OVERLAY_YELLOW : OVERLAY_WHITE);
    drawShadowText('CONTINUE', 250, 500, menuY === 1 ? OVERLAY_YELLOW : OVERLAY_WHITE);
    drawShadowText('LEVELS', 250, 600, menuY === 2 ? OVERLAY_YELLOW : OVERLAY_WHITE);

    if (isKeyPressed(KEY_UP) || isKeyPressed(KEY_W)) {
      menuY = (menuY + 2) % 3;
      playMenuBeep();
    }
    if (isKeyPressed(KEY_DOWN) || isKeyPressed(KEY_S)) {
      menuY = (menuY + 1) % 3;
      playMenuBeep();
    }
    if (isKeyPressed(KEY_ESCAPE)) {
      resetKeys();
      setMenu(prevMenu);
      playMenuBeep();
    }
    if (isKeyPressed(KEY_ENTER) || isKeyPressed(KEY_SPACE) || isKeyPressed(KEY_Z)) {
      if (menuY === 0) {
        gameState = GameState.INTRO_STORY1;
        setLevel(0);
        initGame();
        setMenu(clickToStart);
        playMenuBeep();
      }
      if (menuY === 1) {
        setMenu(null);
        playMenuBeep();
      }
      if (menuY === 2) {
        setMenu(levelsMenu);
        playMenuBeep();
      }
    }
    return;
  }

  if (menu === levelsMenu) {
    setFontSize(32, 'italic');

    for (let i = 0; i < 10; i++) {
      setTextAlign(ALIGN_LEFT);
      drawShadowText(`LEVEL ${i + 1}`, 250, 350 + i * 60, menuY === i ? OVERLAY_YELLOW : OVERLAY_WHITE);

      const bestTime = bestTimes[i+1];
      if (bestTime) {
        setTextAlign(ALIGN_RIGHT);
        drawShadowText(`${bestTime.toFixed(1)} sec`, 600, 350 + i * 60, OVERLAY_LIGHT_GRAY);
      }
    }

    if (isKeyPressed(KEY_UP) || isKeyPressed(KEY_W)) {
      menuY = (menuY + 9) % 10;
      playMenuBeep();
    }
    if (isKeyPressed(KEY_DOWN) || isKeyPressed(KEY_S)) {
      menuY = (menuY + 1) % 10;
      playMenuBeep();
    }
    if (isKeyPressed(KEY_ESCAPE)) {
      setMenu(prevMenu);
      playMenuBeep();
    }
    if (isKeyPressed(KEY_ENTER) || isKeyPressed(KEY_SPACE) || isKeyPressed(KEY_Z)) {
      gameState = GameState.BEFORE_LEVEL;
      setLevel(menuY + 1);
      showLevelIntro();
      playMenuBeep();
    }
    return;
  }

  const canContinue = time - menuStartTime > 0.5;
  if (canContinue && anyKey.upCount === 1) {
    menu.callback();
  } else {
    if (gameState === GameState.WAITING_FOR_FIRST_CLICK) {
      setTextAlign(ALIGN_CENTER);
      setFontSize(32, 'italic');
      drawShadowText('PRESS ANY KEY TO CONTINUE', CENTER_X, HEIGHT - 90);
    } else if (gameState === GameState.AFTER_LEVEL) {
      setTextAlign(ALIGN_CENTER);
      setFontSize(64, 'italic');
      drawShadowText(`LEVEL ${level} CLEARED`, CENTER_X, 120);
      setFontSize(48, 'italic');
      drawShadowText(gameTime.toFixed(1) + ' sec', CENTER_X, 220);
      setFontSize(32, 'italic');
      drawShadowText('PRESS ANY KEY TO CONTINUE', CENTER_X, HEIGHT - 90);
    } else {
      drawRectangle(20, HEIGHT - 180, 900, 160, '#cb6', OVERLAY_BLACK);

      const index = gameState === GameState.BEFORE_LEVEL ? level : 0;

      if (DEBUG) {
        if (!introText[gameState]) {
          log('no intro text for gameState: ' + gameState);
        } else if (!introText[gameState][index]) {
          log('no intro text for level: ' + index);
        }
      }

      setTextAlign(ALIGN_LEFT);
      setFontSize(28, 'italic');
      drawText(introText[gameState][index][0], 30, HEIGHT - 165);
      drawText(introText[gameState][index][1], 30, HEIGHT - 122);

      setFontSize(20, 'italic');
      drawText('PRESS ANY KEY TO CONTINUE', 30, HEIGHT - 53);
    }
  }
};
