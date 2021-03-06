const express = require("express");
const humps = require("humps");
const issues = require("../database/models/issues");
const regex = require("../utils/regex");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await issues.retrieveAll();
    res.status(200).json(humps.camelizeKeys(result));
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

router.get("/:issue_id", async (req, res) => {
  const { issue_id } = req.params;

  if (!issue_id.match(regex)) {
    return res.status(400).sendStatus(400);
  }

  try {
    const result = await issues.retrieveById(issue_id);
    if (!result) {
      return res.status(404).json({ message: "Issue ID is not found" });
    }
    res.status(200).json(humps.camelizeKeys(result));
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

router.get("/projects/:project_id", async (req, res) => {
  const { project_id } = req.params;

  if (!project_id.match(regex)) {
    return res.status(400).sendStatus(400);
  }

  try {
    const result = await issues.retrieveIssuesByProjectId(project_id);
    if (result.length == 0) {
      return res.status(404).json({ message: "Project ID is not found" });
    }
    res.status(200).json(humps.camelizeKeys(result));
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  const {
    project_id,
    priority_id,
    user_id,
    status_id,
    title,
    description,
    report_date,
  } = req.body;

  try {
    await issues.createNewIssue(
      project_id,
      priority_id,
      user_id,
      status_id,
      title,
      description,
      report_date
    );
    res.status(201).sendStatus(201);
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

router.patch("/:issue_id", async (req, res) => {
  const { issue_id } = req.params;
  const { priority_id, status_id, title, description } = req.body;

  if (!issue_id.match(regex)) {
    return res.status(400).sendStatus(400);
  }

  try {
    const result = await issues.retrieveById(issue_id);
    if (!result) {
      return res.status(404).json({ message: "Issue ID is not found" });
    }
    await issues.updateIssue(
      priority_id,
      status_id,
      title,
      description,
      issue_id
    );
    res
      .status(200)
      .json(humps.camelizeKeys(await issues.retrieveById(issue_id)));
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

router.delete("/:issue_id", async (req, res) => {
  const { issue_id } = req.params;

  if (!issue_id.match(regex)) {
    return res.status(400).sendStatus(400);
  }

  try {
    const result = await issues.retrieveById(issue_id);
    if (!result) {
      return res.status(404).json({ message: "Issue ID is not found" });
    }
    await issues.deleteIssue(issue_id);
    res.status(200).sendStatus(200);
  } catch (err) {
    res.status(400).sendStatus(400);
  }
});

module.exports = router;
