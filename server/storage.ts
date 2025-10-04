import {
  type User,
  type InsertUser,
  type Card,
  type InsertCard,
  type Transaction,
  type InsertTransaction,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  getCards(userId: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: string): Promise<boolean>;

  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, Card>;
  private transactions: Map<string, Transaction>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.transactions = new Map();
    this.contacts = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const userId = "user-1";
    const user: User = {
      id: userId,
      name: "Abdullah Ghatasheh",
      email: "abdgfx@gmail.com",
      mobile: "+962 79 890 50 14",
      balance: "14235.34",
    };
    this.users.set(userId, user);

    const card1: Card = {
      id: "card-1",
      userId,
      holderName: "Abdullah Ghatasheh",
      cardNumber: "2312",
      balance: "1234.00",
      gradient: "from-purple-200 via-purple-300 to-purple-400",
      createdAt: new Date(),
    };
    const card2: Card = {
      id: "card-2",
      userId,
      holderName: "Abdullah Ghatasheh",
      cardNumber: "5432",
      balance: "890.00",
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      createdAt: new Date(),
    };
    const card3: Card = {
      id: "card-3",
      userId,
      holderName: "Abdullah Ghatasheh",
      cardNumber: "3245",
      balance: "2354.00",
      gradient: "from-purple-900 via-purple-700 to-purple-600",
      createdAt: new Date(),
    };
    this.cards.set(card1.id, card1);
    this.cards.set(card2.id, card2);
    this.cards.set(card3.id, card3);

    const contacts = [
      {
        id: "contact-1",
        userId,
        name: "Ali Ahmed",
        phone: "+1-300-555-0161",
        avatarColor: "bg-orange-500",
      },
      {
        id: "contact-2",
        userId,
        name: "Steve Gates",
        phone: "+1-300-555-0119",
        avatarColor: "bg-pink-500",
      },
      {
        id: "contact-3",
        userId,
        name: "Elon Jobs",
        phone: "+1-202-555-0171",
        avatarColor: "bg-orange-600",
      },
    ];
    contacts.forEach((contact) => this.contacts.set(contact.id, contact));

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const transactions: Transaction[] = [
      {
        id: "tx-1",
        userId,
        cardId: "card-3",
        merchantName: "Walmart",
        amount: "35.23",
        type: "debit",
        description: "Retailer corporation",
        transactionNo: "23010412432431",
        createdAt: now,
      },
      {
        id: "tx-2",
        userId,
        cardId: null,
        merchantName: "Top up",
        amount: "430.00",
        type: "credit",
        description: "Account top up",
        transactionNo: "23010412432432",
        createdAt: yesterday,
      },
      {
        id: "tx-3",
        userId,
        cardId: "card-3",
        merchantName: "Netflix",
        amount: "13.00",
        type: "debit",
        description: "Subscription",
        transactionNo: "23010412432433",
        createdAt: lastWeek,
      },
      {
        id: "tx-4",
        userId,
        cardId: "card-2",
        merchantName: "Amazon",
        amount: "12.23",
        type: "debit",
        description: "Online purchase",
        transactionNo: "23010412432434",
        createdAt: yesterday,
      },
      {
        id: "tx-5",
        userId,
        cardId: "card-2",
        merchantName: "Nike",
        amount: "50.23",
        type: "debit",
        description: "Sporting goods",
        transactionNo: "23010412432435",
        createdAt: yesterday,
      },
    ];
    transactions.forEach((tx) => this.transactions.set(tx.id, tx));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      mobile: insertUser.mobile,
      balance: insertUser.balance || "0",
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCards(userId: string): Promise<Card[]> {
    return Array.from(this.cards.values())
      .filter((card) => card.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = {
      id,
      userId: insertCard.userId,
      holderName: insertCard.holderName,
      cardNumber: insertCard.cardNumber,
      balance: insertCard.balance || "0",
      gradient: insertCard.gradient || "from-purple-900 via-purple-700 to-purple-600",
      createdAt: new Date(),
    };
    this.cards.set(id, card);
    return card;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transactionNo = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const transaction: Transaction = {
      id,
      userId: insertTransaction.userId,
      cardId: insertTransaction.cardId || null,
      merchantName: insertTransaction.merchantName,
      amount: insertTransaction.amount,
      type: insertTransaction.type,
      description: insertTransaction.description || null,
      transactionNo,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);

    if (transaction.type === "debit") {
      const user = await this.getUser(transaction.userId);
      if (user) {
        const newBalance = parseFloat(user.balance) - parseFloat(transaction.amount);
        await this.updateUser(user.id, { balance: newBalance.toFixed(2) });
      }
      if (transaction.cardId) {
        const card = await this.getCard(transaction.cardId);
        if (card) {
          const newBalance = parseFloat(card.balance) - parseFloat(transaction.amount);
          card.balance = newBalance.toFixed(2);
          this.cards.set(card.id, card);
        }
      }
    } else if (transaction.type === "credit") {
      const user = await this.getUser(transaction.userId);
      if (user) {
        const newBalance = parseFloat(user.balance) + parseFloat(transaction.amount);
        await this.updateUser(user.id, { balance: newBalance.toFixed(2) });
      }
      if (transaction.cardId) {
        const card = await this.getCard(transaction.cardId);
        if (card) {
          const newBalance = parseFloat(card.balance) + parseFloat(transaction.amount);
          card.balance = newBalance.toFixed(2);
          this.cards.set(card.id, card);
        }
      }
    }

    return transaction;
  }

  async getContacts(userId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter((contact) => contact.userId === userId);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      id,
      userId: insertContact.userId,
      name: insertContact.name,
      phone: insertContact.phone,
      avatarColor: insertContact.avatarColor || "bg-purple-500",
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }
}

export const storage = new MemStorage();
