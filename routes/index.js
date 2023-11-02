var express = require('express');
var router = express.Router();
const { Data, Menu,Library } = require('../model.js');
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
  res.render('index');
});




router.get('/indexadmin', function (req, res, next) {
  res.render('indexadmin');
});

router.get('/reguser', function (req, res, next) {
  res.render('reguser');
});

router.post('/userreg', async (req, res, next) => {
  try {

    const saltRounds = 10;
    
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new Data({ username, email,  password: hashedPassword, usertype: 1 });
    const savedUser = await newUser.save();

    if (savedUser) {
      res.redirect('/reguser');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error creating and inserting user:', error);
    res.redirect('/registration-failure');
  }
});


router.get('/login', function (req, res, next) {
  res.render('login');
});




router.post('/loginuser', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Data.findOne({ email: email });


    if (!user) {
      console.log('No data found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.loginid = user._id;
      if (user.usertype === 1) {
        return res.redirect('/indexuser');
      } else if (user.usertype === 0) {
        return res.redirect('/indexadmin');
      } else {
        return res.redirect('/login');
      }
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.redirect('/login-error');
  }
});


router.get('/indexuser', async function (req, res) {
  try {
  
    const id = req.session.loginid;
    const datas = await Data.findById(id);
    if (!datas) {
      return res.status(404).render('error404');
    }
    res.render('indexuser', { datas });
  } catch (error) {
   
    console.error('Error fetching data:', error);
    res.status(500).render('error500');
  }
});


router.get('/adminuserview', async function (req, res, next) {
  try {
    const datas = await Data.find();
    res.render('adminuserview', { datas });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/madeadmin/:_id", async (req, res) => {
  try {
    const id = req.params._id;
    const user = await Data.findByIdAndUpdate({ _id: id }, { $set: { usertype: 0 } });

    if (!user) {
      console.log('No data found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }
    res.redirect('/adminuserview');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.get('/userprofile', async function (req, res, next) {
  try {
    const id = req.session.loginid;
    const datas = await Data.findById({ _id: id });
    res.render('userprofile', { datas });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post("/updateuserprofile", async (req, res) => {
  try {
    const id = req.session.loginid;
    const { username, email, password } = req.body;
    const user = await Data.findByIdAndUpdate({ _id: id }, { $set: { username, email, password } });

    if (!user) {
      console.log('No data found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }
    res.redirect('/indexuser');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/adminprofile', async function (req, res, next) {
  try {
    const id = req.session.loginid;
    const datas = await Data.findById({ _id: id });
    res.render('adminprofile', { datas });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/menuadd', function (req, res, next) {
  res.render('menuadd');
});

router.post('/categoryadd', async (req, res) => {
  try {
    const foodname = req.body.foodname;
    const region = req.body.region;
    const category = req.body.category;
    const desc = req.body.desc;

    
    const newMenuItem = {
      foodname,
      item: [
        {
          region,
          item1: [
            {
              category,
              item2: [
                {
                  desc,
                },
              ],
            },
          ],
        },
      ],
    };

    // Save the menu item to your database
    const menu = new Menu(newMenuItem);
    await menu.save();

    console.log('Menu and nested data saved.');
    res.redirect('/menuadd');
  } catch (err) {
    console.error(err);
  
    res.status(500).send('Error saving data');
  }
});

router.get('/menudisplay', async (req, res) => {
  try {
    const menuItems = await Menu.find(); // Retrieve all menu items from the database
    res.render('menudisplay', { menuItems }); // Pass the data to the view
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/adminmenuview', async (req, res) => {
  try {
    const menuItem = await Menu.find(); 
    res.render('adminmenuview', { menuItem }); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/deletemenu/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await Menu.findByIdAndDelete(itemId);
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
      
    res.redirect('/adminmenuview');
  } catch (error) {
    
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/menuedit/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemToEdit = await Menu.findById(itemId);

    if (!itemToEdit) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.render('menuedit', { itemToEdit });
  } catch (error) {
  
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.post('/menuupdate/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { foodname, region, category, desc } = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(itemId, {
      foodname,
      'item.0.region': region,
      'item.0.item1.0.category': category,
      'item.0.item1.0.item2.0.desc': desc,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Menu item updated successfully.');
    res.redirect('/adminmenuview');
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating data' });
  }
});


















router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});



module.exports = router;
