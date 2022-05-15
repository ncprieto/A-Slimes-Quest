let config = {
    type: Phaser.auto,
    width: 1280,
    height: 720,
    scene: [Menu, Play]
}
let room = {
    exits: []
}
let gameRooms = [];
let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keyUP, keyDOWN, keySPACE;