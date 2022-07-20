/** Bookmarks:
 * 1.在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)；已完成√
 * 2.在历史记录列表中加粗显示当前选择的项目；已完成√
 * 3.使用两个循环来渲染出棋盘的格子；已完成√
 **/
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

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
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
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
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
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
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinate: getCoordinate(i)
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
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
    let elList = document.getElementsByClassName("square");
    for (let i = 0; i < elList.length; i++) {
      elList[i].className = "square";
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log("history--", history);
    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move (${step.coordinate.y},${step.coordinate.x}) #` + move
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            onMouseEnter={() => this.showPiecesOnGameBoard(history, move)}
            onMouseLeave={() => this.hidePiecesOnGameBoard()}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
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
