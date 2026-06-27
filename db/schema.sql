-- Simple-Server MariaDB storage backend schema.
-- Run against the database named in MARIADB_DATABASE, e.g.:
--   mariadb -h <host> -u <user> -p <database> < db/schema.sql

CREATE TABLE IF NOT EXISTS previews (
  slug       VARCHAR(255) NOT NULL,
  content    MEDIUMTEXT   NOT NULL,            -- HTML body, up to ~16 MB
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
