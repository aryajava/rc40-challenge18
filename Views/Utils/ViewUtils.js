export const sparator = (sep = "=", length = 50) => `${sep.repeat(length)}`;

export const centerText = (title, length = 50) => {
  const paddingLength = Math.max(0, length - title.length);
  const leftPadding = Math.floor(paddingLength / 2);
  const rightPadding = paddingLength - leftPadding;
  return " ".repeat(leftPadding) + title + " ".repeat(rightPadding);
};
