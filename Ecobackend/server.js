import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Cloth } from './models/schemas.js';
import connectDB from './database/Connect.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
});
app.post('/admin', upload.single('file'), async (req, res) => {
    const { price, desc, category } = req.body;
    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const newCloth = new Cloth({
            price,
            desc,
            category,
            image_url: fileUrl,
        });
        await newCloth.save();

        res.status(201).json({ msg: 'File uploaded successfully', fileUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ msg: 'File not uploaded', error: error.message });
    }
});
app.get('/images',async(req,res)=>{
    try {
        const images=await Cloth.find();
        res.status(200).json(images);
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ msg: 'Error getting images', error: error.message });
    }
})
const PORT = 3000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};
startServer();