class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    preload(){
        this.load.spritesheet('player', './assets/slime_animation_right.png', { frameWidth: 150, frameHeight: 125});
        this.load.image('wallTile', './assets/wallTile.png');
        this.load.image('door', './assets/doorTemp.png');
        this.load.image('background', './assets/floor_1.png');
        

        this.load.audio('move', './assets/select.wav');

        //player sprites and animation
        this.load.spritesheet('moveRight', './assets/slime_animation_right.png', {frameWidth: 150, frameHeight: 125});
        this.load.spritesheet('moveLeft', './assets/slime_animation_left.png', {frameWidth: 150, frameHeight: 125});

        //enemies
        this.load.spritesheet('slime', './assets/weapon_blob_animation.png', {frameWidth: 125, frameHeight: 125});
        this.load.spritesheet('bat', './assets/flying_eye_animation.png', {frameWidth: 250, frameHeight: 125});
        this.load.spritesheet('skull', './assets/skull_enemy_animation.png', {frameWidth: 100, frameHeight: 100});
        this.load.image('warning', './assets/warning.png');


    }
    create(){

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


        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#87ceeb',
            color: '#000000',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2+32, 'Press (SPACE) to Start', menuConfig).setOrigin(0.5);

        //create games
        console.log('MAKING STAGE 1');
        gameRooms.push(new Map(this, "stage1", 5,20));
        console.log('MAKING STAGE 2');
        gameRooms.push(new Map(this, "stage2", 5,20));
        console.log('MAKING STAGE 3');
        gameRooms.push(new Map(this, "stage3", 5,20));

        gameRooms[0].printMap();
        

    }
    update(){
        //this.player.update();
        //console.log(gameRooms.stage1.map[3][3].exits.scene.sceneName);
        //console.log(game.config.scene);
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            //gameRooms[0].bootRooms();
            this.scene.start(gameRooms[0].map[2][2].exits.scene.sceneName);
        }
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('move');
        }
    }
    
}