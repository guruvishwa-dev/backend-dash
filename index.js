import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password@123',
    database: 'Adroll',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
    res.json('Welcome to the backend');
});

app.get('/tables', (req, res) => {
    const q = 'SHOW TABLES FROM Adroll'
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ table: data });

        //  const tableNames = data.map(item => item[`Tables_in_Adroll`]); // Adjust this based on your actual column name

        // // Return plain array of table names
        // return res.json(tableNames);
    });
});

app.get('/Campaign', (req, res) => {
    const q = 'SELECT * FROM Campaign';
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ Campaign: data });
    });
});
app.get('/dyn_creatives', (req, res) => {
    const q = 'SELECT * FROM dyn_creatives';
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ Campaign: data });
    });
});

app.get('/bot_clicks', (req, res) => {
    const q = 'SELECT * FROM bot_clicks';
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ Campaign: data });
    });
});

app.get('/columns/:table', (req, res) => {
    const table = req.params.table;
    const q = `SHOW COLUMNS FROM ${table}`;
    db.query(q, (err, data) => {
        if (err) {
            console.error('Error fetching columns:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ columns: data.map(col => col.Field) });
    });
});

app.post('/dyn_creatives', (req, res) => {
    const { adv_id, config_status, match_rate, sorg_status, pixel_status } = req.body;
    const query = 'INSERT INTO dyn_creatives (adv_id, config_status, match_rate, sorg_status, pixel_status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [adv_id, config_status, match_rate, sorg_status, pixel_status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database insertion error', details: err });
        }
        res.status(201).json({ message: 'Data inserted successfully', data: req.body });
    });
});

app.post('/bot_clicks', (req, res) => {
    const { adv_eid, adv_name, click_type, click, click_share } = req.body;
    const query = 'INSERT INTO bot_clicks (adv_eid, adv_name, click_type, click, click_share) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [adv_eid, adv_name, click_type, click, click_share], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database insertion error', details: err });
        }
        res.status(201).json({ message: 'Data inserted successfully', data: req.body });
    });
});

app.post('/query', (req, res) => {
    const query = req.body.query;
    db.query(query, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json({ results: data });
    });
});

app.listen(8800, () => {
    console.log('Server running on port 8800');
});
