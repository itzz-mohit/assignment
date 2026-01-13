import Conversation from "../models/Conversation.js";
import Appointment from "../models/Appointment.js";
import { getAIResponse } from "../services/ai.service.js";
import { v4 as uuid } from "uuid";

const appointmentState = {};

export const chatHandler = async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid = sessionId || uuid();

    let convo = await Conversation.findOne({ sessionId: sid });
    if (!convo) {
      convo = await Conversation.create({
        sessionId: sid,
        messages: [],
        context: context || {},
      });
    }

    convo.messages.push({ role: "user", text: message });

    if (!appointmentState[sid]) {
      appointmentState[sid] = {};
    }

    const a = appointmentState[sid];

    const ask = async (text) => {
      convo.messages.push({ role: "bot", text });
      await convo.save();
      return res.json({ sessionId: sid, reply: text });
    };

    if (message.toLowerCase().includes("appointment") || a.started) {
      if (!a.started) {
        a.started = true;
        return ask("Owner name?");
      }

      if (!a.ownerName) {
        a.ownerName = message;
        return ask("Pet name?");
      }

      if (!a.petName) {
        a.petName = message;
        return ask("Phone number?");
      }

      if (!a.phone) {
        a.phone = message;

        await Appointment.create({
          sessionId: sid,
          ownerName: a.ownerName,
          petName: a.petName,
          phone: a.phone,
        });

        delete appointmentState[sid];
        return ask("Appointment booked successfully");
      }
    }

    const reply = await getAIResponse(message);

    convo.messages.push({ role: "bot", text: reply });
    await convo.save();

    return res.json({ sessionId: sid, reply });
  } catch (err) {
    console.error("CHAT CONTROLLER ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
