const express = require('express');
const db = require('./database');

const app = express();
const port = 3000;

app.use(express.json());

// get semua data movie
app.get('/movies', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM movie ORDER BY id_film');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal ambil data' });
    }
});

// get data by judul atau sutradara
app.get('/movies/search', async (req, res) => {
    try {
        const { judul, sutradara } = req.query;
        let sql = 'SELECT * FROM movie WHERE 1=1';
        const params = [];

        if (judul) {
            sql += ' AND judul LIKE ?';
            params.push(`%${judul}%`);
        }
        if (sutradara) {
            sql += ' AND sutradara LIKE ?';
            params.push(`%${sutradara}%`);
        }

        sql += ' ORDER BY id_film';
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal cari data' });
    }
});

// get detail movie by id_film
app.get('/movies/:id_film', async (req, res) => {
    try {
        const { id_film } = req.params;
        const [rows] = await db.query('SELECT * FROM movie WHERE id_film = ?', [id_film]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Movie tidak ditemukan' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal ambil data' });
    }
});

// insert data movie
app.post('/movies', async (req, res) => {
    try {
        const { judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, cover } = req.body;

        const [existingRows] = await db.query('SELECT id_film FROM movie ORDER BY id_film ASC');
        let nextId = 1;
        for (const row of existingRows) {
            if (row.id_film === nextId) {
                nextId += 1;
            } else if (row.id_film > nextId) {
                break;
            }
        }

        const [result] = await db.query(
            'INSERT INTO movie (id_film, judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, cover) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nextId, judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, cover]
        );
        res.status(201).json({ message: 'Berhasil tambah movie', id_film: nextId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal tambah data' });
    }
});

// update data movie by id_film
app.put('/movies/:id_film', async (req, res) => {
    try {
        const { id_film } = req.params;
        const { judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, cover } = req.body;
        const [result] = await db.query(
            'UPDATE movie SET judul = ?, tahun_rilis = ?, sutradara = ?, sinopsis = ?, rating = ?, bahasa = ?, cover = ? WHERE id_film = ?',
            [judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, cover, id_film]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie tidak ditemukan' });
        }
        res.json({ message: 'Berhasil update movie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal update data' });
    }
});

// delete data movie by id_film
app.delete('/movies/:id_film', async (req, res) => {
    try {
        const { id_film } = req.params;
        const [result] = await db.query('DELETE FROM movie WHERE id_film = ?', [id_film]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie tidak ditemukan' });
        }
        res.json({ message: 'Berhasil hapus movie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal hapus data' });
    }
});

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});
