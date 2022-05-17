class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    preload(){
        this.load.spritesheet('player', './assets/square_slime.png', { frameWidth: 100, frameHeight: 100});
        this.load.image('wallTile', './assets/wallTile.jpg');
        this.load.image('door', './assets/doorTemp.png')
    }
    create(){
        
        //keyboard inputs
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


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
        gameRooms.push(new Map(this, "stage1", 5,20));
        gameRooms.push(new Map(this, "stage2", 5,20));
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
    }
    
}