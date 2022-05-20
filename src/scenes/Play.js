class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    preload(){
        this.load.image('player', './assets/square_slime.png');

    }
    create(){
        this.player = new Player(this, 100, 100, 'player', 0).setOrigin(0.5,0.5);
    }
    update(){ 
        console.log(this.scene.settings.data[1]);  
        this.player.update();
    }
}