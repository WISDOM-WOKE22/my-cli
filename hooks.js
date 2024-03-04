exports.afterStart = async (...fns) => {
  for (const fn of fns) {
    await fn();
  }
};

exports.beforeMigrate = async (...fns) => {
  for (const fn of fns) {
    await fn();
  }
};

exports.afterMigrate = async (...fns) => {
  for (const fn of fns) {
    await fn();
  }
};
