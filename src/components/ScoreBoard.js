export default function ScoreBoard(props) {
  return (
    <div id="score" className="panel panel-default panel-heading">
      <div className="score-text">Score</div>
      <div className="score-value">{props.score}</div> 
    </div>
  );
}