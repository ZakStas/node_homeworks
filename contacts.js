
const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
      if (error) {
          return console.log(error);
      }

      const contacts = JSON.parse(data);
      console.log('List of contacts: ');
      console.table(contacts);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
      if (error) {
          return console.log(error);
      }

      const contacts = JSON.parse(data);

      const contact = contacts.find(contact => {
          if (contact.id === contactId) {
              console.log(`Получить контакт по ID ${contactId}:`);
              console.table(contact);
              return contact;
          }
      });

      if (contact == null) {
          console.log(`Контакт с ID "${contactId}" не найден!`);
      }
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
      if (error) {
          return console.log(error);
      }

      const contacts = JSON.parse(data);
      const newContact = contacts.filter(contact => contact.id !== contactId);

      if (newContact.length === contacts.length) {
          console.log(
              `Контакт с ID "${contactId}" не удален! ID "${contactId}" не найден!`,
          );
          return;
      }

      console.log('Контакт успешно удален! Новый список контактов: ');
      console.table(newContact);

      fs.writeFile(contactsPath, JSON.stringify(newContact), error => {
          if (error) {
              return console.log('error :', error);
          }
      });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
      if (error) {
          return console.log(error);
      }

      const contacts = JSON.parse(data);

      contacts.push({
          id: contacts.length + 1,
          name: name,
          email: email,
          phone: phone,
      });

      console.log('Контакты успешно добавлены! Новый список контактов: ');
      console.table(contacts);

      fs.writeFile(contactsPath, JSON.stringify(contacts), error => {
          if (error) {
              return console.log(error);
          }
      });
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};