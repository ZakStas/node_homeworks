const { Router } = require('express');
const contactRouter = Router();
const {
	validateCreateContact,
  validateUpdateContact
} = require('../helpers/validate');

const {
	  listContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
} = require('./contacts.controller');


contactRouter.get('/', listContacts);
contactRouter.get('/:id', getContact);
contactRouter.post('/', validateCreateContact, createContact);
contactRouter.put('/:id', validateUpdateContact, updateContact);
contactRouter.delete('/:id', deleteContact);

module.exports = contactRouter;



