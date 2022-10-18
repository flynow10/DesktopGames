export const isDebug = true;
export const debug = {
  fastStart: string("none"),
};

function bool(value) {
  if (isDebug) {
    return value;
  }
  return false;
}

function string(value) {
  if (isDebug) {
    return value;
  }
  return "none";
}

function int(value) {
  if (isDebug) {
    return value;
  }
  return 0;
}
