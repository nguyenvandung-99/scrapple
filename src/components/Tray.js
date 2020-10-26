import Square from './Square'

export default function Tray(props) { // pass: string with tiles, onClick, class. Checked
  let tray_out = [];
  for (let i = 0; i < (props.string.length); i++) {
    tray_out.push(
      <span key={i}>
        {
          <Square 
            tile={props.string[i]}
            class={props.class} // square-previous, square-new or square-board
            onClick={() => props.onClick(i)}
          />
        }
      </span>
    )
  };
  return (
    <>
      {tray_out}
    </>
  );
}