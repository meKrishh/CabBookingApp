import express from 'express'
import TaskService from '../services/task.service'
import auth from "../middleware/auth";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get("/getCabs", (req, res) => {
//   res.send(TaskService.getNearByCabs(req))
// });

// get user By userId
router.post("/getCabs", auth, (req, res) => {
  TaskService.getNearByCabs(req)
    .then(cabs => {
      res.status(200).json(cabs);
    })
    .catch(err => res.status(400).json(Response.somethingWentWrong()));
});

router.post("/cabs/booking", auth, (req, res) => {
  TaskService.bookCab(req)
    .then(cabs => {
      res.status(200).json(cabs);
    })
    .catch(err => res.status(400).json(Response.somethingWentWrong()));
});

router.post("/cabs/update/status", auth, (req, res) => {
  TaskService.updateBookingStatus(req)
    .then(cabs => {
      res.status(200).json(cabs);
    })
    .catch(err => res.status(400).json(Response.somethingWentWrong()));
});

router.post("/cabs/rides/get/completed", auth, (req, res) => {
  TaskService.getCompletedRides(req)
    .then(cabs => {
      res.status(200).json(cabs);
    })
    .catch(err => res.status(400).json(Response.somethingWentWrong()));
});

module.exports = router;
