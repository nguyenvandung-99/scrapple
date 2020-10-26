export default function Square(props) { // pass tile, class and onClick. Checked
  return (
    <>
      {props.tile.letter &&
        <button className={"square " + props.class} onClick={props.onClick}>
          {props.tile.letter}<sub className="square-sub">{props.tile.score}</sub>
        </button>
      }
    </>
  );
}