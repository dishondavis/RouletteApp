module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('Roulette').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            casinoOwner: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/cleanSlate', (req, res) => {
      db.collection('Roulette').save({
        wins: 0,
        loss: 0,
        winningBalance: 0,
        losingBalance: 0,
        casinoTotal: 0,
        casinoID: 'Kaia'
      },
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({baristaName: req.body.baristaName, completed: false
    //     // , customerName: req.body.customerName, order: req.body.order, completed: false,
    //   }, {
    //     $set: {
    //       completed: true
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: false
    //   },  (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

// <<<<<<< HEAD
// =======
    app.put('/play', (req, res) => {
      console.log(req);
      db.collection('Roulette')
      .findOneAndUpdate({casinoID: req.body.casinoID}, {
        $set: {
          wins: req.body.wins,
          loss: req.body.loss,
          casinoTotal: req.body.casinoTotal
        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })




    // app.delete('/cafe', (req, res) => {
    //   db.collection('Roulette').findOneAndDelete({baristaName: req.body.baristaName}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
