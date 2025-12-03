require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Octokit } = require("@octokit/rest");
const YAML = require("yaml");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://simongu20070911.github.io",
      "http://localhost:4000",
    ],
    credentials: false,
  })
);

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.warn(
    "[dense-backend] GITHUB_TOKEN is not set; GitHub writes will fail."
  );
}
const octokit = new Octokit({ auth: token });
const owner = "simongu20070911";
const repo = "simongu20070911.github.io";

async function getFile(path) {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  return {
    sha: data.sha,
    text: Buffer.from(data.content, "base64").toString("utf8"),
  };
}

async function putFile(path, sha, text, message) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    sha,
    content: Buffer.from(text, "utf8").toString("base64"),
  });
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Append a comment to _data/dense_comments.yml under the given slug
app.post("/api/dense/comment", async (req, res) => {
  try {
    const { slug, handle, body, tags } = req.body || {};
    if (!slug || !body) {
      return res.status(400).json({ error: "slug and body required" });
    }
    const path = "_data/dense_comments.yml";
    const { sha, text } = await getFile(path);
    const doc = YAML.parse(text) || {};

    if (!doc[slug]) {
      doc[slug] = { title: slug, comments: [] };
    }
    if (!Array.isArray(doc[slug].comments)) {
      doc[slug].comments = [];
    }

    doc[slug].comments.push({
      handle: handle || "anon",
      role: "reader",
      tags: tags || [],
      body,
    });

    const updated = YAML.stringify(doc);
    await putFile(path, sha, updated, `Add dense comment to ${slug}`);

    res.json({ ok: true });
  } catch (err) {
    console.error("/api/dense/comment error", err);
    res.status(500).json({ error: "failed to save comment" });
  }
});

// Save invitation / account metadata into _data/dense_invites.yml
app.post("/api/dense/account", async (req, res) => {
  try {
    const { email, handle, bio, status, links, invite } = req.body || {};
    if (!email && !(invite && invite.email)) {
      return res.status(400).json({ error: "email required" });
    }

    const path = "_data/dense_invites.yml";
    let sha = null;
    let doc = {};
    try {
      const file = await getFile(path);
      sha = file.sha;
      doc = YAML.parse(file.text) || {};
    } catch (e) {
      doc = {};
    }

    if (!Array.isArray(doc.requests)) {
      doc.requests = [];
    }

    doc.requests.push({
      at: new Date().toISOString(),
      email: email || (invite && invite.email) || "",
      handle: handle || "",
      bio: bio || "",
      status: status || "",
      links: links || [],
      invite: invite || null,
    });

    const updated = YAML.stringify(doc);
    await putFile(
      path,
      sha,
      updated,
      "Append dense account / invite request"
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("/api/dense/account error", err);
    res.status(500).json({ error: "failed to save account" });
  }
});

// Store moderation reports
app.post("/api/dense/report", async (req, res) => {
  try {
    const { slug, handle, reason } = req.body || {};
    if (!slug || !reason) {
      return res.status(400).json({ error: "slug and reason required" });
    }
    const path = "_data/dense_reports.yml";
    let sha = null;
    let doc = {};
    try {
      const file = await getFile(path);
      sha = file.sha;
      doc = YAML.parse(file.text) || {};
    } catch (e) {
      doc = {};
    }

    if (!Array.isArray(doc.reports)) {
      doc.reports = [];
    }

    doc.reports.push({
      at: new Date().toISOString(),
      slug,
      handle: handle || "",
      reason,
    });

    const updated = YAML.stringify(doc);
    await putFile(path, sha, updated, "Append dense moderation report");

    res.json({ ok: true });
  } catch (err) {
    console.error("/api/dense/report error", err);
    res.status(500).json({ error: "failed to save report" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("[dense-backend] listening on :" + port);
});

