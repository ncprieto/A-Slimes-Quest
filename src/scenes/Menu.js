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
        this.load.audio('move', './assets/select.wav');

        //player sprites and animation
        this.load.spritesheet('moveRight', './assets/slime_animation_right.png', {frameWidth: 150, frameHeight: 125});
        this.load.spritesheet('moveLeft', './assets/slime_animation_left.png', {frameWidth: 150, frameHeight: 125});
        this.load.image('damage', './assets/damage.png');

        //enemies
        this.load.spritesheet('slime', './assets/weapon_blob_animation.png', {frameWidth: 125, frameHeight: 125});
        this.load.spritesheet('bat', './assets/flying_eye_animation.png', {frameWidth: 250, frameHeight: 125});
        this.load.spritesheet('skull', './assets/skull_enemy_animation.png', {frameWidth: 100, frameHeight: 100});
        this.load.image('warning', './assets/warning.png');

        //menu and tutorial
        this.load.image('menu', './assets/title_screen.png');
        this.load.image('tutorial1', './assets/tutorial_1.png');
        this.load.image('tutorial2', './assets/tutorial_2.png');


    }
    create(){

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
        //this.anims.create({key: 'walkLeftStart', frames: this.anims.generateFrameNumbers('moveLeft', {start:1, end: 1}), frameRate: 10, repeat: 0});
        //this.anims.create({key: 'walkLeftDuring', frames: this.anims.generateFrameNumbers('moveLeft', {start:1, end: 3}), frameRate: 10, repeat: -1})

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

        //create games
        console.log('MAKING STAGE 1');
        gameRooms.push(new Map(this, "stage1", 5,20));
        console.log('MAKING STAGE 2');
        gameRooms.push(new Map(this, "stage2", 5,20));

        console.log("STAGE 1 MAP");
        gameRooms[0].printMap();
        console.log("STAGE 2 MAP");
        gameRooms[1].printMap();
        

    }
    update(){
        //this.player.update();
        //console.log(gameRooms.stage1.map[3][3].exits.scene.sceneName);
        //console.log(game.config.scene);
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            //gameRooms[0].bootRooms();
            this.scene.start(gameRooms[0].map[2][2].exits.scene.sceneName);
        }
        if(Phaser.Input.Keyboard.JustDown(keyT)) {
            if(this.tutorial1.alpha == 1) {
                this.tutorial2.setAlpha(1);
                this.tutorial1.setAlpha(0);
            }
            else if(this.tutorial2.alpha == 1) {
                this.menu.setAlpha(1);
                this.tutorial2.setAlpha(0);
            }
            else {
                this.menu.setAlpha(0);
                this.tutorial1.setAlpha(1);
            }
            
        }
    }
    
}