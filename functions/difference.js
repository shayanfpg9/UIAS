function difference(first, second) {
  const diff = {};

  Object.keys(first).forEach((key) => {
    if (Object.keys(second).includes(key)) {
      if (JSON.stringify(first[key]) !== JSON.stringify(second[key])) {
        diff[key] = {
          action: "Change",
          before: first[key],
          after: second[key],
        };
      }
    } else {
      diff[key] = {
        action: "Remove",
        before: first[key],
        after: undefined,
      };
    }
  });

  if (Object.keys(second).toString() !== Object.keys(first).toString()) {
    const afterKeys = Object.keys(second).filter(
      (key) => !Object.keys(first).includes(key)
    );

    afterKeys.forEach((key) => {
      diff[key] = {
        action: "Add",
        before: undefined,
        after: second[key],
      };
    });
  }

  return JSON.stringify(diff) === "{}" ? null : diff;
}

module.exports = difference;
