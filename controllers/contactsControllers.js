import * as contactsService from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts(req);
  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({
      message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  const result = await contactsService.addContact(req);
  res.status(201).json(result);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateStatusContactbyId(id, req.body);

    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
