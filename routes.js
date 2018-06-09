var multer  = require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');

var storage = multer.diskStorage({
	destination : (req, file, cb) => {
		var dir = './uploads/'+req.params.folder;
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
		cb(null, dir)},
	filename	: (req, file, cb) => {cb(null, file.originalname)}
});

var upload 	= multer({storage : storage});



module.exports = function (app, passport) {
	
	app.get('/', (req,res) => {
		res.render('home', {'user':req.user});
	});

	app.post('/upload/:folder', upload.any(), uploadFiles);

	function uploadFiles(req,res,next)
	{
		console.log(req.body);
		var files = [];
		for(var i=0; i<req.files.length; i++)
		{
			var temp = {};
			temp['fname'] = req.files[i].originalname;
			files.push(temp);
		}
		req.body['files'] = files;
		console.log(req.body);
		passport.authenticate('local-signup',
		{
		    successRedirect : '/',
	 		   failureRedirect : '/', 
		    failureFlash : false 
		})(req,res, next)
	}

	app.post('/signin', passport.authenticate('local-login', {
		successRedirect : '/',
	    failureRedirect : '/', 
		failureFlash : false 
	}));

	app.get('/logout', (req,res) => {
		req.logout();
		res.redirect('/');
	});

}