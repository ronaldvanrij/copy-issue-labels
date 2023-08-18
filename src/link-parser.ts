

export function getLinkedIssues(
    octokit: any, 
    prNumber: number, 
    repoOwner: string, 
    repoName: string
) {
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
  

export function parseLinkedIssues(
    octokit: any, 
    prNumber: number, 
    repoOwner: string, 
    repoName: string
) {

    const data = getLinkedIssues(octokit, prNumber, repoName, repoOwner);

    const pullRequest = data?.repository?.pullRequest;
    const linkedIssuesCount = pullRequest?.closingIssuesReferences?.totalCount;
    return (pullRequest?.closingIssuesReferences?.nodes || []).map(
        (node: any) => `${node.number}`
    );
}
