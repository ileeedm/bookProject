import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "159357",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Shinnig",url:"https://covers.openlibrary.org/b/olid/OL53210900M-M.jpg" },
  { id: 2, title: "Waking up" ,url:"https://covers.openlibrary.org/b/olid/OL32164562M-M.jpg"},
  { id: 3, title: "Finish homework",url:"https://covers.openlibrary.org/b/olid/OL32047814M-M.jpg" },
  { id: 4, title: "Finish homework",url:"" }
];

app.get("/", async (req, res) => {
  let urls = items.map(item => item.url);
  urls = urls.filter(url => url);
  console.log(urls)
  
  try {
    const responses = await Promise.all(
      urls.map(url =>
        axios.get(url, { responseType: 'arraybuffer' })
      )
    );
    
    const images = responses.map(response => {
    return Buffer.from(response.data, 'binary').toString('base64');
   
    });
    
    // You can now use these base64 strings in your app
    images.map(image => `data:image/jpeg;base64,${image}`)
  
    res.render('index.ejs',{listItems:images})
    
  } catch (error) {
    console.error('Error fetching images:', error);
  }
  
});


app.post("/add",async (req, res) => {

});

app.post("/edit", async(req, res) => {

  
});

app.post("/delete", async (req, res) => {

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
