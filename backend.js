const bodyParser = require('body-parser');
const express = require('express');
const router = require('./src/routes/router');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const db = require('./src/config/database');
const fs = require('fs');

const createRolesTable = require('./src/tables/rolesTable');
const createUsersTable = require('./src/tables/usersTable');
const createContentFieldsTable = require('./src/tables/contentFieldsTable');
require('./src/routes/userRoutes');
require('./src/routes/authRoutes');
const send = require("./src/transformers/message");

dotenv.config();

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${(Math.random() + 1).toString(36).substring(9)}-${Date.now() % 1000000}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // if (file.mimetype.startsWith('image/')) {
  cb(null, true);
  // } else {
  //     cb(new Error('Only image files are allowed!'), false);
  // }
};

const upload = multer({storage, fileFilter});

app.use('/api', router);

router.get('/', async (req, res) => {
  return send(res, 200, "Hi page");
});

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const {filename} = req.file;
    const filePath = "uploads/" + filename;

    return send(res, 200, filePath);
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return send(res, 500, 'Error uploading file.');
  }
});

const startServer = async () => {
  try {
    await db.connect();
    await createRolesTable(db);
    await createUsersTable(db);
    await createContentFieldsTable(db);

    const port = 8080;
    const currentDateUTC = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Aqtau',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const formattedDate = formatter.format(currentDateUTC);
    console.log(`Server is running on port ${port} - ${formattedDate}`);
    app.listen(port);
  } catch (error) {
    console.error('Error:', error);
  }
};

startServer();
