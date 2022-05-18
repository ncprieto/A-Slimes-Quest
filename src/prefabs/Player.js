class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    
        // add object to existing scene
        scene.add.existing(this)
        scene.physics.add.existing(this);

        //private params
        this.size = 0.4;
        this.setScale(0.4);
        //
    }
    update() {
        //left right movement
        if(keyLEFT.isDown) {
            this.body.setVelocityX(-300);
        }
        else if(keyRIGHT.isDown) {
            this.body.setVelocityX(300);
        }
        else {
            this.body.setVelocityX(0);
        }

        //up down movement
        if(keyUP.isDown) {
            this.body.setVelocityY(-300);
        }
        else if(keyDOWN.isDown) {
            this.body.setVelocityY(300);
        }
        else {
            this.body.setVelocityY(0);
        }

        //debug change size
        if(keySPACE.isDown) {
            this.size -= 0.01
            this.setScale(this.size);
        }

    }
  }