"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
// app.use(express.static(path.join(__dirname, 'views/js')));
// app.use(express.static('public'))
app.use(body_parser_1.default.json());
const port = 5000;
app.get('/', (req, res) => {
    res.render('index');
});
// app.use('/api/uploadCSV', );
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
