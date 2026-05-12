export function getMutualSkillCount(match) {
  return match?.mutual_skills?.length ?? 0;
}

export function getMatchLabel(score) {
  if (score >= 80) return 'Excellent match';
  if (score >= 60) return 'Strong match';
  if (score >= 40) return 'Good match';
  return 'Potential match';
}
