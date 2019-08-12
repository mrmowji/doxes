var app = new Vue({
  el: "#app",
  data: {
    numberOfRows: 5,
    numberOfColumns: 10,
    lineThickness: 10,
    boxWidth: 40,
    boardPadding: 20,
    numberOfPlayers: 4,
    currentPlayerIndex: 0,
    players: [
      { score: 0, color: "#3eacb8" },
      { score: 0, color: "#e8175d" },
      { score: 0, color: "#21B500" },
      { score: 0, color: "#bb7ec6" },
    ],
    boxes: [],
    numberOfTakenBoxes: 0,
  },
  computed: {
    boardWidth: function() {
      return (this.boardPadding * 2) +
             (this.numberOfColumns * this.boxWidth);
    },
    boardHeight: function() {
      return (this.boardPadding * 2) +
             (this.numberOfRows * this.boxWidth);
    },
  },
  methods: {
    changeCurrentPlayer: function() {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numberOfPlayers;
    },
    drawLine: function(boxIndex, lineIndex, checkAdjacentBoxes = true) {
      let scored = false;
      let oldLine = this.boxes[boxIndex].lines[lineIndex];
      if (oldLine.isDrawn) { return; }
      let oldBox = this.boxes[boxIndex];
      let newLine = Object.assign(oldLine, { isDrawn: true, player: this.currentPlayerIndex });
      let newBox = Object.assign(oldBox, { numberOfDrawnLines: oldBox.numberOfDrawnLines + 1 });
      newBox.lines.splice(lineIndex, 1, newLine),
      this.boxes.splice(boxIndex, 1, newBox);
      if (this.fillBox(boxIndex)) {
        scored = true;
      }
      var audio = new Audio('statics/audios/drawing.mp3');
      audio.play();
      if (checkAdjacentBoxes) {
        if (lineIndex == 3 && boxIndex % this.numberOfColumns != 0) {
          if (this.drawLine(boxIndex - 1, 1, false)) {
            scored = true;
          }
        }
        if (lineIndex == 1 && boxIndex % this.numberOfColumns != (this.numberOfColumns - 1)) {
          this.drawLine(boxIndex + 1, 3, false);
        }
        if (lineIndex == 0 && (boxIndex / this.numberOfColumns) >= 1) {
          this.drawLine(boxIndex - this.numberOfColumns, 2, false);
        }
        if (lineIndex == 2 && (boxIndex / this.numberOfColumns) < (this.numberOfColumns - 1)) {
          this.drawLine(boxIndex + this.numberOfColumns, 0, false);
        }
        if (!scored) {
          this.changeCurrentPlayer();
        }
      }
      return scored;
    },
    fillBox: function(boxIndex) {
      if (this.boxes[boxIndex].numberOfDrawnLines == this.boxes[boxIndex].numberOfSides) {
        this.boxes[boxIndex].isTaken = true;
        this.boxes[boxIndex].player = this.currentPlayerIndex;
        this.players[this.currentPlayerIndex].score++;
        this.numberOfTakenBoxes++;
        return true;
      }
      return false;
    },
  },
  mounted: function() {
    for (let i = 0; i < this.numberOfRows; i++) {
      for (let j = 0; j < this.numberOfColumns; j++) {
        let box = {
          row: i,
          column: j,
          isTaken: false,
          player: -1,
          lines: [],
          numberOfDrawnLines: 0,
          numberOfSides: 4,
        };
        for (let i = 0; i < box.numberOfSides; i++) {
          if (i == 0) {
            box.lines.push({ x1: 0, y1: 0, x2: 1, y2: 0, isDrawn: false, player: -1 });
          } else if (i == 1) {
            box.lines.push({ x1: 1, y1: 0, x2: 1, y2: 1, isDrawn: false, player: -1 });
          } else if (i == 2) {
            box.lines.push({ x1: 0, y1: 1, x2: 1, y2: 1, isDrawn: false, player: -1 });
          } else if (i == 3) {
            box.lines.push({ x1: 0, y1: 0, x2: 0, y2: 1, isDrawn: false, player: -1 });
          }
        }
        this.boxes.push(box);
      }
    }
  },
});