export function getAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

export function getWeeksBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const weeks = Math.floor(diffInMilliseconds / millisecondsPerWeek);
  return weeks;
}

