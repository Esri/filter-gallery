/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-components/blob/master/LICENSE.md for details.
 */
/**
 * Standardize key property of keyboard event (mostly for ie11)
 */
function getKey(key, dir) {
  const lookup = {
    Up: "ArrowUp",
    Down: "ArrowDown",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Spacebar: " ",
    Esc: "Escape"
  };
  const adjustedKey = lookup[key] || key;
  const isRTL = dir === "rtl";
  if (isRTL && adjustedKey === "ArrowLeft") {
    return "ArrowRight";
  }
  if (isRTL && adjustedKey === "ArrowRight") {
    return "ArrowLeft";
  }
  return adjustedKey;
}
function isActivationKey(key) {
  key = getKey(key);
  return key === "Enter" || key === " ";
}
const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export { getKey as g, isActivationKey as i, numberKeys as n };
