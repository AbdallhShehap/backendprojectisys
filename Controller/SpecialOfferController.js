

const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataProducts = require("../Module/allData"); // Import your database connection
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage });

const fs = require('fs');
const path = require('path');

addSpecial_offers = async (req, res) => {
  const uploadDirectory = path.join(__dirname, '..', 'imagesists');

  // Check if there is a file uploaded
  if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
  }

  const file = req.file;
  const fileName = file.originalname;
  const filePath = path.join(uploadDirectory, fileName);

  try {
      // Save the uploaded image to the specified folder
      await fs.promises.writeFile(filePath, file.buffer);

      console.log("Image saved successfully:", filePath);

      const imagePath = `imagesists/${fileName}`;

      const product_id = req.body.product_id;
      const query = 'INSERT INTO special_offers (product_id , main_image) VALUES (?, ?)';

      try {
          await dataProducts.query(query, [product_id, imagePath]);

          res.status(200).json({ message: "Image uploaded and saved successfully" });
      } catch (error) {
          console.error("Error inserting image path into the database:", error);
          return res.status(500).json({ error: "Image upload and database update failed" });
      }
  } catch (error) {
      console.error("Error saving the image:", error);
      return res.status(500).json({ error: "Image upload failed" });
  }
};

router.post('/add', upload.single('main_image'), addSpecial_offers);





const editSpecial_offers = async (req, res) => {
    const itemId = req.params.id;
    const { product_id, main_image } = req.body;
  
    try {
      // Check if there is a new image uploaded
      if (req.file) {
        // ... (your image handling code remains unchanged) ...
  
        // Update the database with the new product_id and main_image
        const updateQuery = 'UPDATE special_offers SET product_id = ?, main_image = ? WHERE id = ?';
  
        dataProducts.query(updateQuery, [product_id, newImagePath, itemId], (error, results) => {
          if (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Item updated successfully');
            res.status(200).json({ message: 'Item updated successfully' });
          }
        });
      } else {
        // If no new image is uploaded, update the database with the new product_id only
        const updateQuery = 'UPDATE special_offers SET product_id = ? WHERE id = ?';
  
        dataProducts.query(updateQuery, [product_id, itemId], (error, results) => {
          if (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Item updated successfully (no new image)');
            res.status(200).json({ message: 'Item updated successfully' });
          }
        });
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Define the route for editing a top-selling item
  router.put('/edit/:id', editSpecial_offers);
  
  

    deleteSpecial_offers = async (req, res) => {
        const itemId = req.params.id;
            console.log(itemId);
    
        dataProducts.query(
            'DELETE FROM special_offers WHERE id = ?',
            [itemId],
            (error, results) => {
                if (error) {
                    console.error(error);
                    // Handle the error
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('Item deleted successfully');
                    res.status(200).json({ message: 'Item deleted successfully' });
                }
            }
        );
    }

    router.delete('/delete/:id', deleteSpecial_offers);





        const getSpecial_offers  = (req, res) => {

            const query = 'SELECT * FROM special_offers';
            dataProducts.query(query, (err, results) => {
              if (err) {
                console.error('Error executing SQL query:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
              }
              res.json(results);
            });
          }
          
          router.get('/getspecialoffers', getSpecial_offers);
    
    


        const getSpecial_offersByProductid  = (req, res) => {
          const itemId = req.params.id;
          console.log(itemId);
    
            const query = 'SELECT product_id FROM special_offers WHERE id = ? ';
            dataProducts.query(query ,
              [itemId], (err, results) => {
              if (err) {
                console.error('Error executing SQL query:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
              }
              res.json(results);
            });
          }
          
          router.get('/getspecialoffersbyid/:id', getSpecial_offersByProductid);
    
    
    
    

    
      
      module.exports = router;


// module.exports = { editTopSelling , deleteTopSelling , getTopSelling , getTopSellingById }