import { Contact } from "../models/contact.js";

export const listContacts = async () => {
  // Повертає масив контактів.
  const result = await Contact.find({}, "-createdAt -updatedAt");
  return result;
};

export const getContactById = async (id) => {
  // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findById(id);
  return result || null;
};

export const removeContact = async (id) => {
  // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findByIdAndRemove(id);
  return result || null;
};

export const addContact = async (data) => {
  // Повертає об'єкт доданого контакту.
  const result = await Contact.create(data);
  return result;
};
export const updateContactById = async (id, data) => {
  // Повертає оновлений об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  return result || null;
};

export const updateStatusContactbyId = async (id, data) => {
  // Повертає об'єкт з оновленим статусом  контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  return result || null;
};
