import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertCardSchema,
  insertTransactionSchema,
  insertContactSchema,
} from "@shared/schema";

const DEFAULT_USER_ID = "user-1";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/user", async (req, res) => {
    try {
      const validated = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(DEFAULT_USER_ID, validated);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards(DEFAULT_USER_ID);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const validated = insertCardSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const card = await storage.createCard(validated);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: "Invalid card data" });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const success = await storage.deleteCard(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete card" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEFAULT_USER_ID);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const transaction = await storage.createTransaction(validated);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const { contactId, amount } = req.body;
      if (!contactId || !amount) {
        return res.status(400).json({ error: "Contact ID and amount are required" });
      }

      const contact = await storage.getContact(contactId);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      const transaction = await storage.createTransaction({
        userId: DEFAULT_USER_ID,
        cardId: null,
        merchantName: `Transfer to ${contact.name}`,
        amount: amount.toString(),
        type: "debit",
        description: `Money transfer to ${contact.phone}`,
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to process transfer" });
    }
  });

  app.post("/api/nfc-payment", async (req, res) => {
    try {
      const { cardId, merchantName, amount } = req.body;
      if (!cardId || !merchantName || !amount) {
        return res.status(400).json({ error: "Card ID, merchant name, and amount are required" });
      }

      const transaction = await storage.createTransaction({
        userId: DEFAULT_USER_ID,
        cardId,
        merchantName,
        amount: amount.toString(),
        type: "debit",
        description: "NFC Payment",
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to process payment" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts(DEFAULT_USER_ID);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validated = insertContactSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const contact = await storage.createContact(validated);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
