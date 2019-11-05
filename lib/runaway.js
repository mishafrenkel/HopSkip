import Game from './objects/game.js';
import generateLevelOne from './objects/level.js';

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.sounds.playMusic("theme");
  game.player.addEventHandlers();

  function welcome() {
    let base_image = new Image();
    base_image.src = 'assets/start-game.jpg';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }

    document.addEventListener("keydown", splashControls, true);
  }

  function splashControls() {
    document.removeEventListener("keydown", splashControls, true);
    game.graphics.clearRect( 0, 0, game.gameCanvas.width, game.gameCanvas.height);
    let base_image = new Image();
    base_image.src = 'assets/splash-controls.jpg';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }

    document.addEventListener("keydown", splashIntro, true);
  }

  function splashIntro() {
    document.removeEventListener("keydown", splashIntro, true);
    game.graphics.clearRect( 0, 0, game.gameCanvas.width, game.gameCanvas.height);
    let base_image = new Image();
    base_image.src = 'assets/splash-crying-kim.png';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }

    setTimeout(mainLoop, 2000);
  }

  function splashRetry() {
    document.body.classList.toggle('death');
    game.graphics.clearRect( 0, 0, game.gameCanvas.width, game.gameCanvas.height);
    let base_image = new Image();
    base_image.src = 'assets/splash-retry.jpg';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }

    document.addEventListener("keydown", retry, true);
  }

  function splashRetryAfterCredits() {
    game.graphics.clearRect( 0, 0, game.gameCanvas.width, game.gameCanvas.height);
    let base_image = new Image();
    base_image.src = 'assets/splash-thanks.jpg';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }

    document.addEventListener("keydown", retry, true);
  }

  function ending() {
    document.body.classList.toggle('death');
    let base_image = new Image();
    base_image.src = 'assets/splash-credits.jpg';
    base_image.onload = function(){
      game.graphics.drawImage(base_image, 0, 0);
    }
    let credits_Y = 0;

    function rollCredits() {
      game.graphics.clearRect( 0, 0, game.gameCanvas.width, game.gameCanvas.height);
        game.graphics.drawImage(base_image, 0, credits_Y);
      credits_Y -= .6;
      let creditFrames = setTimeout(rollCredits, 1000/60);

      if (credits_Y <= -1200) {
        clearTimeout(creditFrames);
        splashRetryAfterCredits();
      }
    }

    rollCredits();
  }

  function retry() {
    document.removeEventListener("keydown", retry, true);
    // Reset Player
    game.player.lives = 4;
    game.player.velocity_X = 0;
    game.player.Y = 0;
    game.player.X = 120;

    // Testing vars
    // game.kim.Y = 280;
    // game.kim.X = 600;

    // Reset Kim
    game.kim.Y = 305;
    game.kim.X = 8400;

    // Reset Levels
    game.level = generateLevelOne();
    for (var i = 0; i < game.level.numBlocks(); i++) {
      game.graphics.drawImage(game.level.blocks[i].sprite, game.level.blocks[i].X, game.level.blocks[i].Y);
    }

    // Reset Enemies
    game.enemies = game.level.enemies;
    game.level.generateEnemies();
    game.level.generateConsumables();

    document.body.classList.toggle('death');

    mainLoop();
  }

  const mainLoop = () => {
    // Turn off Intro Handler
    document.removeEventListener("keydown", mainLoop, true);

    // Move objects in relation to Player
    game.update();
    // Game Logic
    game.player.update(game);
    game.level.updateEnemies(game);

    // Render Game
    game.render();

    var frames = setTimeout(mainLoop, 1000/60);

    // Player Reaches Kim
    if (game.player.isColliding(game.kim)) {
      clearTimeout(frames);
      game.sounds.music.theme.pause();
      game.sounds.playMusic("ending");

      ending();
    }

    // Player Death
    if (game.player.Y > 500) {
      clearTimeout(frames);
      splashRetry();
    }

    // Player Death
    if (game.player.lives === 0) {
      clearTimeout(frames);
      splashRetry();
    }
  };

  // Starts game
  welcome();

});
