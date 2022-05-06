let config = {
    type: Phaser.auto,
    width: 1280,
    height: 720,
    scene: [Menu]
}

let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keySPACE;