class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.scene = scene;
    
        // add object to existing scene
        scene.add.existing(this)
        scene.physics.add.existing(this);

        //private params
        this.size = 0.2;
        this.money = 0;
        this.powerUp = null;

        this.animPlayed = false;

        var particles = this.scene.add.particles('damage');
        this.emitter = particles.createEmitter( {
            angle: {min: 240, max: 300},
            scale: { min: 0.1, max: 0.3 },
            speed:200,
            quantity: 4,
            lifespan: 300   
        });
        this.emitter.setScale(0.1);
        this.emitter.stop();
        this.emitter.setSpeed(200);

        this.wasHit = 0;

    }
    update() {
        this.setScale(this.size);
        if(this.wasHit > 0) {
            this.wasHit -= 0.1;
            this.alpha = 0.5 * Math.sin(this.wasHit * 4) + 0.5;
        }
        else {
            this.alpha = 1;
            this.wasHit = 0;
        }


        if(this.size <= 0.05) {
            this.size = 0;
            this.scene.gameOver = true;
            this.scene.sound.play('death');
            this.emitter.explode(300, this.x, this.y);
        }

        //left right movement
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.flipX = true;
            this.play('walkStart');
            this.on('animationcomplete', function (sprite)
                {
                if (sprite.key === 'walkStart')
                {
                    this.play('walkDuring');
                }
                }, 
            this);
        }
        else if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.flipX = false;
            this.play('walkStart');
            this.on('animationcomplete', function (sprite)
                {
                if (sprite.key === 'walkStart')
                {
                    this.play('walkDuring'); 
                }
                }, 
            this);
        }
        if(keyLEFT.isDown) {
            this.body.setVelocityX(-300);
        }
        else if(keyRIGHT.isDown) {
            this.body.setVelocityX(300);
            //this.anims.play('walkRight');
        }
        else {
            this.body.setVelocityX(0);
            this.anims.stop('walkDuring');
            this.anims.play('walkStart');
        }

        //Use power up
        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.scene.sound.play('upgrade');
            //console.log("power up");
            if(this.powerUp == 'large') {
                this.size += 0.1;
                this.powerUp = null;
            }
            if(this.powerUp == 'small') {
                this.size -= 0.1;
                this.powerUp = null;
            }
        }

        //reset
        if(Phaser.Input.Keyboard.JustDown(keyR) && this.scene.sceneName != gameRooms[this.scene.stageNum].map[2][2].exits.scene.sceneName) {
            this.scene.sound.play('death');
            gameRooms[0].map[2][2].exits.scene.prevData.prevSize = 0.2;
            gameRooms[0].map[2][2].exits.scene.prevData.prevPowerUp = null;
            gameRooms[0].map[2][2].exits.scene.prevData.money = 0;
            this.money = 0; 
            gameRooms[0].map[2][2].exits.scene.cameFrom = "START";
            gameRooms[this.scene.stageNum].map[2][2].exits.scene.clearKeys();
            this.scene.scene.sleep(this.scene.sceneName);
            this.scene.scene.run(gameRooms[this.scene.stageNum].map[2][2].exits.scene.sceneName);
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
        /*if(keySPACE.isDown) {
            if(this.size > 0.1){
                this.size -= 0.01
            }
        }
        if(keyC.isDown) {
                this.size += 0.01
        }
        this.setScale(this.size);*/
    }

    hit() {
        if(this.wasHit == 0) {
            this.emitter.setPosition(this.x, this.y);
            this.emitter.emitParticle(4);
            this.emitter.emitParticle(5);
            this.size -= 0.1;
            this.wasHit = 5;
        }
    }
    hitBox(tag) {
        if(tag == 'big') {
            if(this.wasHit == 0 && this.size <= 0.5) {
                this.emitter.setPosition(this.x, this.y);
                this.emitter.emitParticle(4);
                this.emitter.emitParticle(5);
                this.size += 0.1;
                this.wasHit = 5;
                
            }
        }
        else {
            if(this.wasHit == 0 && this.size >= 0.2) {
                this.emitter.setPosition(this.x, this.y);
                this.emitter.emitParticle(4);
                this.emitter.emitParticle(5);
                this.size -= 0.1;
                this.wasHit = 5;
            }
        }
    }
  }