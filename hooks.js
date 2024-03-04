#!/usr/bin/env node

exports.afterStart = async (...fns) => {
  for (const fn of fns) {
    await fn();
  }
};

exports.beforeMigrate = async (...fns) => {
  // Implement logic before database migration
  for (const fn of fns) {
    await fn();
  }
};

exports.afterMigrate = async (...fns) => {
  // Implement logic after database migration
  for (const fn of fns) {
    await fn();
  }
};
