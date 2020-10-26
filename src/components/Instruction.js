export default function Instruction(props) { // pass show and onClick
  // if (props.show) {
    return (
      props.show ? 
      <>
        <button className="btn btn-success" onClick={props.onClick}>Hide instructions</button>
        <h2>
          Instructions
        </h2>
        <ul>
          <li>You begin with 7 letters taken from the tile bag, each with different score value.</li>
          <li>The goal is to make an English word as long as possible with the letters given.</li>
          <li>The score will be the sum of letter values and a magical bonus based on the word length.</li>
          <li>The word submitted from the previous round will be used again for this round.</li>
          <li>You can use up to half the letters of the previous round.</li>
          <li>The letter from the previous round will only grant bonus point and not the letter value.</li>
          <li>You will lose if you score below 300 points for 3 consecutive rounds.</li>
          <li>You will win if you use up the tile bag.</li>
          <li>Each shuffle counts as one round with no score gained. Have fun!</li>
        </ul>
      </>
    
  // } else {
    // return (
      : <button className="btn btn-success" onClick={props.onClick}>Show instructions</button>
    )
  
}