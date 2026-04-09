const express = require('express');
const db = require('./database');

const app = express();
const port = 3000;

app.use(express.json());

// get semua data movie
app.get('/movies', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM movie');
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

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal cari data' });
    }
});

// insert data movie
app.post('/movies', async (req, res) => {
    try {
        const { judul, tahun_rilis, sutradara, sinopsis, rating, bahasa } = req.body;
        const [result] = await db.query(
            'INSERT INTO movie (judul, tahun_rilis, sutradara, sinopsis, rating, bahasa) VALUES (?, ?, ?, ?, ?, ?)',
            [judul, tahun_rilis, sutradara, sinopsis, rating, bahasa]
        );
        res.status(201).json({ message: 'Berhasil tambah movie', id_film: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal tambah data' });
    }
});

// update data movie by id_film
app.put('/movies/:id_film', async (req, res) => {
    try {
        const { id_film } = req.params;
        const { judul, tahun_rilis, sutradara, sinopsis, rating, bahasa } = req.body;
        const [result] = await db.query(
            'UPDATE movie SET judul = ?, tahun_rilis = ?, sutradara = ?, sinopsis = ?, rating = ?, bahasa = ? WHERE id_film = ?',
            [judul, tahun_rilis, sutradara, sinopsis, rating, bahasa, id_film]
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
