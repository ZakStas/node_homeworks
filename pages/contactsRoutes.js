const express = require("express");

const contactRouter = express.Router();
const contacts = require("../contacts");

contactRouter.get("/contacts", contacts.listContacts);
contactRouter.get("/contacts/:id", contacts.getById);
contactRouter.post("/contacts", contacts.validateCreateContact);
contactRouter.delete("/contacts/:id", contacts.removeContact);
contactRouter.patch("/contacts/:id", contacts.validateUpdateContact, contacts.updateContact);

module.exports = contactRouter;
