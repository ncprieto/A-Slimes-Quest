class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    preload(){
    }
    create(){
        this.map = new Map(5, 20);
        this.map.printMap();
    }
    update(){
    }
}