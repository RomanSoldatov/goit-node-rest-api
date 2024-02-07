import { Contact } from "../models/contact.js";

export const listContacts = async (req) => {
  // Повертає масив контактів.
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  return result;
};

export const getContactById = async (id) => {
  // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findById(id);
  return result || null;
};

export const removeContact = async (id) => {
  // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const result = await Contact.findByIdAndDelete(id);
  return result || null;
};

export const addContact = async (req) => {
  // Повертає об'єкт доданого контакту.
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
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
