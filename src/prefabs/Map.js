class Map{
    constructor(scene, name, rows, maxRooms){
        this.scene = scene;
        this.name = name;
        this.rows = rows;
        this.maxRooms = maxRooms;                                           // shoudl make ~ 1 to 6 more rooms than maxRooms (not guaranteed tho)
        this.startingrow = Math.floor(rows / 2);
        this.startingcol = this.startingrow;
        this.map = Array(this.rows);
        this.singleRooms = [];
        this.bossCords = [];                                                // stores coordinates for the boss room for this stage           index 0 and 1 hold boss room index 2 and 3 hold previous room
        this.puzzleCords = [];                                              // stores coordinates for puzzle and prize rooms for this stage  index 0 and 1 hold prize room index 2 and 3 hold puzzle room
        this.puzzleTypes = ["puzzle1", "puzzle2", "puzzle3", "puzzle4"];
        for(let i = 0; i < this.rows; i++){
            this.map[i] = [0,0,0,0,0];
        }
        this.map[this.startingrow][this.startingcol] = {
            exits: {
                up: false,
                down: false,
                left: false,
                right: false,
                made: false,
                scene: null
            },
            type: {
                start: true,
                normal: false,
                boss: false,
                prize: false,
                puzzle: false
            }
        }
        this.curRooms = 1;
        this.generateExits(this.startingrow, this.startingcol);
        this.cleanUp();
        this.makeBossRoom();
        this.makePuzzleAndPrizeRoom();
        this.generateScenes();
    }
    generateExits(row, col){
        let exitArr = ['up', 'down', 'left', 'right'];
        let potentialExits = Math.floor(Math.random() * (5 - 3) + 3);         // this guarantess that atleast 3 exits will be made for the current room
        for(let i = 0; i < potentialExits; i++){                              // however there is a chance that those 3 exits
            let exitIndex = Math.floor(Math.random() * exitArr.length);       // already exist for that room or that they cant be created for that room
            switch(exitArr[exitIndex]){                                       // such as creating rooms that would go outside of the map
                case('up'):
                    if(!this.map[row][col].exits.up && row != 0){             // bounds checking so we dont go out of the 2D array and if the exit we want doesnt already exist
                        if(this.map[row - 1][col] == 0){                      // if no room has been made at the index above the current one
                            this.map[row][col].exits.up = true;               // then create that exit 
                        }
                        else if(!this.map[row - 1][col].exits.made){          // if room exits above the current one then
                            this.map[row][col].exits.up = true;               // create exit in current room and create exit
                            this.map[row - 1][col].exits.down = true;         // in the room above (if it isnt already created)
                        }
                    }
                    break;
                case('down'):
                    if(!this.map[row][col].exits.down  && row != this.rows - 1){
                        if(this.map[row + 1][col] == 0){
                            this.map[row][col].exits.down = true;
                        }
                        else if(!this.map[row + 1][col].exits.made){
                            this.map[row][col].exits.down = true;
                            this.map[row + 1][col].exits.up = true;
                        }
                    }
                    break;
                case('left'):
                    if(!this.map[row][col].exits.left && col != 0){
                        if(this.map[row][col - 1] == 0){
                            this.map[row][col].exits.left = true;
                        }
                        else if(!this.map[row][col - 1].exits.made){
                            this.map[row][col].exits.left = true;
                            this.map[row][col - 1].exits.right = true;
                        }
                    }
                    break;
                case('right'):
                    if(!this.map[row][col].exits.right && col != this.rows - 1){
                        if(this.map[row][col + 1] == 0){
                            this.map[row][col].exits.right = true;
                        }
                        else if(!this.map[row][col + 1].exits.made){
                            this.map[row][col].exits.right = true;
                            this.map[row][col + 1].exits.left = true;
                        }
                    }
                    break;
            }
            exitArr.splice(exitIndex, 1);                                                   // after we create the exit we want we remove it from exitArr
        }                                                                                   // gets rid of trying to create duplicate exits
        this.map[row][col].exits.made = true;
        if(this.map[row][col].exits.up){
            this.goUp(row, col);
        }
        if(this.map[row][col].exits.down){
            this.goDown(row, col);
        }
        if(this.map[row][col].exits.left){
            this.goLeft(row, col);
        }
        if(this.map[row][col].exits.right){
            this.goRight(row, col);
        }
        if(this.curRooms > this.maxRooms){
            return;
        }
    }
    goUp(row, col){
        if(this.map[row - 1][col] != 0){                    // if room abover map[row][col] already exitst
            if(this.map[row - 1][col].exits.made){          // if the exits have already been made for this room
                this.map[row - 1][col].exits.down = true;   // then make the exit to the original room in this room
                return;                                     // making exits for a room that already has had it exits made
            }                                               // makes things really messy
        }
        if(this.map[row - 1][col] == 0){                    // if the map[row - 1][col] doesnt have a room obj in it then make
            this.map[row - 1][col] = {                      // one with some initial variables
                exits: {
                    up: false,
                    down: true,
                    left: false,
                    right: false,
                    made: false,
                    scene: null
                },
                type: {
                    start: false,
                    normal: true,
                    boss: false,
                    prize: false,
                    puzzle: false
                }
            }
        }
        this.curRooms += 1;
        if(this.curRooms >= this.maxRooms){
            return;
        }
        if(Math.floor(Math.random() * 5) == 3){             // 1 in 5 chance that we dont make exits for the room at map[row - 1][col]
            this.map[row - 1][col].exits.made = true;
            return;
        }
        else{
            this.generateExits(row - 1, col);
        }
    }
    goDown(row, col){
        if(this.map[row + 1][col] != 0){
            if(this.map[row + 1][col].exits.made){
                this.map[row + 1][col].exits.up = true;
                return;
            }
        }
        if(this.map[row + 1][col] == 0){
            this.map[row + 1][col] = {
                exits: {
                    up: true,
                    down: false,
                    left: false,
                    right: false,
                    made: false,
                    scene: null
                },
                type: {
                    start: false,
                    normal: true,
                    boss: false,
                    prize: false,
                    puzzle: false
                }
            }
        }
        this.curRooms += 1;
        if(this.curRooms >= this.maxRooms){
            return;
        }
        if(Math.floor(Math.random() * 5) == 3){
            this.map[row + 1][col].exits.made = true;
            return;
        }
        else{
            this.generateExits(row + 1, col);
        }
    }
    goLeft(row, col){
        if(this.map[row][col - 1]  != 0){
            if(this.map[row][col - 1].exits.made){
                this.map[row][col - 1].exits.right = true;
                return;
            }
        }
        if(this.map[row][col - 1] == 0){
            this.map[row][col - 1] = {
                exits: {
                    up: false,
                    down: false,
                    left: false,
                    right: true,
                    made: false,
                    scene: null
                },
                type: {
                    start: false,
                    normal: true,
                    boss: false,
                    prize: false,
                    puzzle: false
                }
            }
        }
        this.curRooms += 1;
        if(this.curRooms >= this.maxRooms){
            return;
        }
        if(Math.floor(Math.random() * 5) == 3){
            this.map[row][col - 1].exits.made = true;
            return;
        }
        else{
            this.generateExits(row, col - 1);
        }
    }
    goRight(row, col){
        if(this.map[row][col + 1] != 0){
            if(this.map[row][col + 1].exits.made){
                this.map[row][col + 1].exits.left = true;
                return;
            }
        }
        
        if(this.map[row][col + 1] == 0){
            this.map[row][col + 1] = {
                exits: {
                    up: false,
                    down: false,
                    left: true,
                    right: false,
                    made: false,
                    scene: null
                },
                type: {
                    start: false,
                    normal: true,
                    boss: false,
                    prize: false,
                    puzzle: false
                }
            }
        }
        this.curRooms += 1;
        if(this.curRooms >= this.maxRooms){
            return;
        }
        if(Math.floor(Math.random() * 5) == 3){
            this.map[row][col + 1].exits.made = true;
            return;
        }
        else{
            this.generateExits(row, col + 1);
        }
    }
    /* printMap() prints the map
     * just makes visualizing the map a bit easier
     */
    printMap(){
        for(let i = 0; i < this.rows; i ++){
            let final = "";
            for(let j  = 0; j < this.rows; j ++){
                let temp = "";
                if(this.map[i][j] != 0){
                    if(this.map[i][j].exits.up){
                        temp += 'u';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].exits.down){
                        temp += 'd';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].exits.left){
                        temp += 'l';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].exits.right){
                        temp += 'r';
                    }
                    else{
                        temp += "0";
                    }
                    //
                    if(this.map[i][j].type.start){
                        temp += 's';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].type.normal){
                        temp += 'n';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].type.prize){
                        temp += 'p';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].type.puzzle){
                        temp += 'z';
                    }
                    else{
                        temp += "0";
                    }
                    if(this.map[i][j].type.boss){
                        temp += 'b';
                    }
                    else{
                        temp += "0";
                    }
                }
                while(temp.length < 9){
                    temp += '0';
                }
                temp += " ";
                final += temp;
            }
            console.log(final);
        }
    }
    /* cleanUp() pretty much cleans up any parts of the map
     * where two rooms exits do not match
     * if room [2][2] has a left exit then it it ensures that
     * the room at [2][1] has a right exit and so on
     * also finds rooms that contain a single entrance and exit
     * and stores the coordinates of that room in this.singleRooms
     */
    cleanUp(){
        for(let i = 0; i < this.rows; i ++){
            for(let j  = 0; j < this.rows; j ++){
                let exitCount = 0;
                let before = "";
                if(this.map[i][j] == 0){
                    continue;
                }
                if(this.map[i][j].exits.up){
                    this.map[i - 1][j].exits.down  = true;
                    exitCount += 1;
                    before = "down";
                }
                if(this.map[i][j].exits.down){
                    this.map[i + 1][j].exits.up  = true;
                    exitCount += 1;
                    before = "up";
                }
                if(this.map[i][j].exits.left){
                    this.map[i][j - 1].exits.right  = true;
                    exitCount += 1;
                    before = "left";
                }
                if(this.map[i][j].exits.right){
                    this.map[i][j + 1].exits.left  = true;
                    exitCount += 1;
                    before = "right";
                }
                if(exitCount == 1){
                    let tempArr = [i, j]
                    switch (before){
                        case "down":
                            tempArr.push(i - 1, j);
                            break;
                        case "up":
                            tempArr.push(i + 1, j);
                            break;
                        case "left":
                            tempArr.push(i, j - 1);
                            break;
                        case "right":
                            tempArr.push(i, j + 1);
                            break;
                    }
                    this.singleRooms.push(tempArr);
                }
            }
        }
    }
    generateScenes() {
        for(let i = 0; i < this.rows; i ++){
            for(let j  = 0; j < this.rows; j ++){
                if(this.map[i][j] != 0){
                    if(this.map[i][j].type.puzzle){
                        let prizeY;
                        let prizeX;
                        for(let g = 0; g < this.puzzleCords.length; g ++){
                            if(i == this.puzzleCords[g][2] && j == this.puzzleCords[g][3]){
                                prizeX = this.puzzleCords[g][1];
                                prizeY = this.puzzleCords[g][0];
                            }
                        }
                        let index = Math.floor(Math.random() * this.puzzleTypes.length);
                        let pzlBackground;
                        let pieceStr;
                        let doorStr;
                        switch(this.puzzleTypes[index]){
                            case "puzzle1":
                                console.log("MAKING PUZZLE ONE");
                                if(this.name == 'stage1'){
                                    pzlBackground = 'puzzle1_floor_stage1';
                                    pieceStr = 'puzzle_piece_stage1';
                                    doorStr = 'walltile_stage1';
                                }
                                else if(this.name == 'stage2'){
                                    pzlBackground = 'puzzle1_floor_stage2';
                                    pieceStr = 'puzzle_piece_stage2';
                                    doorStr = 'walltile_stage2';
                                }
                                this.map[i][j].exits.scene = new Puzzle1(this.name + "_" + i + j + "_" + "puzzle", i, j, prizeX, prizeY, pzlBackground, pieceStr, doorStr);
                                break;
                            case "puzzle2":
                                console.log("MAKING  PUZZLE TWO");
                                if(this.name == 'stage1'){
                                    pzlBackground = 'puzzle1_floor_stage1';
                                    pieceStr = 'puzzle_piece_stage1';
                                    doorStr = 'walltile_stage1';
                                }
                                else if(this.name == 'stage2'){
                                    pzlBackground = 'puzzle1_floor_stage2';
                                    pieceStr = 'puzzle_piece_stage2';
                                    doorStr = 'walltile_stage2';
                                }
                                this.map[i][j].exits.scene = new Puzzle2(this.name + "_" + i + j + "_" + "puzzle", i, j, prizeX, prizeY, pzlBackground, pieceStr, doorStr);
                                break;
                            case "puzzle3":
                                console.log("MAKING OPUZZLE THREE");
                                if(this.name == 'stage1'){
                                    pzlBackground = 'puzzle2_floor_stage1';
                                    pieceStr = 'puzzle_piece_stage1';
                                    doorStr = 'walltile_stage1';
                                }
                                else if(this.name == 'stage2'){
                                    pzlBackground = 'puzzle2_floor_stage2';
                                    pieceStr = 'puzzle_piece_stage2';
                                    doorStr = 'walltile_stage2';
                                }
                                this.map[i][j].exits.scene = new Puzzle3(this.name + "_" + i + j + "_" + "puzzle", i, j, prizeX, prizeY, pzlBackground, pieceStr, doorStr);
                                break;
                            case "puzzle4":
                                console.log("MAKING PUZZLE FOUR");
                                if(this.name == 'stage1'){
                                    pzlBackground = 'puzzle2_floor_stage1';
                                    pieceStr = 'puzzle_piece_stage1';
                                    doorStr = 'walltile_stage1';
                                }
                                else if(this.name == 'stage2'){
                                    pzlBackground = 'puzzle2_floor_stage2';
                                    pieceStr = 'puzzle_piece_stage2';
                                    doorStr = 'walltile_stage2';
                                }
                                this.map[i][j].exits.scene = new Puzzle4(this.name + "_" + i + j + "_" + "puzzle", i, j, prizeX, prizeY, pzlBackground, pieceStr, doorStr);
                                break;
                        }
                        this.puzzleTypes.splice(index, 1);
                    }
                    else if(this.map[i][j].type.prize){
                        this.map[i][j].exits.scene = new Prize(this.name + "_" + i + j + "_" + "prize");
                    }
                    else if(this.map[i][j].type.boss){
                        this.map[i][j].exits.scene = new Boss(this.name + "_" + i + j + "_" + "boss");
                    }
                    else if(this.map[i][j].type.start){
                        this.map[i][j].exits.scene = new Room(this.name + "_" + i + j + "_" + "start");
                    }
                    else{
                        this.map[i][j].exits.scene = new Normal(this.name + "_" + i + j + "_" + "normal");
                    }
                    // COULD ADD PUZZLE CLASS AND BOSS CLASS BASED ON TYPE OF ROOM
                    
                    this.scene.scene.add(this.map[i][j].exits.scene.sceneName, this.map[i][j].exits.scene);
                    if(!this.map[i][j].exits.scene) {
                        console.log("failed to create room");
                    }
                }
            }
        }
    }
    bootRooms() {
        for(let i = 0; i < this.rows; i ++){
            for(let j  = 0; j < this.rows; j ++){
                if(this.map[i][j] != 0){
                    if(!this.map[i][j].exits.scene) {
                        console.log("No scene at" + i + "," + j);
                    }
                    this.scene.scene.start(this.map[i][j].exits.scene.sceneName);
                    this.scene.scene.sleep(this.map[i][j].exits.scene.sceneName);
                }
            }
        }
    }
    // finds first room with a singular exit and changes the .type.boss to true
    makeBossRoom(){
        let dist = 0;
        let index;
        for(let i = 0; i < this.singleRooms.length; i++){
            let tempDist = Math.sqrt(Math.pow((2 - this.singleRooms[i][0]), 2) + Math.pow((2 - this.singleRooms[i][1]), 2))
            if(tempDist > dist){
                dist = tempDist;
                this.bossCords = this.singleRooms[i];
                index = i;
            }
        }
        this.singleRooms.splice(index, 1);
        this.map[this.bossCords[0]][this.bossCords[1]].type.boss = true;
    }
    // finds two more single rooms and sets them to puzzle and prize rooms
    makePuzzleAndPrizeRoom(){
        if(this.singleRooms[0] != undefined){
            this.puzzleCords.push(this.singleRooms[0]);
            this.map[this.singleRooms[0][0]][this.singleRooms[0][1]].type.prize = true;
            this.map[this.singleRooms[0][2]][this.singleRooms[0][3]].type.puzzle = true;
        }
        if(this.singleRooms[1] != undefined){
            this.puzzleCords.push(this.singleRooms[1]);
            this.map[this.singleRooms[1][0]][this.singleRooms[1][1]].type.prize = true;
            this.map[this.singleRooms[1][2]][this.singleRooms[1][3]].type.puzzle = true;
        }
        this.singleRooms.splice(0, 2);
    }
}