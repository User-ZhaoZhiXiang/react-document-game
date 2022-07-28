import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/** pictures */
// import xImgWood from "./asset/x_pieces_wood.png";
// import oImgWood from "./asset/o_pieces_wood.png";
import xImgColor from "./asset/x_pieces_color.png";
import oImgColor from "./asset/o_pieces_color.png";
// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           this.props.onClick();
//         }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
function piecesShow(type) {
  if (type === "X") {
    return <img src={xImgColor} alt="x" />;
  } else if (type === "O") {
    return <img src={oImgColor} alt="o" />;
  } else {
    return null;
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {piecesShow(props.value)}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementArr: [
        { val: 0, list: [0, 1, 2] },
        { val: 3, list: [3, 4, 5] },
        { val: 6, list: [6, 7, 8] }
      ]
    };
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {this.state.elementArr.map((item, index) => {
          return (
            <div className="board-row" key={index}>
              {item.list.map(subList => {
                return this.renderSquare(subList);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.isAsc ? history[history.length - 1] : history[0];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: this.state.isAsc
        ? history.concat([
            {
              squares: squares,
              coordinate: getCoordinate(i)
            }
          ])
        : [
            {
              squares: squares,
              coordinate: getCoordinate(i)
            }
          ].concat(history),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: this.state.isAsc
        ? step
        : this.state.history.length - (step + 1),
      xIsNext: step % 2 === 0
    });
  }

  showPiecesOnGameBoard(history, index) {
    if (!history[index].coordinate) {
      return;
    }
    let elList = document.getElementsByClassName("square");
    elList[getIndex(history[index].coordinate)].className += " current";
  }

  hidePiecesOnGameBoard() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.isAsc ? history[history.length - 1] : history[0];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) return;
    let elList = document.getElementsByClassName("square");
    for (let i = 0; i < elList.length; i++) {
      elList[i].className = "square";
    }
  }

  reverseSort() {
    this.setState({
      isAsc: !this.state.isAsc,
      history: this.state.history.slice().reverse()
    });
  }

  render() {
    const history = this.state.history;
    const current = this.state.isAsc
      ? history[this.state.stepNumber]
      : history[history.length - (this.state.stepNumber + 1)];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
      let elList = document.getElementsByClassName("square");
      elList[winner[0]].className += " win";
      elList[winner[1]].className += " win";
      elList[winner[2]].className += " win";
    } else {
      let isDogfall = true;
      current.squares.forEach(i => {
        if (i === null) {
          isDogfall = false;
        }
      });
      if (isDogfall) {
        status = "Dogfall !";
        setTimeout(() => {
          alert("Dogfall !");
        }, 100);
      } else {
        status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <button onClick={() => this.reverseSort()}>reverse sort</button>
          <div>{status}</div>
          <ul>
            {history.map((step, move) => {
              const desc = step.coordinate
                ? `Go to move (${step.coordinate.y},${step.coordinate.x}) #` +
                  (this.state.isAsc
                    ? move
                    : this.state.history.length - move - 1)
                : "Go to game start";
              return (
                <li key={move}>
                  <span>
                    {this.state.isAsc
                      ? move + 1
                      : this.state.history.length - move}
                    .{" "}
                  </span>
                  <button
                    onClick={() => this.jumpTo(move)}
                    onMouseEnter={() =>
                      this.showPiecesOnGameBoard(history, move)
                    }
                    onMouseLeave={() => this.hidePiecesOnGameBoard()}
                  >
                    {desc}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      return lines[i];
    }
  }
  return null;
}

function getCoordinate(val) {
  switch (val) {
    case 0:
      return { x: 1, y: 1 };
    case 1:
      return { x: 1, y: 2 };
    case 2:
      return { x: 1, y: 3 };
    case 3:
      return { x: 2, y: 1 };
    case 4:
      return { x: 2, y: 2 };
    case 5:
      return { x: 2, y: 3 };
    case 6:
      return { x: 3, y: 1 };
    case 7:
      return { x: 3, y: 2 };
    case 8:
      return { x: 3, y: 3 };
    default:
      return { x: 0, y: 0 };
  }
}

function getIndex(val) {
  if (val.x === 1) {
    switch (val.y) {
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 2;
      default:
        return null;
    }
  } else if (val.x === 2) {
    switch (val.y) {
      case 1:
        return 3;
      case 2:
        return 4;
      case 3:
        return 5;
      default:
        return null;
    }
  } else if (val.x === 3) {
    switch (val.y) {
      case 1:
        return 6;
      case 2:
        return 7;
      case 3:
        return 8;
      default:
        return null;
    }
  }
  return null;
}
