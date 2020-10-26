function calculateBonus(level) { // per letter
  // checked
  let grant;
  switch (level) {
    case "easy":
      grant = 5;
      break;
    case "medium":
      grant = 7;
      break;
    case "hard":
      grant = 9;
      break;
    default:
      grant = 7;
  }
  const bonus = 100 - Math.floor(Math.random() * grant) * 10;
  return bonus;
}

export default function ScoreRound(board,level) { // return score for each round. pass Board for now, maybe level for later
  let bonus = calculateBonus(level);
  let current_score = board.map((i) => i.score*10).reduce((a,b) => (a+b),0) + board.length*bonus;
  return [bonus, current_score];
}