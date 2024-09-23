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


app.get("/", async (req, res) => {
  //Image url From base
  let text
  const result = await db.query("SELECT image_url FROM book ORDER BY id ASC");
  const urlPg = result.rows
  let urls = urlPg.map(item => item.image_url);
  
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
    
    //Wokrs url from api
    const works = await db.query("SELECT work_url FROM book ORDER BY id ASC");
    const urlWork = works.rows
    let urlsWork = urlWork.map(item => item.work_url);
    console.log(urlsWork)
    
    try{
      const responses = await Promise.all(
        urlsWork.map(url => axios.get(url)
      
      )
    )
    const workUrls = responses.map(response => {
      const description = response.data.description;
      
      if (typeof description === 'object') {
        return description.value
      }
      else {
        return description
      }
    
      })
      text = workUrls
      text = text.map(text => text.replace(/[\r\n]+/g, ' ') // Replace \r\n with a space
      .replace(/\+/g, '') // Remove all '+' signs
      .replace(/,/g, '') // Remove all ',' signs
      .replace(/\//g, '') // Remove all '/' signs
      .replace(/----------/g, '') // Remove all occurrences of '----------'
      .replace(/-\s*\[/g, '') // Remove occurrences of '- [' (including space after '-')
      .trim())
      console.log(text)
    
    
    }catch(error){
      console.log('error fetching work details')
    }
 
  
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
