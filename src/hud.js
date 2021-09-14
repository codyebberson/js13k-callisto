
/**
 * Draws the game hud.
 */
function drawHud() {
  if (gameState === GameState.CREDITS) {
    setTextAlign(ALIGN_CENTER);
    setFontSize(24, 'italic');
    drawShadowText('THE ADVENTURES OF', CENTER_X, 60);
    setFontSize(64, 'italic');
    drawShadowText('CAPTAIN CALLISTO', CENTER_X, 120);

    setFontSize(72, 'italic');
    setTextAlign(ALIGN_CENTER);
    drawShadowText('THANK YOU FOR PLAYING', CENTER_X, CENTER_Y);
    return;
  }

  setFontSize(48);
  setTextAlign(ALIGN_LEFT);
  drawShadowText('⭐ ' + coins + ' / ' + availableCoins, 20, 20, OVERLAY_YELLOW);
  drawShadowText('🚀 ' + player.fuel.toFixed(0) + '%', 20, 100);

  setTextAlign(ALIGN_RIGHT);
  drawShadowText(gameTime.toFixed(1), WIDTH - 20, 20, OVERLAY_LIGHT_GRAY);

  setFontSize(24);

  setTextAlign(ALIGN_CENTER);
  drawKeyIcon('W', WIDTH - 445, HEIGHT - 370);
  drawKeyIcon('A', WIDTH - 490, HEIGHT - 325);
  drawKeyIcon('S', WIDTH - 445, HEIGHT - 325);
  drawKeyIcon('D', WIDTH - 400, HEIGHT - 325);
  drawKeyIcon('⬆', WIDTH - 295, HEIGHT - 370);
  drawKeyIcon('⬅', WIDTH - 340, HEIGHT - 325);
  drawKeyIcon('⬇', WIDTH - 295, HEIGHT - 325);
  drawKeyIcon('➡', WIDTH - 250, HEIGHT - 325);
  drawKeyIcon('SPACE', WIDTH - 327, HEIGHT - 270, 100);
  drawKeyIcon('Z', WIDTH - 250, HEIGHT - 270);
  drawKeyIcon('SHIFT', WIDTH - 327, HEIGHT - 215, 100);
  drawKeyIcon('X', WIDTH - 250, HEIGHT - 215);
  drawKeyIcon('R', WIDTH - 250, HEIGHT - 160);
  drawKeyIcon('M', WIDTH - 250, HEIGHT - 105);
  drawKeyIcon('ESC', WIDTH - 262, HEIGHT - 50, 60);

  setTextAlign(ALIGN_LEFT);
  drawShadowText('Move', WIDTH - 210, HEIGHT - 315, OVERLAY_LIGHT_GRAY);
  drawShadowText('Jump', WIDTH - 210, HEIGHT - 270, OVERLAY_LIGHT_GRAY);
  drawShadowText('Jetpack', WIDTH - 210, HEIGHT - 215, OVERLAY_LIGHT_GRAY);
  drawShadowText('Restart level', WIDTH - 210, HEIGHT - 160, OVERLAY_LIGHT_GRAY);
  drawShadowText('Toggle music', WIDTH - 210, HEIGHT - 105, OVERLAY_LIGHT_GRAY);
  drawShadowText('Main menu', WIDTH - 210, HEIGHT - 50, OVERLAY_LIGHT_GRAY);
}

/**
 * Draws the debug overlay.
 */
function drawDebugOverlay() {
  if (DEBUG) {
    setTextAlign(ALIGN_LEFT);
    setFontSize(20);

    drawShadowText('Player: ' + vec3.str(player.pos), 10, 300);
    drawShadowText('Focus dist: ' + cameraDistance.toFixed(2), 10, 340);
    drawShadowText('Camera: ' + vec3.str(camera.source), 10, 360);
    drawShadowText('Menu: ' + (!!menu), 10, 380);
    drawShadowText('State: ' + gameState, 10, 400);
    drawShadowText('Level: ' + level, 10, 420);

    setTextAlign(ALIGN_CENTER);
    setFontSize(24);
    drawShadowText('FPS: ' + averageFps.toFixed(0), CENTER_X, HEIGHT - 50, OVERLAY_LIGHT_GRAY);
  }
}
