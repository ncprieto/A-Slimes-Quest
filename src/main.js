let config = {
    type: Phaser.auto,
    width: 1280,
    height: 720,
    scene: [Menu]
}
let room = {
    exits: []
}
let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keySPACE;