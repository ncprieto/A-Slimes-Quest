let config = {
    type: Phaser.auto,
    width: 1280,
    height: 720,
    scene: [Menu],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
}
let room = {
    exits: []
}
let gameRooms = [];
let game = new Phaser.Game(config);
let keyC, keyRIGHT, keyLEFT, keyUP, keyDOWN, keySPACE;