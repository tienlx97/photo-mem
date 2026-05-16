function classNames(styles, ...values) {
  const tokens = [];

  for (const value of values.flat(Infinity)) {
    if (!value) {
      continue;
    }

    if (typeof value === "string") {
      tokens.push(...value.split(/\s+/).filter(Boolean));
      continue;
    }

    if (typeof value === "object") {
      for (const [token, enabled] of Object.entries(value)) {
        if (enabled) {
          tokens.push(token);
        }
      }
    }
  }

  return tokens.map((token) => styles[token] ?? token).join(" ");
}

export function createCx(...styleMaps) {
  const styles = Object.assign({}, ...styleMaps);

  return (...values) => classNames(styles, ...values);
}
