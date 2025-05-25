export const round = (value, { decimals = 2, banker = false } = {}) => {
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const rounded = Math.round(scaled);

  if (banker && Math.abs(scaled % 1) === 0.5) {
    /* If exactly halfway, round to the nearest even number */
    return (Math.floor(scaled / 2) * 2) / factor;
  }
  return rounded / factor;
};