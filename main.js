const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    // store 2d field array
    this.field = field;
    // store vertical position in 2d field array
    this.y = 0;
    // store horizontal position in 2d field array
    this.x = 0;
    // set the "home" position before the game starts
    this.field[0][0] = pathCharacter;
  }

  play() {
    let playing = true;
    while (playing) {
      this.print();
      this.prompt();

      // if user goes out of bounds of field, end game
      if (
        this.y < 0 ||
        this.y > this.field.length ||
        this.x < 0 ||
        this.x > this.field[0].length
      ) {
        console.log('You went out of bounds. Game over.');
        playing = false;
        break;
      }

      // if user moves into a hole, end game
      if (this.field[this.y][this.x] === hole) {
        console.log('You fell into a hole. Game over!');
        playing = false;
        break;
      }

      // if user moves into a hat, end game
      if (this.field[this.y][this.x] === hat) {
        console.log('You found the hat!');
        playing = false;
        break;
      }

      // add star to current location
      this.field[this.y][this.x] = pathCharacter;

      // clear console to keep things clean
      process.stdout.write('\x1Bc');
    }
  }

  print() {
    // print current state of field as a 2d string
    console.log(this.field.map(row => row.join('')).join('\n'));
  }

  // Prompt user to indicate which direction they’d like to “move”.
  prompt() {
    let direction = prompt(
      'Which direction would you like to move in (W, A, S, or D)? '
    ).toLowerCase();

    // update horizontal and vertical position based on direction
    switch (direction) {
      case 'w':
        this.y--;
        break;
      case 'd':
        this.x++;
        break;
      case 's':
        this.y++;
        break;
      case 'a':
        this.x--;
        break;
      default:
        console.log('Please enter a valid direction.');
        this.prompt();
        break;
    }
  }

  // Generate a 2d field with the hat and holes randomly placed
  static generate(rows = 5, columns = 10, holes = 20) {
    const field = [];
    for (let i = 0; i < rows; i++) {
      field.push([]);
      for (let j = 0; j < columns; j++) {
        field[i].push(fieldCharacter);
      }
    }

    // place holes in random locations
    for (let i = 0; i < holes; i++) {
      const holeY = Math.floor(Math.random() * rows);
      const holeX = Math.floor(Math.random() * columns);
      field[holeY][holeX] = hole;
    }

    // place hat in random location that's not the starting position
    let y = 0;
    while (y === 0) {
      y = Math.floor(Math.random() * rows);
    }
    let x = 0;
    while (x === 0) {
      x = Math.floor(Math.random() * columns);
    }
    field[y][x] = hat;

    return field;
  }
}

const myField = new Field(Field.generate());

myField.play();
