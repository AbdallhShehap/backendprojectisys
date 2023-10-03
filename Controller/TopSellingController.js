

const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataProducts = require("../Module/allData"); // Import your database connection
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage });

const fs = require('fs');
const path = require('path');

addTopSelling = async (req, res) => {
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
      const query = 'INSERT INTO top_selling (product_id , main_image) VALUES (?, ?)';

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

router.post('/add', upload.single('imagePath'), addTopSelling);







// const editTopSelling = async (req, res) => {
//   const itemId = req.params.id;
//   const {product_id, main_image } = req.body;
//   console.log(itemId);
//   console.log(product_id);
//   console.log(main_image);
//   if (!product_id || !main_image) {
//       return res.status(400).json({ error: 'Missing parameters in the request body' });
//   }

//   // Fetch the old image path from the database first
//   dataProducts.query(
//       'SELECT main_image FROM top_selling WHERE id = ?',
//       [itemId],
//       async (error, results) => {
//           if (error) {
//               console.error(error);
//               return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           if (results.length === 0) {
//               return res.status(404).json({ error: 'Item not found' });
//           }

//           const oldImagePath = results[0].main_image;

//           // Save the new image in the folder
//           const uploadDirectory = path.join(__dirname, '..', 'imagesists');
//           const fileName = path.basename(oldImagePath);
//           const filePath = path.join(uploadDirectory, fileName);

//           try {
//               await fs.promises.writeFile(filePath, main_image);
//               console.log('New image saved successfully:', filePath);
//           } catch (error) {
//               console.error('Error saving the new image:', error);
//               return res.status(500).json({ error: 'Image upload failed' });
//           }

//           // Update the product details and image path in the database
//           dataProducts.query(
//               'UPDATE top_selling SET product_id = ?, main_image = ? WHERE id = ?',
//               [product_id, oldImagePath, itemId], // Use the old image path
//               (updateError, updateResults) => {
//                   if (updateError) {
//                       console.error(updateError);
//                       return res.status(500).json({ error: 'Internal Server Error' });
//                   }

//                   console.log('Item updated successfully');
//                   res.status(200).json({ message: 'Item updated successfully' });
//               }
//           );
//       }
//   );
// };



const editTopSelling = async (req, res) => {
  const itemId = req.params.id;
  const { product_id, main_image } = req.body;

  if (!product_id || !main_image) {
      return res.status(400).json({ error: 'Missing parameters in the request body' });
  }

  // Check if there is a new image uploaded
  if (req.file) {
      const uploadDirectory = path.join(__dirname, '..', 'imagesists');
      const file = req.file;
      const fileName = file.originalname;
      const filePath = path.join(uploadDirectory, fileName);

      try {
          // Save the uploaded image to the specified folder
          await fs.promises.writeFile(filePath, file.buffer);

          console.log("New image saved successfully:", filePath);

          const newImagePath = `imagesists/${fileName}`;

          // Update the database with the new product_id and main_image, replacing the old one
          dataProducts.query(
              'UPDATE top_selling SET product_id = ?, main_image = ? WHERE id = ?',
              [product_id, newImagePath, itemId],
              (error, results) => {
                  if (error) {
                      console.error(error);
                      // Handle the error
                      res.status(500).json({ error: 'Internal Server Error' });
                  } else {
                      console.log('Item updated successfully');
                      res.status(200).json({ message: 'Item updated successfully' });
                  }
              }
          );
      } catch (error) {
          console.error("Error saving the new image:", error);
          return res.status(500).json({ error: "Image upload failed" });
      }
  } else {
      // If no new image is uploaded, update the database with the new product_id only
      dataProducts.query(
          'UPDATE top_selling SET product_id = ? WHERE id = ?',
          [product_id, itemId],
          (error, results) => {
              if (error) {
                  console.error(error);
                  // Handle the error
                  res.status(500).json({ error: 'Internal Server Error' });
              } else {
                  console.log('Item updated successfully (no new image)');
                  res.status(200).json({ message: 'Item updated successfully' });
              }
          }
      );
  }
};


// Define the route for editing a top-selling item
router.put('/edit/:id', editTopSelling);




deleteTopSelling = async (req, res) => {
  const itemId = req.params.id;
      console.log(itemId);

  dataProducts.query(
      'DELETE FROM top_selling WHERE id = ?',
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

router.delete('/delete/:id', deleteTopSelling);



    const getTopSelling  = (req, res) => {

        const query = 'SELECT * FROM top_selling';
        dataProducts.query(query, (err, results) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
          res.json(results);
        });
      }
      
      router.get('/gettopselling', getTopSelling);


    const getTopSellingByProductid  = (req, res) => {
      const itemId = req.params.id;
      console.log(itemId);

        const query = 'SELECT main_image FROM top_selling WHERE product_id = ? ';
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
      
      router.get('/gettopsellingbyproductid/:id', getTopSellingByProductid);





      const getTopSellingById = (req, res) => {
        const itemId =  req.params.id ;
      
        const query = 'SELECT * FROM top_selling  WHERE id = ?'
      
        dataProducts.query(query ,
        [itemId], (err, results) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
          
           console.log(results);
           res.status(200).json({ results });
        });
      }

      router.get('/gettopsellingbyid/:id', getTopSellingById);


      
      module.exports = router;


// module.exports = { editTopSelling , deleteTopSelling , getTopSelling , getTopSellingById }