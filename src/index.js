
/** @const {!vec3} */
const cameraTarget = vec3.fromValues(0, 0, 0);

/** @const {!vec3} */
const preferredCameraPosition = vec3.fromValues(0, 0, 0);

/** @const {!vec3} */
const lightPosition = vec3.fromValues(200, 400, -32);

// 4 geometry types:
const cubeGeometry = buildRoundedCube(1, 2);
const sphereGeometry = buildRoundedCube(21, 1);
buffers.push(
    new BufferSet(STATIC_DRAW, cubeGeometry, 200000),
    new BufferSet(STATIC_DRAW, sphereGeometry, 1000),
    new BufferSet(DYNAMIC_DRAW, cubeGeometry, 4000),
    new BufferSet(DYNAMIC_DRAW, sphereGeometry, 2000),
);

const entities = /** @const {!Array.<!GameEntity>} */ ([]);
const player = new Hero();

/**
 * Current camera distance.
 * @type {number}
 */
const cameraDistance = 52;

/**
 * Number of coins collected by the player.
 * @type {number}
 */
let coins = 0;

/**
 * Number of coins available in the level.
 */
let availableCoins = 0;

/**
 * Timestamp of the last coin.
 * This is used to reset the coin sound effect sequence.
 * @type {number}
 */
let lastCoinTime = 0;

/**
 * How many coins in the sequence.
 * Resets if no coins for one second.
 * @type {number}
 */
let coinSequence = 0;

/**
 * Never called.
 * Keeps eslint happy.
 */
function throwaway() {
  gameState = GameState.PLAYING;
  coins++;
  availableCoins++;
  lastCoinTime++;
  coinSequence++;
}

/**
 * Current level.
 * @type {number}
 */
let level = 0;

/**
 * Time of last engine burst.
 * This is used in opening cinematic to control engine animations.
 * @type {number}
 */
let lastEngineBurst = 0;

/**
 * Game state enum.
 * @enum {number}
 */
const GameState = {
  WAITING_FOR_FIRST_CLICK: 0,
  INTRO_STORY1: 1,
  INTRO_STORY2: 2,
  BEFORE_LEVEL: 3,
  PLAYING: 4,
  AFTER_LEVEL: 5,
  MAIN_MENU: 99,
  CREDITS: 100,
};

/**
 * Global game state.
 * @type {!GameState}
 */
let gameState = GameState.WAITING_FOR_FIRST_CLICK;

initGame();
registerSong('Milky Way by Ben Prunty', milkyWaySong);

/**
 * Sets the current level.
 * @param {number} l
 */
function setLevel(l) {
  level = l;
}

/**
 * Camera flies over the city.
 */
const flyoverCamera = () => {
  const theta = 0.2 * time;
  const rho = 0.05 * time;
  const radius = 50 + 20 * Math.sin(0.2 * time);
  const x = radius * Math.sin(rho) * Math.sin(theta);
  const y = radius * Math.abs(Math.cos(rho));
  const z = radius * Math.sin(rho) * Math.cos(theta);
  vec3.set(camera.source, x, y, z);
};

/**
 * Updates game state.
 */
function update() {
  updateWorld();

  if (menu !== mainMenu && isKeyPressed(KEY_ESCAPE)) {
    resetKeys();
    setMenu(mainMenu);
    playMenuBeep();
  }

  if (menu) {
    drawMenu();
  } else {
    handleInput();
    drawHud();
  }

  if (DEBUG) {
    drawDebugOverlay();
  }

  if (gameState === GameState.CREDITS) {
    player.yaw = 0;
    player.jetpack = true;
    vec3.lerp(camera.source, camera.source, vec3.fromValues(0, 50, -15), 0.01);
    vec3.lerp(player.pos, player.pos, vec3.fromValues(0, 80, 0), 0.01);
    vec3.set(player.velocity, 0, 0, 0);
    lookAt(camera, camera.source, vec3.fromValues(player.pos[0], player.pos[1] + 15, player.pos[2]), 0.4);
    createJetpackParticles();
  } else if (gameState === GameState.AFTER_LEVEL) {
    // After level success
    player.yaw += 5 * dt;
    player.jetpack = true;
    vec3.lerp(camera.source, camera.source, vec3.fromValues(0, 90, -25), 0.01);
    vec3.lerp(player.pos, player.pos, vec3.fromValues(0, 80, 0), 0.01);
    vec3.set(player.velocity, 0, 0, 0);
    cameraTarget[0] = player.pos[0];
    cameraTarget[1] = player.pos[1] + 2;
    cameraTarget[2] = player.pos[2];
    lookAt(camera, camera.source, cameraTarget, 0.4);
    createJetpackParticles();
  } else if (gameState === GameState.BEFORE_LEVEL || gameState === GameState.PLAYING) {
    // Normal gameplay mode
    lightSource[0] = player.pos[0] + 8;
    lightSource[1] = 80;
    lightSource[2] = player.pos[2] - 16;

    cameraTarget[0] = 0.5 * 16 + 0.5 * player.pos[0];
    // cameraTarget[0] = player.pos[0];
    cameraTarget[1] = 0.9 * cameraTarget[1] + 0.1 * player.pos[1];
    cameraTarget[2] = 0.25 * 16 + 0.75 * player.pos[2];

    vec3.set(
        preferredCameraPosition,
        0.2 * 16 + 0.8 * cameraTarget[0],
        cameraTarget[1] + cameraDistance,
        (0.25 * 8 + 0.75 * cameraTarget[2]) - cameraDistance);

    camera.source[0] = preferredCameraPosition[0]; // X-position is locked
    vec3.lerp(camera.source, camera.source, preferredCameraPosition, 0.02);
    lookAt(camera, camera.source, cameraTarget, 0.4);
  } else if (gameState <= GameState.INTRO_STORY2) {
    // Camera circles the game world
    // and looks at the center
    // vec3.set(camera.source, 0, 40, -40);
    flyoverCamera();
    vec3.set(cameraTarget, 0, 0, 0);
    lookAt(camera, camera.source, cameraTarget, 0.4);

    // Force player off screen
    player.pos[1] = 400;
    player.velocity[1] = 0;

    if (time - lastEngineBurst > 0.08) {
      lastEngineBurst = time;

      const leftBurst = new Particle();
      const rightBurst = new Particle();
      leftBurst.size = rightBurst.size = 0.25;
      leftBurst.color = rightBurst.color = 0xFFFF0030;
      vec3.set(leftBurst.pos, -6, 0.3, 0.7);
      vec3.set(leftBurst.velocity, -10, 0, 0);
      vec3.set(rightBurst.pos, -6, 0.3, -0.7);
      vec3.set(rightBurst.velocity, -10, 0, 0);
      entities.push(leftBurst, rightBurst);
    }
  }

  // lookAt(lightSource, lightPosition, cameraTarget, 0.1);
  lookAt(lightSource, lightPosition, vec3.fromValues(16, 0, 16), 0.1);
  renderEntities(entities);
}

/**
 * Returns true if the entity is within "range" of the player.
 * This is a fast check if the entity is within ~20 meters of the player.
 * Note that it uses manhattan distance rather than true distance for performance.
 * @param {!GameEntity} entity
 * @return {boolean}
 */
function inRangeOfPlayer(entity) {
  return entity.pos[0] > player.pos[0] - 20 &&
    entity.pos[0] < player.pos[0] + 20 &&
    entity.pos[2] > player.pos[2] - 15 &&
    entity.pos[2] < player.pos[2] + 40;
}

/**
 * Renders an array of game entities to the dynamic buffer.
 * @param {!Array.<!GameEntity>} entities
 */
function renderEntities(entities) {
  resetLights();
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    if (entity !== player && entity.health <= 0) {
      entities.splice(i, 1);
      continue;
    }
    if (entity.rendered) {
      entity.setupTransformMatrix();
      entity.render();
    }
  }
}

/**
 * Player died.
 */
function playerDie() {
  playMusic(deathSongData);
  stopJetpackSound();
  setMenu(deathScreen);
}

/**
 * Handles player input.
 */
function handleInput() {
  player.accelerating = false;

  if (gameState !== GameState.AFTER_LEVEL && gameState !== GameState.CREDITS) {
    if (isKeyDown(KEY_UP) || isKeyDown(KEY_W)) {
      player.velocity[2] += dt * ACCELERATION;
      player.accelerating = true;
    }
    if (isKeyDown(KEY_DOWN) || isKeyDown(KEY_S)) {
      player.velocity[2] -= dt * ACCELERATION;
      player.accelerating = true;
    }
    if (isKeyDown(KEY_LEFT) || isKeyDown(KEY_A)) {
      player.velocity[0] -= dt * ACCELERATION;
      player.accelerating = true;
    }
    if (isKeyDown(KEY_RIGHT) || isKeyDown(KEY_D)) {
      player.velocity[0] += dt * ACCELERATION;
      player.accelerating = true;
    }
    if ((isKeyDown(KEY_X) || isKeyDown(KEY_SHIFT)) && player.fuel > 0) {
      // Jetpack
      player.velocity[1] += dt * 60;
      player.jetpack = true;
      player.fuel = Math.max(0, player.fuel - dt * 20);
      createJetpackParticles();
    } else {
      player.jetpack = false;
    }
    if (player.jetpack && !jetpackSound) {
      startJetpackSound();
    }
    if (!player.jetpack && jetpackSound) {
      stopJetpackSound();
    }
    if (player.isGrounded() && (keys[KEY_Z].downCount === 1 || keys[KEY_SPACE].downCount === 1)) {
      player.jump();
    }
    if (isKeyPressed(KEY_R)) {
      playerDie();
    }
    if (isKeyPressed(KEY_M)) {
      toggleBackgroundMusic();
    }
  }
}

/**
 * Creates jetpack particles.
 */
function createJetpackParticles() {
  if (Math.random() < 0.3) {
    const blast = new Particle();
    blast.size = 0.2;
    blast.velocity[1] = (gameState === GameState.AFTER_LEVEL || gameState === GameState.CREDITS) ? -10 : -0.3;
    vec3.copy(blast.pos, player.pos);
    blast.pos[0] -= 0.3 * Math.sin(player.yaw);
    blast.pos[1] += 0.8;
    blast.pos[2] -= 0.3 * Math.cos(player.yaw);
    entities.push(blast);
  }
}

/**
 * Updates everything.
 */
function updateWorld() {
  if (Math.random() < 0.02) {
    const floaty = new Particle();
    floaty.size = 0.08;
    floaty.velocity[1] = 1;
    vec3.copy(floaty.pos, player.pos);
    floaty.pos[0] += (Math.random() - 0.5) * 30.0;
    floaty.pos[2] += (Math.random() - 0.5) * 30.0;
    entities.push(floaty);
  }

  if (gameTime - lastCoinTime > 1.0) {
    coinSequence = 0;
  }

  for (let i = 0; i < entities.length; i++) {
    entities[i].update();
  }

  const playerWasAlive = player.health > 0;

  for (let i = 0; i < entities.length; i++) {
    for (let j = 0; j < entities.length; j++) {
      if ((entities[i] instanceof Platform) && !(entities[j] instanceof Platform)) {
        const platform = /** @type {!Platform} */ (entities[i]);
        const actor = entities[j];
        // Need actor size
        // Assume actor is a cylinder
        // Assume radius 1.0 and height 3.0
        // actor.pos represents center of feet
        const actorX = actor.pos[0];
        const actorY = actor.pos[1];
        const actorZ = actor.pos[2];
        const projectile = actor instanceof Particle && actor.projectile > 0;
        const actorRadius = projectile ? 0.1 : 0.7;
        const actorHeight = projectile ? 0.1 : 2.5;

        const platformMinX = platform.pos[0] - platform.scale[0] - actorRadius;
        const platformMinY = platform.pos[1] - platform.scale[1];
        const platformMinZ = platform.pos[2] - platform.scale[2] - actorRadius;

        const platformMaxX = platform.pos[0] + platform.scale[0] + actorRadius;
        const platformMaxY = platform.pos[1] + platform.scale[1];
        const platformMaxZ = platform.pos[2] + platform.scale[2] + actorRadius;

        const graceY = 1.0;

        if (actorX > platformMinX && actorX < platformMaxX && actorZ > platformMinZ && actorZ < platformMaxZ) {
          if (projectile && actorY < platformMaxY && actorY > platformMinY) {
            // Destroy the projectile
            actor.health = 0;
          } else if (actorY > platformMaxY - graceY && actorY < platformMaxY) {
            // Put the actor on top of the platform
            actor.pos[1] = platformMaxY;
            if (actor.velocity[1] < 0) {
              actor.velocity[1] = 0;
              actor.groundedTime = gameTime;
              actor.groundedPlatform = platform;
            }
          } else if (actorY < platformMaxY && actorY + actorHeight > platformMinY) {
            // Determine which edge to use
            // Push the actor away from the platform
            if (actorX < platform.pos[0] - platform.scale[0]) {
              actor.pos[0] = platformMinX;
            } else if (actorX > platform.pos[0] + platform.scale[0]) {
              actor.pos[0] = platformMaxX;
            } else if (actorZ < platform.pos[2] - platform.scale[2]) {
              actor.pos[2] = platformMinZ;
            } else {
              actor.pos[2] = platformMaxZ;
            }
          }
        }
      }

      vec3.copy(tempVec, player.pos);
      tempVec[1] += 1;
      if (entities[i] instanceof Hero &&
        entities[j] instanceof Particle &&
        (/** @type {!Particle} */ (entities[j])).projectile === ProjectileType.Enemy &&
        vec3.distance(tempVec, entities[j].pos) < 1.5 &&
        gameState === GameState.PLAYING) {
        player.health = 0;
        player.rendered = false;
        entities[j].health = 0;

        playExplosionSound();
        createExplosion(player.pos, COLOR_WHITE);
      }
    }
  }

  updateEntity(player);

  if (playerWasAlive && player.health <= 0) {
    playerDie();
  }
}

/**
 * Creates an explosion.
 * @param {!vec3} startPos
 * @param {number=} color
 * @param {number=} count
 */
function createExplosion(startPos, color = COLOR_WHITE, count = 40) {
  log('Create explosion');
  for (let k = 0; k < count; k++) {
    const explosion = new Particle();
    vec3.copy(explosion.pos, startPos);
    explosion.pos[1] += 1.0;
    explosion.color = color;
    explosion.size = 0.4;
    const speed = 0.2 + Math.random() * 5.0;
    const direction = Math.random() * 6.28;
    explosion.velocity[0] = Math.sin(direction) * speed;
    explosion.velocity[1] = 2;
    explosion.velocity[2] = Math.cos(direction) * speed;
    explosion.acceleration[1] = -0.5;
    entities.push(explosion);
  }
}

/**
 * Updates a game entity for the frame.
 * @param {!GameEntity} entity
 */
function updateEntity(entity) {
  if (entity.isGrounded() && entity.groundedPlatform) {
    // Move the player with the platform
    vec3.scaleAndAdd(entity.pos, entity.pos, entity.groundedPlatform.velocity, dt);
  }

  entity.velocity[0] *= (1.0 - dt * FRICTION);
  entity.velocity[2] *= (1.0 - dt * FRICTION);

  entity.pos[0] += dt * entity.velocity[0];
  entity.pos[2] += dt * entity.velocity[2];

  const speed = vec3.magnitude(entity.velocity);
  if (vec3.magnitude(entity.velocity) > 0.1) {
    entity.yaw = Math.atan2(entity.velocity[0], entity.velocity[2]);
  } else {
    vec3.set(entity.velocity, 0, 0, 0);
  }

  if (gameState === GameState.CREDITS) {
    player.yaw = 0;
    if (Math.random() < 0.5) {
      const box = new Mystery(
          (Math.random() < 0.5 ? -1 : 1) * (10 + 40 * Math.random()), 600, (Math.random() < 0.5 ? -1 : 1) * (10 + 40 * Math.random()),
          2 + 2 * Math.random(), 4 + 20 * Math.random(), 2 + 2 * Math.random());
      box.velocity[1] = -100 - 400 * Math.random();
      entities.push(box);
    }
  } else if (gameState !== GameState.AFTER_LEVEL) {
    const gravity = GRAVITY;
    entity.velocity[1] -= dt * gravity;
    entity.pos[1] += dt * entity.velocity[1];
  }

  if (entity.isGrounded() && speed > 5 && Math.random() < 0.2) {
    const dust = new Particle();
    dust.velocity[1] = 0.1;
    vec3.copy(dust.pos, entity.pos);
    entities.push(dust);
  }

  if (entity.pos[1] < -30) {
    entity.pos[1] = -30;
    entity.health = 0;
  }
}

const bestTimesStr = localStorage['callisto-times'];
const bestTimes = bestTimesStr ? JSON.parse(bestTimesStr) : [];
