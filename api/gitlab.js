export const getContent = (filePath, gitlabData) => {
  return fetch(
    `${gitlabData.domain}/api/v4/projects/${gitlabData.projectId}/repository/files/${filePath}/raw?ref=master`,
    {
      headers: {
        "content-type": "application/json",
        "PRIVATE-TOKEN": `${gitlabData.token}`,
      },
    }
  ).then((response) => response.json());
};

export const createBranch = (gitlabData) => {
  const branchName = `figma-update-${new Date().getTime()}`;
  return fetch(
    `${gitlabData.domain}/api/v4/projects/${gitlabData.projectId}/repository/branches?branch=${branchName}&ref=master`,
    {
      headers: {
        "PRIVATE-TOKEN": `${gitlabData.token}`,
      },
      method: "POST",
    }
  ).then((response) => response.json());
};

export const updatePackage = (message, contents, branch, gitlabData) => {
  const content = JSON.stringify(contents, null, 2);
  const body = JSON.stringify({
    branch,
    content,
    commit_message: message,
  });
  return fetch(
    `${gitlabData.domain}/api/v4/projects/${gitlabData.projectId}/repository/files/package.json`,
    {
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": `${gitlabData.token}`,
      },
      body,
      method: "PUT",
    }
  ).then((response) => response.json());
};

export const createMergeRequest = (title, content, branchName, gitlabData) => {
  const body = {
    title,
    description: content,
    source_branch: branchName,
    target_branch: "master",
  };
  return fetch(
    `${gitlabData.domain}/api/v4/projects/${gitlabData.projectId}/merge_requests`,
    {
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": `${gitlabData.token}`,
      },
      body: JSON.stringify(body),
      method: "POST",
    }
  ).then((response) => response.json());
};
