const Contact = require('./contacts.model');

async function listContacts(req, res) {
    const contactList = await Contact.find();
	res.send(contactList);
}

async function getContact(req, res) {
	const { id } = req.params;

    // const requestedUser = await Contact.find({ _id: id });
    const requestedContact = await Contact.findById(id);

	if (!requestedUser) {
		const err = new Error(`Contact with id ${id} does not exist`);
		err.status = 404;
		throw err;
	}

	res.send(requestedContact);
}

async function createContact(req, res) {
    const newUser = await Contact.create({ ...req.body });
    
	res.status(201).send(newUser);
}

async function updateContact(req, res) {
	const { id } = req.params;

	const contactUpdate = await Contact.findOneAndUpdate({_id:id}, {$set: {...req.body}}, { new: true })

	
	res.send(contactUpdate);
}

async function deleteContact(req, res) {
	const { id } = req.params;

    const contactDel = await Contact.findOneAndDelete({ _id: id });

	res.send(contactDel);
}

module.exports = {
  listContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
}
