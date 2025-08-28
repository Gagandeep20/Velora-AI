import express from "express";
import Thread from "../models/ThreadSchema.js";
import getOpenAiResponse from "../utils/openAI.js";

const router = express.Router();

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.log(error);
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const thread = await Thread.findOne({ threadId });
  if (!thread) {
    res.status(404).json({ error: "thread not found" });
  }
  res.json(thread.messages);
});

router.delete("/thread/:threadId/", async (req, res) => {
  const { threadId } = req.params;
  try {
    const Deletethread = await Thread.findOneAndDelete({ threadId });
    if (!Deletethread) {
      res.status(404).json({ error: "thread not deleted" });
    }
    res.status(200).json({ success: "thread was deleted" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    res.status(404).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAiResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

// router.post("/test", async (req, res) => {
//   try {
//     const thread = new Thread({
//       threadId: "xyz",
//       title: "test thread",
//     });
//     const response = await thread.save();
//     res.send(response);
//   } catch (error) {
//     console.log(error);
//   }
// });

export default router;
