class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    preload(){
        // STAGE 1 ASSETS
        this.load.image('background_stage1', './assets/floor_1.png');
        this.load.image('walltile_stage1', './assets/wall_1.png');
        this.load.image('door_stage1', './assets/door_1.png');
        this.load.image('puzzle1_floor_stage1', './assets/floor_1_pzl_a.png');
        this.load.image('puzzle2_floor_stage1', './assets/floor_1_pzl_b.png');
        this.load.image('puzzle_piece_stage1', './assets/key_tile_1.png');
        
        this.load.image('startBox', './assets/start.png');

        // STAGE 2 ASSETS
        this.load.image('background_stage2', './assets/floor_2.png');
        this.load.image('walltile_stage2', './assets/wall_2.png');
        this.load.image('door_stage2', './assets/door_2.png');
        this.load.image('puzzle1_floor_stage2', './assets/floor_2_pzl_a.png');
        this.load.image('puzzle2_floor_stage2', './assets/floor_2_pzl_b.png');
        this.load.image('puzzle_piece_stage2', './assets/key_tile_2.png');
        
        // GENERAL ASSETS
        this.load.spritesheet('player', './assets/slime_animation_right.png', { frameWidth: 150, frameHeight: 125});
        this.load.audio('move', './assets/door.wav');
        this.load.image('moneyIcon', './assets/money_icon.png');
        this.load.image('largeUpgrade', './assets/grow_upgrade.png');
        this.load.image('smallUpgrade', './assets/shrink_upgrade.png');
        this.load.image('gameOver', './assets/lose_screen.png');

        //player sprites and animation
        this.load.spritesheet('moveRight', './assets/slime_animation_right.png', {frameWidth: 150, frameHeight: 125});
        this.load.spritesheet('moveLeft', './assets/slime_animation_left.png', {frameWidth: 150, frameHeight: 125});
        this.load.image('damage', './assets/damage.png');

        //enemies
        this.load.spritesheet('slime', './assets/weapon_blob_animation.png', {frameWidth: 125, frameHeight: 125});
        this.load.spritesheet('bat', './assets/flying_eye_animation.png', {frameWidth: 250, frameHeight: 125});
        this.load.spritesheet('skull', './assets/skull_enemy_animation.png', {frameWidth: 100, frameHeight: 100});
        this.load.image('warning', './assets/warning.png');

        // boss sprites
        this.load.image('rockBoss', './assets/rock_boss.png');
        this.load.spritesheet('rockBossAnim', './assets/rock_boss_animation.png', {frameWidth: 200, frameHeight: 200});
        this.load.image('rockBossComplete', './assets/win_screen_1.png');

        //menu and tutorial
        this.load.image('menu', './assets/title_screen.png');
        this.load.image('tutorial1', './assets/tutorial_1.png');
        this.load.image('tutorial2', './assets/tutorial_2.png');
        this.load.image('tutorial3', './assets/tutorial_3.png');

        //sounds
        this.load.audio('upgrade', './assets/upgrade.wav');
        this.load.audio('bgm1', './assets/dungeon_1.mp3');
        this.load.audio('bgm2', './assets/dungeon_2.mp3');
        this.load.audio('death', './assets/death.wav');
        this.load.audio('hit', './assets/hit.wav');
        this.load.audio('puzzleSolve', './assets/puzzle_solve.wav');
        this.load.audio('absorb', './assets/absorb.wav');

        //boss2
        this.load.spritesheet('eyeBoss', './assets/six_wing_boss_animation.png', {frameWidth: 400, frameHeight: 300});
        this.load.image('eyeBossEnd', './assets/win_screen_2.png');
        this.load.image('credits', './assets/credits.png');

    }
    create(){ 
        this.music = this.sound.add('bgm1');
        this.music2 = this.sound.add('bgm2');

        //clear gameRooms for reset
        for(let i = gameRooms.length - 1; i >= 0; i--) {
            gameRooms[i].delete();
            gameRooms.pop();
        }

        //game.physics.startSystem(Phaser.Physics.ARCADE);

        this.anims.create({key: 'walkStart', frames: this.anims.generateFrameNumbers('moveRight', {start:0, end: 1}), frameRate: 10, repeat: 0});
        this.anims.create({key: 'walkDuring', frames: this.anims.generateFrameNumbers('moveRight', {start:1, end: 3}), frameRate: 10, repeat: -1});
        this.anims.create({key: 'slimeMove', frames: this.anims.generateFrameNumbers('slime', {start:0, end: 3}), frameRate: 10, repeat: -1});
        this.anims.create({key: 'skullMove', frames: this.anims.generateFrameNumbers('skull', {start:0, end: 3}), frameRate: 10, repeat: -1});
        this.anims.create({key: 'batMove', frames: this.anims.generateFrameNumbers('bat', {start:0, end: 4}), frameRate: 10, repeat: -1});
        this.anims.create({key: 'rockBossAnimation', frames: this.anims.generateFrameNumbers('rockBossAnim', {start:0, end: 3}), frameRate: 3, repeat: -1});
        this.anims.create({key: 'batBossAnimation', frames: this.anims.generateFrameNumbers('eyeBoss', {start:0, end: 4}), frameRate: 6, repeat: -1});

        //keyboard inputs
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyT     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        


        this.menu = this.add.image(0,0, 'menu').setOrigin(0,0);
        this.tutorial1 = this.add.image(0,0, 'tutorial1').setOrigin(0,0).setAlpha(0);
        this.tutorial2 = this.add.image(0,0, 'tutorial2').setOrigin(0,0).setAlpha(0);
        this.tutorial3 = this.add.image(0,0, 'tutorial3').setOrigin(0,0).setAlpha(0);

        //create games
        console.log('MAKING STAGE 1');
        gameRooms.push(new Map(this, "stage1", 5,20));
        console.log('MAKING STAGE 2');
        gameRooms.push(new Map(this, "stage2", 5,20));

        console.log("STAGE 1 MAP");
        gameRooms[0].printMap();
        console.log("STAGE 2 MAP");
        gameRooms[1].printMap();
        
        menu = this;
    }
    update(){
        
        //this.player.update();
        //console.log(gameRooms.stage1.map[3][3].exits.scene.sceneName);
        //console.log(game.config.scene);
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.music.setLoop(true);
            this.music.play();
            //gameRooms[0].bootRooms();
            this.scene.start(gameRooms[1].map[2][2].exits.scene.sceneName);
        }
        if(Phaser.Input.Keyboard.JustDown(keyT)) {
            if(this.tutorial1.alpha == 1) {
                this.tutorial2.setAlpha(1);
                this.tutorial1.setAlpha(0);
            }
            else if(this.tutorial2.alpha == 1) {
                this.tutorial3.setAlpha(1);
                this.tutorial2.setAlpha(0);
            }
            else if(this.tutorial3.alpha == 1) {
                this.menu.setAlpha(1);
                this.tutorial3.setAlpha(0);
            }
            else {
                this.menu.setAlpha(0);
                this.tutorial1.setAlpha(1);
            }
        }
    }
    
}