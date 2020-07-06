const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const getContacts = () => JSON.parse(fs.readFileSync(contactsPath, "utf-8"));

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

function listContacts(req, res) {
  const contactsList = getContacts();

  res.status(200).send(contactsList);
}

function getById(req, res) {
  const contactsList = getContacts();

  const contactSearch = contactsList.find(
    (contact) => contact.id === Number(req.params.id)
  );
  if (contactSearch) {
    res.status(200).send(contactSearch);
  } else {
    res.status(404).json({ message: "contact not found" });
  }
}

function validateCreateContact(req, res) {
  const { name, email, phone } = req.body;

  const result = contactsSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send({message: "missing required fields"});
  } else {
    let newContact = {
      id: Date.now(),
      name,
      email,
      phone,
    };

    const contactsList = getContacts();

    const updatedContacts = JSON.stringify([...contactsList, newContact]);

    fs.writeFile(contactsPath, updatedContacts, function (err) {
      if (err) return res.send(err);
      res.status(201).send(newContact);
    });
  }
}

function removeContact(req, res) {

  const contactsList = getContacts();

  const targetContact = contactsList.find(
    (contact) => contact.id === Number(req.params.id)
  );

  if (targetContact) {
    const contacts = contactsList.filter(
      (contact) => contact.id !== Number(req.params.id)
    );
    fs.writeFile(contactsPath, JSON.stringify(contacts), function (err) {
      if (err) return res.send(err);
      res.status(200).send({ message: "contact deleted" });
    });
  } else {
    res.status(404).send({ message: "Not found" });
  }
}

async function updateContact (req, res, next) {
    try {
      const contactsList = await fsPromise.readFile(contactsPath);

      const parsedContactsList = JSON.parse(contactsList);

      const targetContact = parsedContactsList.find(
        ({ id }) => id === parseInt(req.params.id)
      );

      if (targetContact) {
        Object.assign(targetContact, req.body);

        await fsPromise.writeFile(
          contactsPath,
          JSON.stringify(parsedContactsList)
        );
        res.status(200).send(targetContact);
      } else {
        res.status(404).send({ message: "Not found" });
      }
    } catch (err) {
      next(err);
    }
  };

  async function validateUpdateContact (req, res, next) {
    try {
      const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string(),
        phone: Joi.string(),
      });

      const validation = await schema.validate(req.body);

      if (validation.error) {
        return res.status(400).send({
          message: "missing fields",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };


module.exports = {
  listContacts,
  getById,
  validateCreateContact,
  removeContact,
  updateContact,
  validateUpdateContact,
};