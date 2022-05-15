let config = {
    type: Phaser.auto,
    width: 1280,
    height: 720,
    scene: [Menu, Play]
}
let room = {
    exits: []
}
let gameRooms = {
    stage1: null,
    stage2: null,
    stage3: null,
}
let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keyUP, keyDOWN, keySPACE;