export const getContent = (filePath, gitlabData) => {
  return fetch(`${gitlabData.repoUrl}/api/v4/projects/${gitlabData.projectId}/repository/files/${filePath}/raw?ref=master`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `${gitlabData.token}`
    }
  })
  .then(response => response.json())
}

export const createBranch = (gitlabData) => {
  const branchName = `figma-update-${(new Date()).getTime()}`
  return fetch(`${gitlabData.repoUrl}/api/v4/projects/${gitlabData.projectId}/repository/branches?branch=${branchName}&ref=master`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `${gitlabData.token}`
    },
    method: 'POST'
  })
    .then(response => response.json())
}

export const updatePackage = (message, contents, branch, gitlabData) => {
  const content = window.btoa(JSON.stringify(contents, null, 2))
  const body = JSON.stringify({ 
    branch, 
    content, 
    commit_message: message 
  })
  return fetch(`${gitlabData.repoUrl}/api/v4/projects/${gitlabData.projectId}/repository/files/package.json`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `${gitlabData.token}`
    },
    body,
    method: 'PUT'
  })
  .then(response => response.json())
}

export const createPullRequest = (title, content, branchName, gitlabData) => {
  const body = {
    title,
    description: content,
    source_branch: branchName,
    target_branch: "master"
  }
  return fetch(`${gitlabData.repoUrl}/api/v4/projects/${gitlabData.projectId}/merge_requests`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `${gitlabData.token}`
    },
    body: JSON.stringify(body),
    method: 'POST'
  })
    .then(response => response.json())
}
