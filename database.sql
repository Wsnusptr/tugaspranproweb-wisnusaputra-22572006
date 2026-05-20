CREATE DATABASE sinema_jayakarta;
USE sinema_jayakarta;

CREATE TABLE movie (
    id_film INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tahun_rilis INT,
    sutradara VARCHAR(255),
    sinopsis TEXT,
    rating DECIMAL(3,1),
    bahasa VARCHAR(100),
    cover VARCHAR(600)
);

CREATE INDEX idx_judul ON movie(judul);
CREATE INDEX idx_tahun ON movie(tahun_rilis);
CREATE INDEX idx_sutradara ON movie(sutradara);
CREATE INDEX idx_rating ON movie(rating);
CREATE INDEX idx_bahasa ON movie(bahasa);