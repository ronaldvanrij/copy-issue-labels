

export function getLinkedIssues({ octokit, prNumber, repoOwner, repoName }) {
    return octokit.graphql(
      `
      query getLinkedIssues($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            id
            closingIssuesReferences(first: 100) {
              totalCount
              nodes {
                number
                repository {
                  nameWithOwner
                }
              }
            }
          }
        }
      }
      `,
      {
        owner: repoOwner,
        name: repoName,
        number: prNumber,
      }
    );
  }
  

export function parseLinkedIssues({ octokit, prNumber, repoOwner, repoName }) {

    const data = await getLinkedIssues({
        prNumber: prNumber,
        repoName: repoName,
        repoOwner: repoOwner,
        octokit,
    });

    core.debug(`
    *** GRAPHQL DATA ***
    ${format(data)}
    `);

    const pullRequest = data?.repository?.pullRequest;
    const linkedIssuesCount = pullRequest?.closingIssuesReferences?.totalCount;
    return (pullRequest?.closingIssuesReferences?.nodes || []).map(
        (node) => `${node.number}`
    );
}
