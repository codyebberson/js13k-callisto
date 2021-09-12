
// Use a clean RNG based on the current level.
const rng = new RNG(1);

/**
 * Level descriptors.
 * @const {!Array.<!Function>}
 */
const levelDefinitions = [
  () => {
    log('Openening scene');
    entities.push(new Spaceship());
  },
  () => {
    log('Level 1 - Intro level');

    // z = 0-12
    createMetalPlatform(4, 0, 0, 32, 4, 4); // 1st platform
    createCoins(14, 5, 2, 4, 0, 3);
    createMetalPlatform(28, 0, 4, 32, 4, 8); // Short connector
    createLift(30, 3, 10, 30, 8, 10);

    // z = 12-24
    createMetalPlatform(0, 4, 12, 32, 8, 16); // 2nd platform
    createCoins(14, 9, 14, 4, 0, 3);
    createMetalPlatform(0, 4, 16, 4, 8, 20); // Short connector
    createLift(2, 12, 22, 2, 7, 22);

    // z = 24-36
    createMetalPlatform(0, 8, 24, 16, 12, 28); // 3rd platform
    createMetalPlatform(16, 8, 24, 32, 10, 28); // 3rd platform
    const alien = new Alien();
    alien.aggroRange = 0;
    vec3.set(alien.pos, 18, 10, 26);
    alien.waypoints = [
      vec3.fromValues(17, 10, 26),
      vec3.fromValues(27, 10, 26),
    ];
    entities.push(alien);
    entities.push(new Flagpole(30, 10, 26));
    vec3.set(player.pos, 6, 4, 2);
  },
  () => {
    log('Level 2 - Maze level');
    createMetalPlatform(12, 3.5, 0, 20, 4.5, 8); // Starting platform, z=0..8
    createMetalPlatform(0, 4, 8, 32, 5, 12); // First long platform, z=8..12
    createMetalPlatform(8, 4.5, 12, 12, 5.5, 16); // First connector, z=12..16
    createMetalPlatform(0, 5, 16, 32, 6, 20); // Second long platform, z=16..20
    createMetalPlatform(20, 5.5, 20, 24, 6.5, 24); // Second connector, z=20..24
    createMetalPlatform(0, 6, 24, 32, 7, 28); // Third platform, z=24..28

    createCoins(2, 6, 10, 28, 0, 2);
    createCoins(2, 7, 18, 28, 0, 2);
    createCoins(10, 8, 26, 4, 0, 4);

    const alien1 = new Alien(4, 5, 10);
    alien1.aggroRange = 0;
    alien1.waypoints = [vec3.fromValues(4, 5, 10), vec3.fromValues(28, 5, 10)];
    entities.push(alien1);

    const alien2 = new Alien(4, 6, 18);
    alien2.aggroRange = 0;
    alien2.waypoints = [vec3.fromValues(4, 6, 18), vec3.fromValues(28, 6, 18)];
    entities.push(alien2);

    vec3.set(player.pos, 16, 4, 2);
    entities.push(new Flagpole(2, 7, 26));
  },
  () => {
    log('Level 3 - Lotsa lifts');
    createMetalPlatform(0, 0, 0, 4, 4, 36); // Starting platform, x=0..4
    createMetalPlatform(32, 0, 0, 36, 4, 36); // Ending platform, x=32..36
    entities.push(new Fuel(2, 5, 30, 50)); // Fuel for the brave

    for (let x = 6; x <= 30; x += 4) {
      const lift = createLift(x, 3, 16, x, 10, 16);
      lift.pos[1] = ((x * 2) % 11);
    }

    createCoins(6, 12, 16, 4, 0, 7);

    vec3.set(player.pos, 2, 4, 16);
    entities.push(new Flagpole(34, 4, 16));
  },
  () => {
    log('Level 4 - Four Corners');

    const createCorner = (x, y, z) => {
      createMetalPlatform(x, y, z, x + 12, y + 4, z + 12);
      if (x !== 0 || z !== 0) {
        entities.push(new Coin(x + 2, y + 4, z + 2));
      }
      entities.push(new Coin(x + 10, y + 4, z + 2));
      entities.push(new Coin(x + 10, y + 4, z + 10));
      entities.push(new Coin(x + 2, y + 4, z + 10));

      if (y > 0) {
        const alien1 = new Alien(x + 2, y + 4, z + 2);
        alien1.aggroRange = 0;
        alien1.acceleration = 50;
        alien1.waypoints = [
          vec3.fromValues(x + 2, y + 4, z + 2),
          vec3.fromValues(x + 10, y + 4, z + 2),
          vec3.fromValues(x + 10, y + 4, z + 10),
          vec3.fromValues(x + 2, y + 4, z + 10),
        ];
        entities.push(alien1);
      }
    };

    createCorner(0, 0, 0); // Southwest
    entities.push(new Fuel(6, 5, 6, 20));
    vec3.set(player.pos, 1, 5, 1);

    createCorner(20, 4, 0); // Southeast
    entities.push(new Fuel(26, 9, 6, 20));

    createCorner(20, 8, 20); // Northeast
    entities.push(new Fuel(26, 13, 26, 20));

    createCorner(0, 12, 20); // Northwest
    entities.push(new Flagpole(6, 16, 26));
  },
  () => {
    log('Level 5 - The Pit');

    // Starting platform
    createMetalPlatform(0, 0, 0, 32, 4, 32);
    createMetalPlatform(0, 4, 0, 32, 8, 4); // South ridge
    createMetalPlatform(0, 4, 28, 32, 12, 32); // North ridge
    createMetalPlatform(0, 4, 4, 4, 10, 28); // West ridge
    createMetalPlatform(28, 4, 4, 32, 8, 28); // East ridge
    vec3.set(player.pos, 30, 8, 2);

    for (let z = 10; z <= 26; z += 4) {
      const alien1 = new Alien(z, 4, z);
      alien1.color = COLOR_ORANGE;
      alien1.aggroRange = 12;
      alien1.acceleration = 50;
      alien1.waypoints = [
        vec3.fromValues(22, 4, z),
        vec3.fromValues(10, 4, z),
      ];
      entities.push(alien1);
    }

    createLift(6, 4, 26, 6, 15, 26);
    createCoins(6, 5, 10, 0, 4, 4);
    createCoins(26, 5, 10, 0, 4, 4);
    createCoins(10, 13, 30, 4, 0, 4);
    entities.push(new Flagpole(30, 12, 30));
  },
  () => {
    log('Level 6 - Moat and Castle');

    // Base floor
    createMetalPlatform(0, 0, 0, 32, 1, 32);
    vec3.set(player.pos, 26, 2, 16);

    createMetalPlatform(0, 0, 28, 32, 6, 32); // North wall

    // Stairs to Northwest pillar
    for (let i = 0; i < 10; i++) {
      createMetalPlatform(4, 1, 18 + i, 8, 1 + i / 2, 19 + i);
    }

    createLift(2, 5, 26, 2, 5, 6); // Northwest to Southwest
    createCoins(2, 7, 10, 0, 4, 4);

    createMetalPlatform(0, 0, 0, 4, 6, 4); // Southwest
    createLift(26, 5, 2, 6, 5, 2); // Southeast to Southwest
    createCoins(10, 7, 2, 4, 0, 4);

    createMetalPlatform(28, 0, 0, 32, 6, 4); // Southeast
    createLift(30, 5, 26, 30, 5, 6); // Southeast to Northeast
    createCoins(30, 7, 10, 0, 4, 4);

    createMetalPlatform(8, 0, 16, 24, 6, 32); // Dock

    // Stairs to aliens and flagpole
    for (let i = 0; i < 12; i++) {
      createMetalPlatform(23 - i, 1, 16, 24 - i, 6 + i / 2, 20);
    }

    createMetalPlatform(8, 1, 16, 12, 12, 20); // Top of stairs
    createMetalPlatform(8, 1, 20, 20, 12, 32); // Top of stairs
    entities.push(new Flagpole(14, 12, 26));

    const waypoints = [
      vec3.fromValues(10, 12, 30),
      vec3.fromValues(18, 12, 30),
      vec3.fromValues(18, 12, 22),
      vec3.fromValues(10, 12, 22),
    ];

    for (let i = 0; i < 4; i++) {
      const alien1 = new Alien(waypoints[i][0], waypoints[i][1], waypoints[i][2]);
      alien1.aggroRange = 0;
      alien1.waypoints = waypoints;
      alien1.waypointIndex = i;
      entities.push(alien1);
    }
  },
  () => {
    log('Level 7 - Firing Squad');

    // Starting platform
    createMetalPlatform(0, 0, 0, 32, 4, 32);

    for (let z = 4; z <= 28; z += 8) {
      for (let x = 4; x <= 28; x += 8) {
        entities.push(new Coin(x, 5, z));
      }
    }

    vec3.set(player.pos, 16, 5, 2);

    let nextShootTime = 0.0;

    for (let x = 4; x <= 28; x += 8) {
      entities.push(new Shooter(x, 5, 34, Math.PI, (nextShootTime += 0.5)));
    }

    for (let z = 4; z <= 28; z += 8) {
      let x = -2;
      let yaw = Math.PI / 2;
      if (((z - 4) / 8) % 2 !== 0) {
        x = 34;
        yaw = -yaw;
      }
      entities.push(new Shooter(x, 5, z, yaw, (nextShootTime += 0.5)));
    }

    entities.push(new Flagpole(16, 4, 16));
  },
  () => {
    log('Level 8 - Pyramid');

    createMetalPlatform(0, 0, 0, 32, 4, 32);
    createMetalPlatform(4, 4, 8, 28, 8, 32);
    createMetalPlatform(8, 8, 16, 24, 12, 32);
    createMetalPlatform(12, 12, 24, 20, 16, 32);

    createMetalPlatform(0, 4, 28, 4, 4.7, 32);
    createLift(2, 4.5, 30, 2, 8, 30); // Ground to level 2
    createMetalPlatform(24, 8, 28, 28, 8.7, 32);
    createLift(26, 8.5, 30, 26, 12, 30); // Level 2 to level 3
    createMetalPlatform(8, 12, 28, 12, 12.7, 32);
    createLift(10, 12.5, 30, 10, 16, 30); // Level 3 to level 4

    // Level 2 Shooters
    entities.push(new Shooter(-2, 9, 10, Math.PI / 2, 0.5));
    entities.push(new Shooter(-2, 9, 14, Math.PI / 2, 0.5));

    // Level 3 Shooters
    entities.push(new Shooter(-2, 13, 18, Math.PI / 2, 1.0));
    entities.push(new Shooter(-2, 13, 22, Math.PI / 2, 1.0));
    entities.push(new Shooter(34, 13, 18, -Math.PI / 2, 1.5));
    entities.push(new Shooter(34, 13, 22, -Math.PI / 2, 1.5));

    // Ground grunt
    const alien1 = new Alien(30, 4, 30);
    alien1.color = COLOR_ORANGE;
    alien1.aggroRange = 12;
    alien1.acceleration = 80;
    alien1.waypoints = [
      vec3.fromValues(30, 4, 30),
      vec3.fromValues(30, 4, 16),
    ];
    entities.push(alien1);

    createCoins(30, 5, 2, 0, 4, 4);

    vec3.set(player.pos, 16, 4, 2);
    entities.push(new Flagpole(16, 16, 30));
  },
  () => {
    log('Level 9 - Spires of Kodo');
    vec3.set(player.pos, 16, 4, 2);

    // Starting platform
    createMetalPlatform(0, 0, 0, 32, 4, 32);

    // Spire 1
    createMetalPlatform(0, 4, 24, 8, 32, 32);
    createMetalPlatform(4, 4, 20, 8, 4.7, 24);
    createLift(6, 4.5, 22, 6, 15, 22);
    createLift(2, 24, 22, 2, 13.5, 22);
    createLift(6, 22.5, 22, 6, 33, 22);
    createCoins(2, 33, 26, 4, 0, 2);
    createCoins(2, 33, 30, 4, 0, 2);

    // Spire 2
    createMetalPlatform(24, 4, 24, 32, 32, 32);
    createLift(10, 31.5, 30, 22, 31.5, 30);
    createLift(22, 31.5, 26, 10, 31.5, 26);
    createCoins(26, 33, 26, 4, 0, 2);
    createCoins(26, 33, 30, 4, 0, 2);

    // Spire 3
    createMetalPlatform(24, 4, 0, 32, 32, 8);
    createLift(26, 31.5, 10, 26, 31.5, 22);
    createLift(30, 31.5, 22, 30, 31.5, 10);
    createCoins(26, 33, 2, 4, 0, 2);
    createCoins(26, 33, 6, 4, 0, 2);
    entities.push(new Flagpole(28, 32, 4));
  },
  () => {
    log('Level 10 - Kang');

    // Starting platform
    createMetalPlatform(0, 0, 0, 32, 4, 8);
    createMetalPlatform(0, 4, 4, 8, 8, 8);

    // First lift
    createLift(30, 3.5, 10, 30, 11.5, 10);

    for (let y = 10; y <= 42; y += 16) {
      // East platform
      createMetalPlatform(28, y, 12, 32, y + 2, 32);
      createCoins(30, y + 3, 18, 0, 4, 3);
      entities.push(new Fuel(30, y + 3, 30, 100));

      // West platform
      createMetalPlatform(0, y + 8, 12, 4, y + 10, 32);
      createCoins(2, y + 11, 18, 0, 4, 3);
      entities.push(new Fuel(2, y + 11, 30, 100));
    }

    // Last platform
    entities.push(new Flagpole(2, 52, 14));

    entities.push(new Kang());
    vec3.set(player.pos, 2, 4, 2);
  },
  () => {
    log('Level 11 - credits');
    gameState = GameState.CREDITS;
  },
];

/**
 * Creates a platform.
 * 1) Makes all of the contained voxels solid.
 * 2) Adds the static geometry.
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} x2
 * @param {number} y2
 * @param {number} z2
 * @param {number} color
 */
const createPlatform = (x1, y1, z1, x2, y2, z2, color) => {
  const platform = new Platform();
  vec3.set(platform.pos, (x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
  vec3.set(platform.scale, (x2 - x1) / 2, (y2 - y1) / 2, (z2 - z1) / 2);
  entities.push(platform);
};

/**
 * Creates a grassy platform.
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} x2
 * @param {number} y2
 * @param {number} z2
 * @param {boolean=} goombas
 */
const createMetalPlatform = (x1, y1, z1, x2, y2, z2, goombas) => {
  createPlatform(x1, y1, z1, x2, y2, z2, COLOR_SILVER);

  for (let x = x1 + 2; x < x2; x += 4) {
    for (let z = z1 + 2; z < z2; z += 4) {
      const m = buffers[STATIC_CUBES].addInstance(COLOR_DARK_BLUE);
      mat4.translate(m, m, vec3.fromValues(x, y2 + 0.01, z));
      mat4.scale(m, m, vec3.fromValues(1.8, 0.02, 1.8));
    }
  }

  const dx = x2 - x1;
  const dz = z2 - z1;

  // Add goombas
  if (goombas) {
    for (let i = 0; i < dx * dz * 0.01; i++) {
      const x = x1 + 0.5 + rng.nextFloat() * (dx - 1.0);
      const z = z1 + 0.5 + rng.nextFloat() * (dz - 1.0);
      const alien = new Alien();
      vec3.set(alien.pos, x, y2, z);
      entities.push(alien);
    }
  }
};

/**
 * Creates a lift.
 * Vertical moving platform.
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} x2
 * @param {number} y2
 * @param {number} z2
 * @return {!Platform}
 */
const createLift = (x1, y1, z1, x2, y2, z2) => {
  const platform = new Platform();
  vec3.set(platform.pos, x1, y1, z1);
  vec3.set(platform.scale, 2, 0.3, 2);
  platform.waypoints = [
    vec3.fromValues(x1, y1, z1),
    vec3.fromValues(x2, y2, z2),
  ];
  entities.push(platform);
  return platform;
};

/**
 * Creates a row of coins.
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} dx
 * @param {number} dz
 * @param {number} count
 */
const createCoins = (x1, y1, z1, dx, dz, count) => {
  let x = x1;
  let z = z1;
  for (let i = 0; i < count; i++) {
    const coin = new Coin();
    vec3.set(coin.pos, x, y1, z);
    entities.push(coin);
    x += dx;
    z += dz;
  }
};

/**
 * Creates a stairway.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} dx
 * @param {number} dz
 * @param {number} count
 */
const createStairs = (x, y, z, dx, dz, count) => {
  for (let i = 0; i < count; i++) {
    createPlatform(x, y, z, x + 4, y + 1, z + 4, COLOR_SILVER);
    x += dx;
    y++;
    z += dz;
  }
};

/**
 * Initialize the game.
 */
function initGame() {
  // Clear any existing static geometry
  buffers.forEach((b) => b.usage === STATIC_DRAW && b.resetBuffers());

  // Clear any existing entities
  entities.length = 0;

  // Reset the player
  vec3.set(player.pos, 16, 4, 16);
  vec3.set(player.velocity, 0, 0, 0);
  player.rendered = true;
  player.jetpack = false;
  player.health = 1;
  player.fuel = 0;
  player.yaw = 3.0;
  player.groundedTime = 0;
  player.shootTime = 0;
  coins = 0;
  lastCoinTime = 0;
  coinSequence = 0;
  entities.push(player);
  stopJetpackSound();

  // Sky box
  {
    const m = buffers[STATIC_CUBES].addInstance(COLOR_STARS);
    mat4.scale(m, m, vec3.fromValues(500, 500, 500));
  }

  // Level definition
  const levelDef = levelDefinitions[level % levelDefinitions.length];
  levelDef();

  // entities.forEach(e => i)
  availableCoins = entities.filter((e) => e instanceof Coin).length;
  buffers.forEach((b) => b.usage === STATIC_DRAW && b.updateBuffers());
}
