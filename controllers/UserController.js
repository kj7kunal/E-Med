const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");


class PatientsController {
  /**
   * Liste of Articles
   * @param {*} req
   * @param {*} res
   */
  liste(req, res) {
    db.Articles.findAll().then(articles =>
      res.render("articles/index", { articles })
    );
  }
  /**
   * Store a new patient in database
   * @param {*} req
   * @param {*} res
   */
  store(patientInfo) {
  	console.log("Storing new patient in DB");
    db.patient.create({
            "first_name": patientInfo.firstName,
            "last_name": patientInfo.lastName,
            "dob": patientInfo.dob,
            "gender": patientInfo.gender,
            "street_address": patientInfo.streetAddress,
            "city": patientInfo.city,
            "gender": "F",
            "state": patientInfo.state,
            "zip": patientInfo.zip,
            "telephone": patientInfo.telephone,
            "height": patientInfo.height,
            "weight": patientInfo.weight,
            "allergies": patientInfo.allergies,
            "procedures": patientInfo.procedures,
            "emergency_contact_name": patientInfo.emergencyContactName,
            "emergency_contact_number": patientInfo.emergencyContactNumber,
            "provider_name": patientInfo.providerName,
            "image": patientInfo.image
        })
        .then(() => {
            return res.redirect("/physician/list");
        })
  }

  /**
   * Update a article
   * @param {*} req
   * @param {*} res
   */
  update(req, res) {
    const id = req.params.id;
    db.Articles.findById(id).then(article =>
      res.render("articles/update", { article })
    );
  }
  /**
   * Upgrade a article in database
   * @param {*} req
   * @param {*} res
   */
  upgrade(req, res) {
    const id = req.params.id;
    db.Articles.update(req.body, { where: { id } }).then(article =>
      res.redirect("/articles/liste")
    );
  }
  /**
   * Remove an article in database
   * @param {*} req
   * @param {*} res
   */
  remove(req, res) {
    const id = req.params.id;
    db.Articles.destroy({
      where: { id }
    }).then(() => res.redirect("/articles/liste"));
  }

  /**
   * Show a article
   * @param {*} req
   * @param {*} res
   */
  show(req, res) {
    const id = req.params.id;
    db.Articles.findById(id).then(article =>
      res.render("articles/show", { article })
    );
  }
}

module.exports = PatientsController;
