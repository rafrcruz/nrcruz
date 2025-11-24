/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('hello_messages', {
    id: 'id',
    message: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.sql(
    `INSERT INTO hello_messages (message, created_at, updated_at) VALUES ('NRCruz app', now(), now())`
  );
};

exports.down = pgm => {
  pgm.dropTable('hello_messages');
};
