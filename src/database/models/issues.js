const db = require("../index");

let issue = {};

issue.retrieveAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM issues", (err, result) => {
      if (err.error) return reject(err);
      resolve(result);
    });
  });
};

issue.retrieveById = issue_id => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM issues WHERE issue_id=$1",
      [issue_id],
      (err, result) => {
        if (err.error) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

issue.createNewIssue = (
  project_id,
  priority_id,
  user_id,
  status_id,
  title,
  description,
  report_date
) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO issues (project_id, priority_id, user_id, status_id, title, description, report_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        project_id,
        priority_id,
        user_id,
        status_id,
        title,
        description,
        report_date
      ],
      (err, result) => {
        if (err.error) return reject(err);
        resolve(result);
      }
    );
  });
};

issue.updateIssue = (priority_id, status_id, title, description, issue_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE issues SET priority_id=$1, status_id=$2, title=$3, description=$4 WHERE issue_id=$5`,
      [priority_id, status_id, title, description, issue_id],
      (err, result) => {
        if (err.error) return reject(err);
        resolve(result);
      }
    );
  });
};

issue.deleteIssue = issue_id => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM issues WHERE issue_id=$1`,
      [issue_id],
      (err, result) => {
        if (err.error) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

// INSERT INTO issues(project_id, priority_id, user_id, status_id, title, description, report_date)
// VALUES (6, '11', 12, '1', 'security breach', 'data security breach', '2004-10-19T08:23:54.000Z');

module.exports = issue;