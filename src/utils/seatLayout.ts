export const generateSeatGrid = (
  totalSeats: number,
  seatsPerRow: number = 10,
) => {
  const rows = Math.ceil(totalSeats / seatsPerRow);
  const grid: { rowLabel: string; seats: string[] }[] = [];

  for (let i = 0; i < rows; i++) {
    const rowLabel = String.fromCharCode(65 + (i % 26));
    const rowSeats: string[] = [];

    const seatsInThisRow =
      i === rows - 1 && totalSeats % seatsPerRow !== 0
        ? totalSeats % seatsPerRow
        : seatsPerRow;

    for (let j = 1; j <= seatsInThisRow; j++) {
      rowSeats.push(`${rowLabel}${j}`);
    }

    grid.push({ rowLabel, seats: rowSeats });
  }

  return grid;
};
